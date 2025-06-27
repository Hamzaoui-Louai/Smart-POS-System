"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Type definitions for Leaflet
declare global {
  interface Window {
    L: any;
  }
}

interface Center {
  latitude: number;
  longitude: number;
}

interface Pharmacy {
  _id: string;
  name: string;
  address: string;
  contact_info?: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  latitude?: number;
  longitude?: number;
}

interface Stock {
  _id: string;
  pharmacy_id: Pharmacy | string;
  medicine_id: {
    _id: string;
    name: string;
    barcode?: string;
    price_for_one?: number;
    price_for_quantity?: number;
  };
  stock_quantity: number;
  expiration_date?: string;
}

const center: Center = { latitude: 36.365, longitude: 6.614719 };

function getTigerToken() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/tigerToken=([^;]+)/);
  return match ? match[1] : '';
}

export default function MapSearchPage() {
  const [medicine, setMedicine] = useState<string>("");
  const [pharmacy, setPharmacy] = useState<string>("");
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Create headers function
  const createHeaders = () => {
    const tigertoken = getTigerToken();
    return {
      'Authorization': `Bearer ${tigertoken}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch pharmacies function
  const fetchPharmacies = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/client/pharmacies', {
        method: 'POST',
        headers: createHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      throw error;
    }
  };

  // Fetch medicines function
  const fetchMedicines = async (query: string = "") => {
    try {
      const response = await fetch('http://localhost:8080/api/client/medicines/search', {
        method: 'POST',
        headers: createHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          latitude: center.latitude,
          longitude: center.longitude,
          radius: 5
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }
  };

  // Load initial data
  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [pharmaciesData, stocksData] = await Promise.all([
        fetchPharmacies(),
        fetchMedicines("")
      ]);
      
      setPharmacies(pharmaciesData);
      setStocks(stocksData);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError("Failed to fetch data. Please make sure you are logged in as a client.");
    } finally {
      setLoading(false);
    }
  };

  // Search medicines with current query
  const searchMedicines = async () => {
    if (!medicine.trim()) {
      // If no medicine query, fetch all medicines
      await loadInitialData();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stocksData = await fetchMedicines(medicine.trim());
      setStocks(stocksData);
    } catch (err) {
      console.error('Error searching medicines:', err);
      setError("Failed to search medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Initialize map and markers
  useEffect(() => {
    if (typeof window === "undefined" || !pharmacies.length) return;
    
    if (!window.L) {
      // Load Leaflet if not loaded
      const link: HTMLLinkElement = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css";
      document.head.appendChild(link);

      const script: HTMLScriptElement = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js";
      script.onload = () => initializeMapWithMarkers();
      document.head.appendChild(script);
    } else {
      initializeMapWithMarkers();
    }
  }, [pharmacies, stocks]);

  // Helper: filter pharmacies by name and by available medicine
  const getFilteredPharmacies = () => {
    let filtered = pharmacies;
    if (pharmacy.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(pharmacy.trim().toLowerCase())
      );
    }
    if (medicine.trim()) {
      // Only show pharmacies that have at least one matching medicine
      const matchingPharmacyIds = new Set(
        stocks
          .filter((s) =>
            s.medicine_id.name.toLowerCase().includes(medicine.trim().toLowerCase())
          )
          .map((s) =>
            typeof s.pharmacy_id === "string" ? s.pharmacy_id : s.pharmacy_id._id
          )
      );
      filtered = filtered.filter((p) => matchingPharmacyIds.has(p._id));
    }
    return filtered;
  };

  // Helper: get drugs for a pharmacy (filtered by medicine search)
  const getDrugsForPharmacy = (pharmacyId: string) => {
    return stocks.filter(
      (s) =>
        (typeof s.pharmacy_id === "string"
          ? s.pharmacy_id === pharmacyId
          : s.pharmacy_id._id === pharmacyId) &&
        (!medicine.trim() ||
          s.medicine_id.name.toLowerCase().includes(medicine.trim().toLowerCase()))
    );
  };

  // Initialize map and add markers for filtered pharmacies
  const initializeMapWithMarkers = () => {
    if (!mapRef.current || !window.L) return;
    
    // Remove old map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    
    // Create map
    const map = window.L.map(mapRef.current).setView([center.latitude, center.longitude], 14);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    
    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    
    // Add markers for filtered pharmacies
    getFilteredPharmacies().forEach((pharmacy) => {
      const coords = pharmacy.location?.coordinates || [pharmacy.longitude, pharmacy.latitude];
      if (!coords || coords.length !== 2) return;
      
      const marker = window.L.marker([coords[1], coords[0]]).addTo(map);
      const drugs = getDrugsForPharmacy(pharmacy._id);
      
      const popupContent = `
        <div style='min-width:200px'>
          <strong>${pharmacy.name}</strong><br/>
          <span>${pharmacy.address || ""}</span><br/>
          <span>${pharmacy.contact_info || ""}</span><br/>
          <hr/>
          <strong>Available Drugs:</strong><br/>
          <ul style='max-height:120px;overflow:auto;padding-left:18px;'>
            ${drugs.length
              ? drugs
                  .map(
                    (d) =>
                      `<li>${d.medicine_id.name} (${d.stock_quantity})` +
                      (d.medicine_id.price_for_one
                        ? ` - ${d.medicine_id.price_for_one} DZD`
                        : "") +
                      `</li>`
                  )
                  .join("")
              : "<li>No drugs found</li>"}
          </ul>
        </div>
      `;
      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
    
    mapInstanceRef.current = map;
  };

  // Handle search button - now searches medicines via API
  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    await searchMedicines();
  };

  // Handle medicine input changes with debounced search
  const handleMedicineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMedicine(e.target.value);
  };

  // Handle pharmacy input changes
  const handlePharmacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPharmacy(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Pharmacy Finder
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Medicine name"
            value={medicine}
            onChange={handleMedicineChange}
            className="flex-1"
          />
          <Input
            placeholder="Pharmacy name"
            value={pharmacy}
            onChange={handlePharmacyChange}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </Button>
        </div>
        {error && (
          <div className="mb-4 text-red-600 text-center font-medium">{error}</div>
        )}
        <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
          <div
            ref={mapRef}
            className="w-full h-full"
            style={{ minHeight: "500px" }}
          />
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">
          Map centered on Guelma, Algeria. Click a marker to see pharmacy info and available drugs.
        </div>
      </div>
    </div>
  );
}
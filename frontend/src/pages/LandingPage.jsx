"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Clock, Star, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { PharmasphereLogoText } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchExpanded, setIsSearchExpanded] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const nearbyPharmacies = [
    { name: "HealthPlus Pharmacy", distance: "0.3 km", rating: 4.8, isOpen: true },
    { name: "MediCare Central", distance: "0.7 km", rating: 4.6, isOpen: true },
    { name: "Wellness Pharmacy", distance: "1.2 km", rating: 4.7, isOpen: false },
    { name: "City Health Store", distance: "1.5 km", rating: 4.5, isOpen: true },
  ]

  const suggestedMedicines = ["Paracetamol", "Ibuprofen", "Aspirin", "Vitamin D", "Omega-3", "Probiotics"]

  const isSearchCompact = scrollY > 100 && !isSearchExpanded

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <PharmasphereLogoText />
            <div className="flex gap-3">
              <Button variant="outline" className="hover:bg-blue-50 bg-transparent">
                Login
              </Button>
              <Button className="btn-primary">Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="animate-fade-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-wide">
              Your Health,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Pharmasphere connects you with trusted pharmacies, tracks your medication history, and ensures you never
              miss a dose. Experience healthcare management reimagined.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-primary text-lg px-8 py-3">Get Started Today</Button>
              <Button
                variant="outline"
                className="text-lg px-8 py-3 hover:bg-blue-50 bg-transparent"
                onClick={() => {
                  document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Learn More About Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative animate-slide-up"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/placeholder.svg?height=200&width=200"
                alt="Pharmacy consultation"
                className="rounded-lg shadow-lg"
              />
              <img
                src="/placeholder.svg?height=200&width=200"
                alt="Medicine delivery"
                className="rounded-lg shadow-lg mt-8"
              />
              <img
                src="/placeholder.svg?height=200&width=200"
                alt="Digital prescription"
                className="rounded-lg shadow-lg -mt-4"
              />
              <img
                src="/placeholder.svg?height=200&width=200"
                alt="Health tracking"
                className="rounded-lg shadow-lg mt-4"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">Who We Are</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing pharmacy management by connecting patients, pharmacies, and healthcare providers
              through intelligent technology and seamless user experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: MapPin,
                title: "Find Nearby Pharmacies",
                description: "Locate trusted pharmacies in your area with real-time availability and ratings.",
              },
              {
                icon: Clock,
                title: "Track Your History",
                description: "Keep detailed records of your medications and prescriptions in one secure place.",
              },
              {
                icon: Star,
                title: "Smart Notifications",
                description: "Get alerts for refills, discounts, and important medication reminders.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="font-heading text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Pharmacy Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Nearby Pharmacies */}
          <motion.div
            className="animate-fade-in"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading text-2xl font-bold text-gray-900 mb-6">Nearby Pharmacies</h3>
            <div className="space-y-4">
              {nearbyPharmacies.map((pharmacy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-shadow hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{pharmacy.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {pharmacy.distance}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{pharmacy.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={pharmacy.isOpen ? "default" : "secondary"}>
                          {pharmacy.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Medicine Search */}
          <motion.div
            className="animate-slide-up"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading text-2xl font-bold text-gray-900 mb-6">Find Your Medicine</h3>
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 text-lg py-3"
                    onFocus={() => setIsSearchExpanded(true)}
                  />
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedMedicines.map((medicine, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => setSearchQuery(medicine)}
                      >
                        {medicine}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full btn-primary">Search Pharmacies</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h4 className="font-heading text-xl font-semibold text-gray-900 mb-2">Interactive Map</h4>
                <p className="text-gray-600">View nearby pharmacies and medicine availability</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Fixed Search Bar */}
      <motion.div
        className={`fixed top-20 right-4 z-40 transition-all duration-300 ${
          isSearchCompact ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        animate={{
          opacity: isSearchCompact ? 1 : 0,
          y: isSearchCompact ? 0 : -16,
        }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-lg border-2 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Quick search..."
                className="w-48 border-0 focus:ring-0"
                onFocus={() => setIsSearchExpanded(true)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <PharmasphereLogoText />
              <p className="mt-4 text-gray-400">Connecting health, one prescription at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Find Pharmacies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-400">support@pharmasphere.com</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Pharmasphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import mongoose from 'mongoose'
import dotenv from 'dotenv';


dotenv.config();
// Define your schema
const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  price_for_one: { type: Number, required: true },
  price_for_quantity: { type: Number, required: true }
});

const Medicine = mongoose.model('Medicine', medicineSchema);

// Configuration
const NUM_MEDICINES = 1000; // Change this for desired quantity
const BASE_DRUG_NAMES = [
  'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Lisinopril', 'Atorvastatin',
  'Metformin', 'Omeprazole', 'Losartan', 'Albuterol', 'Gabapentin',
  'Sertraline', 'Simvastatin', 'Levothyroxine', 'Metoprolol', 'Amlodipine',
  'Hydrochlorothiazide', 'Pantoprazole', 'Escitalopram', 'Fluoxetine', 'Tramadol'
];
const DRUG_FORMS = ['Tablets', 'Capsules', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Inhaler'];
const STRENGTHS = [100, 250, 500, 750, 1000]; // mg/ml units

// Generate random EAN-13 barcode
function generateBarcode() {
  let barcode = '7'; // GS1 prefix for US pharmaceuticals
  // Generate next 11 digits
  for (let i = 0; i < 11; i++) {
    barcode += Math.floor(Math.random() * 10);
  }
  
  // Calculate checksum (last digit)
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i]);
    sum += (i % 2 === 0) ? digit * 1 : digit * 3;
  }
  const checksum = (10 - (sum % 10)) % 10;
  return barcode + checksum;
}

// Generate medicine data
async function generateMedicines(count) {
  const medicines = [];
  const usedBarcodes = new Set();

  for (let i = 0; i < count; i++) {
    // Generate unique barcode
    let barcode;
    do {
      barcode = generateBarcode();
    } while (usedBarcodes.has(barcode));
    usedBarcodes.add(barcode);

    // Create medicine name
    const baseName = BASE_DRUG_NAMES[Math.floor(Math.random() * BASE_DRUG_NAMES.length)];
    const strength = STRENGTHS[Math.floor(Math.random() * STRENGTHS.length)];
    const form = DRUG_FORMS[Math.floor(Math.random() * DRUG_FORMS.length)];
    const name = `${baseName} ${strength}mg ${form}`;

    // Generate prices (unit price always lower than quantity price)
    const unitPrice = parseFloat((Math.random() * 95 + 0.5).toFixed(2));
    const quantityPrice = parseFloat((unitPrice * 0.83).toFixed(2));

    medicines.push({
      name,
      barcode,
      price_for_one: unitPrice,
      price_for_quantity: quantityPrice
    });
  }
  return medicines;
}

// Main function
async function main() {
  try {
    // Connect to MongoDB
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'POS'
      })
      console.log('Connected to MongoDB Atlas');
    
    } catch (err) {
      console.log('Error of Connection to DB', err)
    }
    
    
    console.log('Connected to MongoDB');

    // Generate and insert medicines
    const medicines = await generateMedicines(NUM_MEDICINES);
    const result = await Medicine.insertMany(medicines, { ordered: false });
    
    console.log(`Successfully inserted ${result.length} medicines`);
  } catch (error) {
    console.error('Error:', error.message);
    // Handle specific duplicate error (code 11000)
    if (error.code === 11000) {
      console.log('Duplicate barcodes skipped successfully');
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Execute the script
main();
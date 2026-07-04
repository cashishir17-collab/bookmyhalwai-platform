import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const cities = ["Delhi", "Noida", "Gurugram", "Ghaziabad", "Faridabad", "Lucknow", "Jaipur", "Chandigarh"];

const businessNames = [
  "Royal Sweets House",
  "Sharma Catering Studio",
  "The Grand Biryani Co.",
  "Mughal Feast Kitchen",
  "Nourish Event Caterers",
  "Golden Spoon Catering",
  "Spice Route Banquets",
  "Jai Hind Catering",
  "Annapurna Deluxe",
  "Taj Mahal Kitchen",
  "Saffron & Spice",
  "Desi Feast Works",
  "Veda Catering Co.",
  "Pari Event Services",
  "Hunger & Hearth",
  "Flavour Junction",
  "Crown Catering House",
  "Biryani Boulevard",
  "The Wedding Table",
  "Festival Foods",
];

const ownerNames = ["Amit Sharma", "Priya Kapoor", "Harpreet Singh", "Ritu Verma", "Suresh Gupta", "Mona Bhatia", "Deepak Malhotra", "Anjali Rao", "Nikhil Jain", "Rohit Mehra"];

const cuisines = ["North Indian", "Chinese", "Continental", "South Indian", "Mughlai", "Street Food", "Italian", "Mexican"];
const services = {
  veg: true,
  nonVeg: true,
  jain: true,
  liveCounter: true,
  outdoorCatering: true,
  birthday: true,
  wedding: true,
  corporate: true,
  houseParty: true,
};

function randomChoice<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createVendorSeed(index: number) {
  const city = cities[index % cities.length];
  const businessName = `${randomChoice(businessNames)} ${index + 1}`;
  const ownerName = randomChoice(ownerNames);
  const profileCompletion = randomInt(60, 95);
  const qualityScore = randomInt(65, 96);
  const leadStage = ["Registered", "Documents Pending", "Verification Pending", "Verified", "Approved", "Published"][index % 6];
  const verificationStatus = ["Pending", "Pending", "Verified", "Approved", "Published", "Rejected"][index % 6];

  return {
    businessName,
    ownerName,
    phone: `+91${randomInt(7000000000, 9999999999)}`,
    whatsapp: `+91${randomInt(7000000000, 9999999999)}`,
    email: `${ownerName.toLowerCase().replace(/\s+/g, ".")}+${index}@example.com`,
    city,
    areasServed: [city, `${city} Extension`],
    cuisines: [randomChoice(cuisines), randomChoice(cuisines)],
    services,
    pricing: {
      startingPrice: randomInt(800, 2000),
      silverPackage: randomInt(2500, 4000),
      goldPackage: randomInt(4000, 7000),
      royalPackage: randomInt(7000, 12000),
      travelCharges: randomInt(100, 800),
      advancePercentage: randomInt(20, 50),
    },
    documents: {
      logo: null,
      menuPdf: null,
      fssai: null,
      gst: null,
      kitchenPhotos: [],
      foodPhotos: [],
      staffPhotos: [],
    },
    verificationStatus,
    leadStage,
    profileCompletion,
    qualityScore,
    assignedTo: ["Unassigned", "Asha", "Rohan", "Neha", "Kunal"][index % 5],
    nextFollowUpDate: index % 3 === 0 ? new Date(Date.now() + 86400000 * (index % 5 + 1)).toISOString().slice(0, 10) : "",
    createdAt: new Date(),
    updatedAt: new Date(),
    source: "Seed Demo Vendors",
  };
}

export async function seedVendorData() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const existing = await getDocs(query(collection(db, "vendors"), where("source", "==", "Seed Demo Vendors")));
  if (!existing.empty) {
    return { created: 0, skipped: true };
  }

  const batch = Array.from({ length: 50 }, (_, index) => createVendorSeed(index));
  for (const vendor of batch) {
    await addDoc(collection(db, "vendors"), vendor);
  }

  return { created: batch.length, skipped: false };
}

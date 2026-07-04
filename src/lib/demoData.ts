import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const demoCities = [
  "Delhi",
  "Noida",
  "Gurugram",
  "Ghaziabad",
  "Faridabad",
  "Lucknow",
  "Jaipur",
  "Chandigarh",
];

const businessPrefixes = [
  "Golden",
  "Royal",
  "Noble",
  "Grand",
  "Elegant",
  "Classic",
  "Prime",
  "Heritage",
  "Pure",
  "Flavour",
  "City",
  "Maharaja",
  "Festival",
  "Deluxe",
  "Saffron",
];

const businessSuffixes = [
  "Caterers",
  "Kitchen",
  "Feast",
  "Bites",
  "House",
  "Banquets",
  "Cuisine",
  "Rasoi",
  "Treats",
  "Events",
  "Delights",
];

const cuisines = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Rajasthani",
  "Vegetarian",
  "Live Counters",
  "Continental",
  "Mughlai",
  "Street Food",
  "Fusion",
  "Gujarati",
  "Punjabi",
  "Bengali",
  "Hyderabadi",
];

const adjectives = ["Elegant", "Traditional", "Premium", "Busy", "Trusted", "Luxury", "Royal", "Festive", "Fresh", "Signature"];
const nouns = ["Banquets", "Delight", "Kitchen", "House", "Feast", "Studio", "Treats", "Nosh", "Savor", "Gathering"];

const firstNames = ["Aarav", "Meera", "Aditi", "Rohan", "Kavya", "Dev", "Riya", "Anika", "Nikhil", "Sakshi", "Varun", "Pooja", "Parth", "Sneha", "Ishaan"];
const lastNames = ["Sharma", "Verma", "Singh", "Kapoor", "Malhotra", "Patel", "Gupta", "Chopra", "Bhatia", "Ahuja", "Rao", "Sethi", "Khurana", "Nair", "Jain"];

function pick<T>(values: T[], index: number) {
  return values[index % values.length];
}

function makeId(prefix: string, index: number) {
  return `${prefix}-${String(index + 1).padStart(2, "0")}`;
}

function makePhone(index: number) {
  return `+91${9000000000 + index}`.slice(0, 13);
}

export function createDemoVendors() {
  return Array.from({ length: 50 }, (_, index) => {
    const city = pick(demoCities, index);
    const cuisine = pick(cuisines, index);
    const basePrice = 280 + (index % 8) * 45;
    const rating = Number((4.4 + (index % 6) * 0.1).toFixed(1));
    const reviews = 80 + index * 7 + (index % 5) * 3;
    const experience = 5 + (index % 10);
    const packageNames = ["Silver", "Gold", "Royal"];
    const packages = packageNames.map((name, packageIndex) => ({
      name,
      pricePerPlate: basePrice + packageIndex * 120,
      description: `${name} package with ${packageIndex === 0 ? "classic starters and desserts" : packageIndex === 1 ? "premium live counters and sweets" : "luxury service with premium beverages"}`,
    }));

    return {
      id: makeId("vendor", index),
      businessName: `${pick(businessPrefixes, index)} ${pick(businessSuffixes, index)}`,
      ownerName: `${pick(firstNames, index)} ${pick(lastNames, index)}`,
      email: `${makeId("vendor", index).toLowerCase()}@demo.bookmyhalwai.com`,
      phone: makePhone(index),
      address: `${index + 10} ${pick(adjectives, index)} ${pick(nouns, index)} Road, ${city}`,
      cities: [city, pick(demoCities, index + 2)],
      cuisine,
      cuisines: [cuisine, pick(cuisines, index + 3), pick(cuisines, index + 5)],
      rating,
      reviews,
      experienceYears: experience,
      description: `${pick(adjectives, index)} catering specialists known for ${cuisine.toLowerCase()} menus and dependable service for weddings and corporate gatherings.`,
      logo: `https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=300&q=80`,
      kitchenImages: [
        `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80`,
        `https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80`,
      ],
      packages,
      pricing: {
        startingPrice: basePrice,
        premiumPackage: true,
      },
      services: {
        veg: index % 2 === 0,
        liveCounters: true,
        outdoorCatering: index % 3 !== 0,
      },
      verificationStatus: "Approved",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  });
}

export function createDemoCustomers() {
  return Array.from({ length: 100 }, (_, index) => ({
    id: makeId("customer", index),
    email: `${makeId("customer", index).toLowerCase()}@demo.bookmyhalwai.com`,
    displayName: `${pick(firstNames, index)} ${pick(lastNames, index)}`,
    phoneNumber: makePhone(index + 100),
    role: "customer",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }));
}

export function createDemoBookings() {
  return Array.from({ length: 250 }, (_, index) => {
    const customer = createDemoCustomers()[index % 100];
    const vendor = createDemoVendors()[index % 50];
    const packageName = vendor.packages[index % vendor.packages.length].name;
    const pricePerPlate = vendor.packages[index % vendor.packages.length].pricePerPlate;
    const guests = 80 + ((index * 7) % 200);
    const estimatedTotal = guests * pricePerPlate;
    const advanceAmount = Math.round(estimatedTotal * 0.2);
    const remainingAmount = estimatedTotal - advanceAmount;
    const status = ["Pending", "Accepted", "Rejected", "Completed"][index % 4];
    const paymentStatus = status === "Rejected" ? "Advance Pending" : ["Advance Pending", "Advance Paid"][index % 2];

    return {
      id: makeId("booking", index),
      bookingId: `BK-${String(index + 1).padStart(4, "0")}`,
      customerId: customer.id,
      vendorId: vendor.id,
      catererId: vendor.id,
      catererName: vendor.businessName,
      packageName,
      eventDate: new Date(2026, 7 + (index % 4), 10 + (index % 20)).toISOString().slice(0, 10),
      guests,
      pricePerPlate,
      estimatedTotal,
      advanceAmount,
      remainingAmount,
      customerName: customer.displayName,
      customerPhone: customer.phoneNumber,
      customerEmail: customer.email,
      eventAddress: `${index + 1} ${pick(adjectives, index)} Avenue, ${pick(demoCities, index)}`,
      specialInstructions: ["Vegetarian spread", "Live counter", "Minimal décor", "Late-night service"][index % 4],
      status,
      paymentStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  });
}

export function createDemoReviews() {
  return Array.from({ length: 500 }, (_, index) => {
    const vendor = createDemoVendors()[(index + 3) % 50];
    const customer = createDemoCustomers()[index % 100];
    const rating = 4 + (index % 5);
    return {
      id: makeId("review", index),
      customerName: customer.displayName,
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      rating,
      review: `${pick(adjectives, index)} service, beautiful presentation and on-time delivery for our celebration.`,
      eventDate: new Date(2026, 6 + (index % 3), 10 + (index % 20)).toISOString().slice(0, 10),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  });
}

export const demoVendors = createDemoVendors();
export const demoCustomers = createDemoCustomers();
export const demoBookings = createDemoBookings();
export const demoReviews = createDemoReviews();

const demoAdminUser = {
  id: "demo-admin",
  email: "admin@bookmyhalwai.com",
  displayName: "Demo Admin",
  role: "admin",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
};

export const demoAccounts = {
  admin: demoAdminUser,
  vendors: demoVendors.slice(0, 5).map((vendor) => ({
    id: vendor.id,
    email: vendor.email,
    displayName: vendor.businessName,
    role: "vendor",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })),
  customers: demoCustomers.slice(0, 5).map((customer) => ({
    id: customer.id,
    email: customer.email,
    displayName: customer.displayName,
    role: "customer",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })),
};

export async function seedDemoDataIfNeeded() {
  if (!db) {
    return { seeded: false, reason: "firebase-not-configured" };
  }

  const collectionsToSeed = [
    { name: "vendors", docs: demoVendors },
    { name: "users", docs: [demoAdminUser, ...demoAccounts.vendors, ...demoAccounts.customers] },
    { name: "bookings", docs: demoBookings.slice(0, 60) },
    { name: "reviews", docs: demoReviews.slice(0, 120) },
  ];

  for (const entry of collectionsToSeed) {
    const snapshot = await getDocs(collection(db, entry.name));
    if (!snapshot.empty) {
      continue;
    }

    for (const docData of entry.docs) {
      await setDoc(doc(db, entry.name, docData.id), docData);
    }
  }

  return { seeded: true, reason: "seeded" };
}

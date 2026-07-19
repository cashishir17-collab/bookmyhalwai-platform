import { addDoc, collection, getDocs, limit, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MARKETPLACE_SERVICES } from "@/data/marketplace";
import { INDIA_STATES } from "@/data/indiaLocations";

const DEMO_SOURCE_TAG = "Demo Seed";

const LOCAL_IMAGES = [
  "/images/home/wedding-reception.jpg",
  "/images/home/festive-celebration.jpg",
  "/images/home/halwai-sweets.jpg",
  "/images/home/large-catering-setup.jpg",
  "/images/home/birthday-catering.jpg",
  "/images/home/guests-enjoying-food.jpg",
  "/images/home/hero-luxury.jpg",
  "/images/home/live-counters.jpg",
  "/images/home/corporate-catering.jpg",
  "/images/home/serving-staff.jpg",
];

const OWNER_NAMES = [
  "Amit Sharma", "Priya Kapoor", "Harpreet Singh", "Ritu Verma", "Suresh Gupta",
  "Mona Bhatia", "Deepak Malhotra", "Anjali Rao", "Nikhil Jain", "Rohit Mehra",
  "Kavita Nair", "Sanjay Reddy",
];

const CATEGORY_BUSINESS_NAMES: Record<string, string[]> = {
  halwai_caterer: ["Royal Caterers", "Sharma Halwai & Sons", "Golden Spoon Catering", "Annapurna Rasoi", "Spice Route Banquets"],
  venue_banquet: ["Grand Celebration Banquets", "The Royal Lawn", "Palace Gardens", "Regal Banquet Hall", "Heritage Marriage Garden"],
  decorator: ["Dream Decor Studio", "Floral Fantasy Events", "Elegant Stage Designs", "Royal Decor Co.", "Blossom Event Decor"],
  tent_house: ["Shanti Tent House", "Royal Tent Services", "Deluxe Shamiana Works", "Bharat Tent Suppliers", "Classic Tent & Lighting"],
  dj: ["DJ Beats Entertainment", "Rhythm Nation DJs", "Party Pulse Sound", "Bass Drop Events", "Metro Music DJs"],
  photographer: ["Moments Photography", "Candid Frames Studio", "Cinematic Weddings Co.", "Forever Frames", "Lenscraft Studios"],
  makeup_artist: ["Glow Bridal Studio", "Makeover Artistry", "Bridal Glam Studio", "Radiance Makeovers", "Divine Bridal Looks"],
  mehendi_artist: ["Henna Traditions", "Mehendi Magic Art", "Intricate Henna Designs", "Royal Henna Studio", "Heena Craft Artists"],
  pandit: ["Vedic Rituals Services", "Shastri Puja Samagri", "Sanatan Puja Seva", "Purohit Sewa Kendra", "Shubh Muhurat Pandit Services"],
  choreographer: ["Rhythm Steps Academy", "Dance Divas Choreography", "Sangeet Moves Studio", "Groove Wedding Choreography", "Step Up Dance Co."],
  return_gifts: ["Thoughtful Favours Co.", "Gift Box Boutique", "Memorable Return Gifts", "Elegant Favours Studio", "Charm Gift Hampers"],
};

function randomChoice<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function seedVendorData() {
  if (!db) {
    throw new Error("Firestore is not configured yet.");
  }

  const existing = await getDocs(
    query(collection(db, "vendors"), where("source", "==", DEMO_SOURCE_TAG), limit(1)),
  );
  if (!existing.empty) {
    return { skipped: true, created: 0 };
  }

  const vendorsCollection = collection(db, "vendors");
  let created = 0;

  for (const service of MARKETPLACE_SERVICES) {
    const names = CATEGORY_BUSINESS_NAMES[service.providerCategory] ?? [service.label];

    for (let i = 0; i < names.length; i += 1) {
      const state = randomChoice(INDIA_STATES);
      const city = randomChoice(state.cities);
      const ownerName = randomChoice(OWNER_NAMES);
      const businessName = names[i];
      const startingPrice = randomInt(5000, 60000);
      const rating = Number((randomInt(40, 50) / 10).toFixed(1));
      const completedEvents = randomInt(15, 220);
      const portfolioPhotos = [randomChoice(LOCAL_IMAGES), randomChoice(LOCAL_IMAGES), randomChoice(LOCAL_IMAGES)];
      const vendorId = `DEMO-${service.providerCategory}-${i + 1}`;

      await addDoc(vendorsCollection, {
        vendorId,
        registrationNumber: vendorId,
        providerCategory: service.providerCategory,
        providerCategoryLabel: service.label,
        businessName,
        ownerName,
        email: `${slugify(businessName)}@demo.bookmyhalwai.com`,
        phoneE164: `+91${randomInt(7000000000, 9999999999)}`,
        mobile: `+91${randomInt(7000000000, 9999999999)}`,
        whatsapp: `+91${randomInt(7000000000, 9999999999)}`,
        state: state.name,
        city,
        areasServed: city,
        address: `${randomInt(1, 200)}, ${service.label} Complex, ${city}`,
        yearsExperience: String(randomInt(2, 20)),
        servicesDescription: service.description,
        pricing: {
          startingPrice,
          silverPackage: startingPrice,
          goldPackage: Math.round(startingPrice * 1.6),
          royalPackage: Math.round(startingPrice * 2.4),
          travelCharges: randomInt(500, 3000),
          advancePercentage: 30,
        },
        socialLinks: {
          instagram: "",
          facebook: "",
          website: "",
          googleBusinessProfile: "",
          googleReviewLink: "",
        },
        uploadedFiles: {
          logo: portfolioPhotos[0],
          portfolioPhotos,
          foodPhotos: [],
          kitchenPhotos: [],
          staffPhotos: [],
          menuPdf: null,
          fssai: null,
          gst: null,
        },
        rating,
        completedEvents,
        leadStage: "Published",
        profileCompletion: 100,
        verificationStatus: "Approved",
        published: true,
        publishedAt: new Date().toISOString(),
        registrationSource: "vendor_self",
        ownershipStatus: "self_registered",
        source: DEMO_SOURCE_TAG,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      created += 1;
    }
  }

  return { skipped: false, created };
}

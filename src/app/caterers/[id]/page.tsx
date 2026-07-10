import { notFound } from "next/navigation";
import Link from "next/link";
import { caterers } from "@/data/caterers";
import BookingSidebar from "@/components/BookingSidebar";
import MenuPackageCard from "@/components/MenuPackageCard";
import ReviewCard from "@/components/ReviewCard";

interface CatererDetailsPageProps {
  params: {
    id: string;
  };
}

const sampleReviews = [
  {
    name: "Riya Sharma",
    rating: 5,
    comment: "The team handled our wedding flawlessly and the food was delicious. Highly recommend!",
    eventType: "Wedding",
  },
  {
    name: "Amit Patel",
    rating: 4.8,
    comment: "Professional service and punctual staff. The live counter was a hit at our corporate event.",
    eventType: "Corporate Event",
  },
  {
    name: "Priya Singh",
    rating: 4.7,
    comment: "Excellent vegetarian spread and very responsive planning support throughout.",
    eventType: "Religious Function",
  },
  {
    name: "Siddharth Mehta",
    rating: 4.9,
    comment: "Premium food quality, efficient service, and great presentation. Our guests loved it.",
    eventType: "Engagement",
  },
  {
    name: "Nikita Rao",
    rating: 4.6,
    comment: "Fresh ingredients and fast setup. The menu options were exactly what we wanted.",
    eventType: "Birthday",
  },
];

export function generateStaticParams() {
  return caterers.map((caterer) => ({ id: caterer.id }));
}

export default function CatererDetailsPage({ params }: CatererDetailsPageProps) {
  const caterer = caterers.find((item) => item.id === params.id);

  if (!caterer) {
    notFound();
  }

  return (
    <main className="page-shell min-h-screen px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="section-shell rounded-[2rem] p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-[#0F172A]">Verified caterer</p>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                {caterer.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                  Verified
                </span>
                <span>⭐ {caterer.rating.toFixed(1)}</span>
                <span>{caterer.events} events completed</span>
                <span>{caterer.city}</span>
                <span>₹{caterer.price}/plate</span>
              </div>
            </div>
            <Link
              href="/caterers"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#0F172A]"
            >
              Back to Listings
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-8">
            <section className="section-shell rounded-[2rem] p-6">
              <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <div className="h-[380px] rounded-[1.75rem] bg-slate-100" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-24 rounded-[1.5rem] bg-slate-100" />
                    ))}
                  </div>
                </div>

                <div className="space-y-6 p-4">
                  <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-xl font-semibold text-slate-900">About</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {caterer.name} brings premium culinary experiences to every event. From
                      bespoke menus to seamless execution, the team specializes in creating
                      memorable catering services across weddings, corporate gatherings, and
                      private celebrations.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                        <p className="font-semibold text-slate-900">Years of experience</p>
                        <p className="mt-2">12 years</p>
                      </div>
                      <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                        <p className="font-semibold text-slate-900">Service areas</p>
                        <p className="mt-2">Delhi NCR, Noida, Gurugram</p>
                      </div>
                      <div className="rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                        <p className="font-semibold text-slate-900">Food style</p>
                        <p className="mt-2">{caterer.foodType ?? "Mixed"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-xl font-semibold text-slate-900">Available Cuisines</h2>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {caterer.cuisines.map((cuisine) => (
                        <span
                          key={cuisine}
                          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="section-shell rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Sample Menu Packages</h2>
                  <p className="mt-2 text-sm text-slate-500">Choose a package that suits your event and budget.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <MenuPackageCard
                  title="Silver Package"
                  price={450}
                  features={["Welcome Drink", "Starters", "Main Course", "Dessert"]}
                  liveCounter={false}
                  foodType={caterer.foodType ?? "Mixed"}
                />
                <MenuPackageCard
                  title="Gold Package"
                  price={650}
                  features={["Welcome Drink", "Starters", "Main Course", "Dessert"]}
                  liveCounter={true}
                  foodType={caterer.foodType ?? "Mixed"}
                />
                <MenuPackageCard
                  title="Royal Package"
                  price={950}
                  features={["Welcome Drink", "Starters", "Main Course", "Dessert"]}
                  liveCounter={true}
                  foodType={caterer.foodType ?? "Mixed"}
                />
              </div>
            </section>

            <section className="section-shell rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
                  <p className="mt-2 text-sm text-slate-500">Hear from customers who booked this caterer.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6">
                {sampleReviews.map((review) => (
                  <ReviewCard key={review.name} {...review} />
                ))}
              </div>
            </section>
          </div>

          <div className="lg:sticky lg:top-8">
            <BookingSidebar catererId={caterer.id} />
          </div>
        </div>
      </div>
    </main>
  );
}

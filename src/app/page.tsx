const eventTypes = [
  "Wedding",
  "Birthday",
  "Engagement",
  "Griha Pravesh",
  "Corporate Event",
  "Religious Function",
];

const caterers = [
  {
    name: "Sharma Halwai & Caterers",
    location: "Noida",
    price: "₹450/plate onwards",
    rating: "4.8",
  },
  {
    name: "Royal Feast Caterers",
    location: "Delhi NCR",
    price: "₹650/plate onwards",
    rating: "4.7",
  },
  {
    name: "Annapurna Rasoi",
    location: "Ghaziabad",
    price: "₹350/plate onwards",
    rating: "4.6",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-orange-50 text-gray-900">
      <section className="px-8 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto">
          Book Verified Halwai & Caterers for Every Event
        </h2>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Compare menus, prices, ratings and availability. Plan your event with
          trusted caterers across your city.
        </p>

        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-4 grid md:grid-cols-4 gap-3">
          <input className="border rounded-xl p-3" placeholder="City" />
          <input className="border rounded-xl p-3" placeholder="Event Type" />
          <input className="border rounded-xl p-3" placeholder="Guests" />
          <button className="bg-orange-600 text-white rounded-xl font-semibold py-3">
            Search
          </button>
        </div>
      </section>

      <section className="px-8 py-10">
        <h3 className="text-2xl font-bold text-center">Popular Event Types</h3>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {eventTypes.map((event) => (
            <div
              key={event}
              className="bg-white rounded-2xl p-6 shadow-sm text-center font-semibold"
            >
              {event}
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-14">
        <h3 className="text-2xl font-bold text-center">Featured Caterers</h3>

        <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {caterers.map((caterer) => (
            <div
              key={caterer.name}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <div className="h-40 bg-orange-100 rounded-xl mb-5" />
              <h4 className="text-xl font-bold">{caterer.name}</h4>
              <p className="text-gray-600 mt-1">{caterer.location}</p>
              <p className="mt-3 font-semibold">{caterer.price}</p>
              <p className="mt-2 text-sm">⭐ {caterer.rating} rating</p>

              <button className="mt-5 w-full bg-orange-600 text-white py-3 rounded-xl font-semibold">
                View Details
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-white text-center py-8">
        © 2026 BookMyHalwai. India’s catering marketplace.
      </footer>
    </main>
  );
}

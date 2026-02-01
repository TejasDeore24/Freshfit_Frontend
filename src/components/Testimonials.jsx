import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

function Testimonials() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const testimonials = [
    {
      text: "FreshFit made donating my old clothes so easy! I feel great knowing they’re helping people in need.",
      name: "Priya S."
    },
    {
      text: "As an NGO, we’ve been able to manage donations efficiently and connect with volunteers quickly!",
      name: "Helping Hands NGO"
    },
    {
      text: "I love seeing the progress updates of my donations. Makes giving clothes so satisfying!",
      name: "Rohit K."
    },
    {
      text: "Joining an NGO through FreshFit was seamless. Highly recommended!",
      name: "Anjali M."
    },
    {
      text: "Quick, reliable, and the platform is very user-friendly. Love it!",
      name: "Vikram P."
    },
    {
      text: "Volunteering has never been this easy. FreshFit makes a difference!",
      name: "Sneha T."
    }
  ];

  return (
    <div className="bg-indigo-50 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        What Our Users Say
      </h2>

      <div className="relative max-w-6xl mx-auto">
        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-indigo-100 transition"
        >
          <ChevronLeft size={28} className="text-indigo-600" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-indigo-100 transition"
        >
          <ChevronRight size={28} className="text-indigo-600" />
        </button>

        {/* Scrollable area */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6"
        >
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex-none w-80 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:scale-105 snap-center"
            >
              <p className="text-gray-600 mb-4">{t.text}</p>
              <h3 className="text-lg font-semibold">{t.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;

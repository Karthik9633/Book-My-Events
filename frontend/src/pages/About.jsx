import { Link } from "react-router-dom";
import { Target, Eye, Heart } from "lucide-react";
import karthikImg from "../images/karthik.PNG";

const About = () => {
  return (
    <div className="bg-gray-50 pt-24">

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6">
        <div
          className="relative rounded-3xl overflow-hidden h-[420px] flex items-center justify-center text-center text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506157786151-b8491531f063')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/70"></div>

          <div className="relative z-10 max-w-3xl px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Bringing people together <br />
              through experiences.
            </h1>

            <p className="text-lg text-white/80 mb-8">
              Connecting communities and creating lasting memories through
              world-class local events. We believe every interaction is an
              opportunity for growth.
            </p>

            <Link
              to="/search"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 rounded-full font-semibold shadow-xl hover:opacity-95 transition"
            >
              Explore Our Events
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CORE PILLARS ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <p className="text-xs uppercase text-purple-600 font-bold tracking-widest mb-4">
          Our Foundation
        </p>

        <h2 className="text-3xl font-bold mb-4">
          Our Core Pillars
        </h2>

        <p className="text-gray-500 max-w-xl mb-12">
          Rooted in community and driven by passion, our pillars define how we operate and the impact we strive to make every day.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full mb-6">
              <Target className="text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Mission</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              To provide a seamless, intuitive platform for discovering and hosting local events that enrich lives and foster meaningful social connections.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full mb-6">
              <Eye className="text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Vision</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              To be the world's most trusted and vibrant hub for community engagement, where every city’s heartbeat is felt through its local gatherings.
            </p>
          </div>

          {/* Values */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full mb-6">
              <Heart className="text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Values</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Inclusivity, transparency, and excellence. We prioritize the safety and delight of our community in every experience we facilitate.
            </p>
          </div>

        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-28">

        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-xs uppercase text-purple-600 font-bold tracking-widest mb-2">
              The Innovators
            </p>

            <h2 className="text-3xl font-bold">
              Meet the Leadership Team
            </h2>

            <p className="text-gray-500 mt-3 max-w-xl">
              Our diverse team of experts is dedicated to revolutionizing how you experience your city.
            </p>
          </div>

          <button className="border border-purple-600 text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition">
            Join the Team
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {[
            {
              name: "Karthik B",
              role: "CEO & Founder",
              img: karthikImg,
              desc: "10+ years in event innovation."
            },
            {
              name: "Sarah Chen",
              role: "Head of Operations",
              img: "https://randomuser.me/api/portraits/women/44.jpg",
              desc: "Operational strategist and logistics expert."
            },
            {
              name: "Marcus Thorne",
              role: "Lead Developer",
              img: "https://randomuser.me/api/portraits/men/65.jpg",
              desc: "Former systems engineer at Google."
            },
            {
              name: "Elena Rodriguez",
              role: "Community Manager",
              img: "https://randomuser.me/api/portraits/women/68.jpg",
              desc: "Advocate for local arts and social impact."
            }
          ].map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.img}
                alt={member.name}
                className="w-full h-72 object-cover rounded-2xl mb-4 grayscale"
              />

              <h4 className="font-semibold">{member.name}</h4>
              <p className="text-purple-600 text-sm">{member.role}</p>
              <p className="text-gray-500 text-sm mt-2">{member.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= FOOTER SPACING ================= */}
      <div className="h-24"></div>

    </div>
  );
};

export default About;
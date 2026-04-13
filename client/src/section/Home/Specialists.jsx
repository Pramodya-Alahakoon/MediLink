import { motion } from "framer-motion";
import { FiStar, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const specialists = [
  {
    id: 1,
    name: "Dr. Julian Thorne",
    title: "Cardiologist",
    rating: "4.9",
    reviews: "234",
    image: "/Images/specialist_1.png",
    available: true,
    color: "from-blue-50 to-blue-100/40",
  },
  {
    id: 2,
    name: "Dr. Sarah Al-Sayed",
    title: "Pediatrician",
    rating: "4.8",
    reviews: "189",
    image: "/Images/specialist_2.png",
    available: true,
    color: "from-violet-50 to-violet-100/40",
  },
  {
    id: 3,
    name: "Dr. Marcus Chen",
    title: "Orthopedic Surgeon",
    rating: "5.0",
    reviews: "411",
    image: "/Images/specialist_3.png",
    available: true,
    color: "from-primary/5 to-primary/10",
  },
  {
    id: 4,
    name: "Dr. Maria Rodriguez",
    title: "Neurologist",
    rating: "4.7",
    reviews: "156",
    image: "/Images/specialist_4.png",
    available: false,
    color: "from-pink-50 to-pink-100/40",
  },
];

function Specialists() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-primary/8 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 relative z-10">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-xs font-bold font-inter tracking-widest text-primary uppercase mb-3">
              Our Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-tertiary leading-tight">
              Meet the doctors
              <br />who have your back.
            </h2>
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => navigate('/appointments')}
            className="text-sm font-semibold text-primary font-inter hover:underline underline-offset-4 whitespace-nowrap flex-shrink-0 mb-1"
          >
            See all doctors →
          </motion.button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {specialists.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-primary/10 hover:shadow-xl hover:shadow-primary/8 transition-all duration-300 cursor-pointer flex flex-col"
              onClick={() => navigate('/appointments')}
            >
              {/* Image area */}
              <div className={`relative h-56 bg-gradient-to-b ${doc.color} flex items-end justify-center overflow-hidden pt-4`}>
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-[78%] h-[88%] object-cover object-top transition-transform duration-500 group-hover:scale-105 z-10 relative drop-shadow-md"
                />
                {/* Availability dot */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1 shadow-sm z-20">
                  <span className={`w-2 h-2 rounded-full ${doc.available ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`} />
                  <span className="text-[11px] font-semibold text-tertiary font-inter">{doc.available ? 'Available' : 'Busy'}</span>
                </div>
                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white rounded-full px-2.5 py-1 shadow-sm z-20">
                  <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] font-bold text-tertiary font-inter">{doc.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold font-manrope text-tertiary text-base mb-0.5">{doc.name}</h3>
                <p className="text-xs text-neutral font-inter mb-1">{doc.title}</p>
                <p className="text-[11px] text-neutral/70 font-inter mb-5">{doc.reviews} reviews</p>
                <button className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-tertiary hover:bg-primary hover:text-white text-sm font-semibold font-inter transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <FiCalendar className="w-3.5 h-3.5" />
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Specialists;

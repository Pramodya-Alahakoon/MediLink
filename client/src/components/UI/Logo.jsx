import { Link } from "react-router-dom";

function Logo({ className = "w-[120px] h-auto object-contain" }) {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <img src="/Images/logo.png" alt="MediLink Cloud Logo" className={className} />
    </Link>
  );
}

export default Logo;

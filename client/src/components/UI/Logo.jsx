import { Link } from "react-router-dom";

function Logo({ className = "w-[112px] h-[54px]" }) {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div className={`flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg ${className}`}>
        <div className="flex flex-col items-center justify-center">
          <span className="text-white font-bold text-lg leading-none">M</span>
         
        </div>
      </div>
    </Link>
  );
}

export default Logo;

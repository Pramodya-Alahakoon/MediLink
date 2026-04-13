import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Appointments", path: "/appointments" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
];

const socials = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
];

const contactInfo = [
  { icon: FiMapPin, text: "123 Healthcare Way, Colombo 03, Sri Lanka" },
  { icon: FiPhone, text: "+94 11 234 5678" },
  { icon: FiMail, text: "support@medilink.cloud" },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-tertiary text-white w-full font-inter">
      <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 pt-16 pb-8">

        {/* ── TOP GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                <span className="text-white font-black text-base font-manrope">M</span>
              </div>
              <span className="font-bold text-lg text-white font-manrope tracking-tight">
                Medi<span className="text-primary">Link</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              An AI-enabled distributed healthcare appointment system. Connecting patients with world-class care — instantly.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Platform</h3>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.path} className="text-white/60 hover:text-white text-sm transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.path} className="text-white/60 hover:text-white text-sm transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Contact</h3>
            <ul className="space-y-4">
              {contactInfo.map((c, i) => {
                const Icon = c.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-white/60 text-sm leading-relaxed">{c.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs font-inter">
            © {year} MediLink Cloud. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {legalLinks.map((l) => (
              <Link key={l.label} to={l.path} className="text-white/30 hover:text-white/70 text-xs transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

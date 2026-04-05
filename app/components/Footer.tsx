import Link from "next/link";

const EXPLORE_LINKS = ["Local Expertise", "Service Areas", "OEM Catalog"];
const LEGAL_LINKS = ["Privacy Policy", "Terms of Service"];

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-zinc-200/70">
          {/* Brand */}
          <div className="space-y-5">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter text-zinc-900"
            >
              Fixx<span className="text-primary">er</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Professional grade technical mastery for the modern home.
              Licensed, bonded, and local to your neighborhood.
            </p>

            {/* Social buttons */}
            <div className="flex gap-3">
              {[
                { icon: "share", label: "Share" },
                { icon: "thumb_up", label: "Like" },
                { icon: "mail", label: "Email" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-primary hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-label text-xs font-black uppercase tracking-[0.22em] text-zinc-400 mb-5">
                Explore
              </h4>
              <ul className="space-y-3">
                {EXPLORE_LINKS.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="font-label text-sm text-zinc-500 hover:text-primary transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-label text-xs font-black uppercase tracking-[0.22em] text-zinc-400 mb-5">
                Legal
              </h4>
              <ul className="space-y-3">
                {LEGAL_LINKS.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="font-label text-sm text-zinc-500 hover:text-primary transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div id="support">
            <h4 className="font-label text-xs font-black uppercase tracking-[0.22em] text-zinc-400 mb-5">
              Contact Us
            </h4>
            <div className="space-y-5">
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-200">
                  <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors duration-200 text-lg icon-filled">
                    call
                  </span>
                </div>
                <div>
                  <p className="font-bold text-zinc-800 text-sm">1-800-FIXXER-PRO</p>
                  <p className="text-zinc-500 text-xs mt-0.5">24/7 Emergency Dispatch</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-200">
                  <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors duration-200 text-lg icon-filled">
                    location_on
                  </span>
                </div>
                <div>
                  <p className="font-bold text-zinc-800 text-sm">Downtown Service Hub</p>
                  <p className="text-zinc-500 text-xs mt-0.5">422 Artisan Way, Suite 100</p>
                </div>
              </div>

              {/* CTA strip */}
              <button className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:opacity-90 hover:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base icon-filled">build</span>
                Book a Repair Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-400 font-label text-[10px] uppercase tracking-[0.2em]">
            © 2024 Fixxer Technical Mastery. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="material-symbols-outlined text-base text-primary icon-filled">
              favorite
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold">
              Made for your neighborhood
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

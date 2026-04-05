const POINTS = [
  {
    icon: "verified_user",
    title: "Local & Licensed",
    body: "Every Fixxer pro is a neighbor, fully licensed and background-checked for your complete peace of mind.",
    color: "bg-primary-container",
    iconColor: "text-primary",
  },
  {
    icon: "payments",
    title: "Upfront Pricing",
    body: "No hidden fees or surprise hourly rates. You get a transparent, flat-rate quote before any work begins.",
    color: "bg-secondary-container",
    iconColor: "text-secondary",
  },
  {
    icon: "workspace_premium",
    title: "90-Day Guarantee",
    body: "We stand by our mastery. All repairs and OEM parts come with a rock-solid 90-day comprehensive warranty.",
    color: "bg-tertiary-container",
    iconColor: "text-tertiary",
  },
] as const;

export default function DifferenceSection() {
  return (
    <section
      id="services"
      className="py-28 bg-surface-container-low carbon-texture relative overflow-hidden"
    >
      <div className="relative z-10 container mx-auto px-6 md:px-10 max-w-screen-2xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-5">
          <h2 className="font-headline text-5xl md:text-6xl text-on-surface tracking-tight leading-tight">
            The <span className="italic text-primary">Fixxer</span> Difference
          </h2>
          <p className="font-label text-xs uppercase tracking-[0.28em] text-on-surface-variant font-bold max-w-xs text-right">
            Why 12,000+ neighbors choose us
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POINTS.map(({ icon, title, body, color, iconColor }, i) => (
            <div
              key={title}
              className="group bg-surface-container-lowest p-10 rounded-3xl border border-outline shadow-sm hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                <span
                  className={`material-symbols-outlined icon-filled text-3xl ${iconColor}`}
                >
                  {icon}
                </span>
              </div>

              {/* Number */}
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/50 mb-3 block">
                0{i + 1}
              </span>

              <h3 className="font-headline text-2xl mb-4 text-on-surface group-hover:text-primary transition-colors duration-300">
                {title}
              </h3>
              <p className="text-on-surface-variant leading-relaxed">{body}</p>

              {/* Arrow */}
              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors duration-300">
                <span>Learn more</span>
                <span className="material-symbols-outlined text-base transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

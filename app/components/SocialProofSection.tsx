import Image from "next/image";

const TECH_HANDS_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCguhSK33TG_RhXjxPbw7POcfXs9-NRuQIySs8uBnSClHaAKf0MDJYwoSAfFrvsewluvm_QPxXCndf98FvCShQnI3QL2ZPqdAw8O-6Udb7201x4ePL_6jIVmEema2AxlxRCKkGRybo5ys033s0j4Nn_WOpJxeUqrCJwz5lnz1Fi9ViBQ9oY_3TPoJMiRELHZouZ8BA753Yu7hGJEDdi-tFlQYh7IfX_sUlfTEInIu82mD1JZnub_wLfWRgrO5KC3U2n0vYkFH9MY6o";

const SERVICE_VAN_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAlRn2GIMR81b1Q3zRZmqoxQJgcPZ-4Veug5O-QfGpunsv8HlwrRIdCnHvfOpNWwuucu0dpjp1rX6AYg22x434EpalzupYaUUov-O4b1hDQvbchx9TAueQoHGoQN0oA7MiRTH1Mc5XYrhYhfNggAR66uJiKSxS7CnqruWEDqyHUGH4SPhNYSiyCtnZLbefeo_yDMAlgniiGiGe2tsfvXQI4x7vEYebqAIEBHsLv1GW6JsLAoDqaDSKdhZu3q1vWcTzeGkfLcr_X3_M";

export default function SocialProofSection() {
  return (
    <section className="py-28 bg-surface-dim border-y border-outline-variant overflow-hidden">
      <div className="container mx-auto px-6 md:px-10 max-w-screen-2xl">
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 md:p-16 xl:p-20 shadow-xl shadow-black/[0.03] relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
          {/* ── Left: Testimonial ── */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Badge */}
            <div className="inline-flex self-start items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full mb-8">
              <span className="material-symbols-outlined icon-filled text-secondary text-sm">
                stars
              </span>
              <span className="font-label text-xs font-black uppercase tracking-wider">
                Local Expert Badge
              </span>
            </div>

            <h2 className="font-headline text-5xl md:text-6xl text-on-surface mb-10 tracking-tight leading-tight">
              Trusted by your{" "}
              <span className="italic text-primary">neighbors</span>.
            </h2>

            {/* Review */}
            <div className="border-l-4 border-primary pl-8 group">
              {/* Stars */}
              <div className="flex gap-1 text-secondary mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined icon-filled text-xl"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    star
                  </span>
                ))}
              </div>

              <p className="text-xl italic font-headline text-on-surface mb-5 leading-relaxed">
                "The technician arrived within 20 minutes of my call. He fixed
                our Sub-Zero fridge on the spot with genuine parts. Absolute
                lifesaver."
              </p>
              <p className="font-label text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                — Sarah J., Midtown Heights
              </p>
            </div>

            {/* Mini trust bar */}
            <div className="mt-12 flex items-center gap-8 pt-8 border-t border-outline">
              {[
                { icon: "verified", text: "Licensed & Insured" },
                { icon: "support_agent", text: "24/7 Support" },
                { icon: "thumb_up", text: "Satisfaction Guar." },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined icon-filled text-primary text-xl">
                    {icon}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Mosaic ── */}
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
            {/* Col 1 (offset top) */}
            <div className="space-y-4 pt-12">
              {/* Rating card */}
              <div className="bg-surface-container rounded-2xl p-6 text-center group hover:bg-primary hover:text-white transition-all duration-300 cursor-default">
                <p className="text-4xl font-headline font-bold text-primary group-hover:text-white transition-colors duration-300 mb-1">
                  4.9/5
                </p>
                <p className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface-variant group-hover:text-white/80 transition-colors duration-300">
                  Average Rating
                </p>
              </div>

              {/* Hands image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                <Image
                  src={TECH_HANDS_IMG}
                  alt="Close up of a technician's hands carefully adjusting a complex electrical circuit inside an appliance"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-4">
              {/* Van image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                <Image
                  src={SERVICE_VAN_IMG}
                  alt="A clean white Fixxer service van parked on a suburban residential street during a sunny day"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Clients card */}
              <div className="bg-primary rounded-2xl p-6 text-center cursor-default group hover:bg-on-surface transition-all duration-300">
                <p className="text-4xl font-headline font-bold text-on-primary mb-1">
                  12k+
                </p>
                <p className="font-label text-[10px] uppercase tracking-widest font-bold text-on-primary/80">
                  Local Repairs Done
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

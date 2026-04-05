import Image from "next/image";

const APPLIANCES = [
  {
    name: "Refrigerator",
    starting: "$89",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0B1-gRGQ0-y6dLqR66y3RysO__pD34jve1LEeZJRaQC9TyVvJ2CA-OK0CLT4GkQwJtNsWnVU5620xaT8zN4htYRXFuaoyeLUgVI_snL_DhnIIl7MBXEwxudVvN9p5sw9bTI5Wvb4pAG0dkrixsKu9QIcl2W8RXle152nuYZFf-BE6ipkwHmfQR-F2wUTRGDOS-f0buqsJU64_LGadh3iDLTrof5cuUmqEsBbEdL9GY1IX8hT-1i2FDE-3a4JGjyC_OrFN8ko0RV4",
    alt: "Interior of a luxury modern refrigerator filled with fresh produce, bright internal LED lighting and glass shelves",
  },
  {
    name: "Cooking",
    starting: "$75",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3s8n1Y8P9dN4ZdOV0sGANliFTG2L64F1a9gpkUpoIL_b2eCJ3UoBsb3TLmjCYWzyWFm5Zqvu4aL3cgkP8D6onejGF1qw8DRalVCwWPNcY_iLiVNOkDdXQUzNW-IfHoav6h6Dc-7EgEWbE9SIzaeQbSCVhnWb03vN59ryHAxCJHM8huD_9g1omeyb1O2aBq7Q81XelswOkJC9f3Jcx8Lwm7al7qjgnpkoBIECqXplR3IsXThNsGuLfSgFCDG_s9rqTO4_kuE_Don8",
    alt: "High-end professional gas range with blue flames beneath a boiling pot in a luxury kitchen setting",
  },
  {
    name: "Laundry",
    starting: "$85",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVQrVF0gjKqzXmnA-6II5Ve7upg9gasfveq5BOZa7wVv5GqpqsxCjjH9qW7lt8tMNBdHoSq2TNe5VzmaOWm9Ish6ukjHifbxiBufM6XcOde1cef4anUCmi9eE-_zi0mJZC91wNjSvULInj9-eRoPFtep8LhLrqbdu_sc7eejkyYbYExkXxdirWRDLvuKzE8HSBchEHSBAsLN_At8_KjHtdtXIc9xtXGuhNkyfc-j4AAlscfyR_Akysou2Jd7gqMi51kKO6M9PoyCY",
    alt: "Sleek modern washing machine and dryer stack in a minimalist white laundry room with natural light",
  },
  {
    name: "HVAC",
    starting: "$99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWG1RWv-VwqzV7Rq1ME1gQIyJdRIn4mB67fouPdd9ZHSXzHeKAlvnNl5CfLTMyOfIvm1i7uHPHoXUIRo9Ye2QIEpknvT67kHAMaIIE8_coOqc3x52wwbfjShvp2m8u1q82C8KAXC9R1FcX7wdK63lbpd1IZRjjiaRYj3YzEjMXhApbPNrQj6WFiytMWVwwX9HmoU4FZWEYrYa7nbWzYtLHHkIfz2diSKrZ_HlwTQh7guw6Gk2ePU16XYCzCppQhtZSTnqIi98ILDM",
    alt: "Close up of a modern digital thermostat on a clean wall displaying temperature settings",
  },
] as const;

export default function AppliancesSection() {
  return (
    <section id="catalog" className="py-32 bg-surface">
      <div className="container mx-auto px-6 md:px-10 max-w-screen-2xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="font-label text-xs uppercase tracking-[0.28em] font-bold text-on-surface-variant mb-4">
            What we fix
          </p>
          <h2 className="font-headline text-5xl md:text-6xl tracking-tight text-on-surface leading-tight">
            Expert Service for{" "}
            <span className="italic text-primary">Every</span> Appliance
          </h2>
          <div className="h-0.5 w-16 bg-primary mx-auto mt-8 rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {APPLIANCES.map(({ name, starting, image, alt }) => (
            <div key={name} className="group cursor-pointer">
              {/* Image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-5 shadow-sm">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Price badge */}
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <p className="text-white font-label text-[10px] uppercase tracking-[0.2em] font-bold">
                    Starting at {starting}
                  </p>
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:scale-110">
                    <span className="material-symbols-outlined text-white text-base">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="flex justify-between items-center px-1">
                <h3 className="font-headline text-2xl text-on-surface group-hover:text-primary transition-colors duration-300">
                  {name}
                </h3>
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors duration-300">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 border-2 border-outline text-on-surface px-8 h-13 rounded-xl font-bold text-sm uppercase tracking-wider hover:border-primary hover:text-primary transition-all duration-200 hover:scale-[0.97]">
            <span className="material-symbols-outlined text-xl">grid_view</span>
            View All Appliances
          </button>
        </div>
      </div>
    </section>
  );
}

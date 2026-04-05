export interface Service {
  id: string;
  slug: string;
  name: string;
  title: string;
  startingPrice: string;
  icon: string;
  image: string;
  description: string;
  features: string[];
}

export const SERVICES: Service[] = [
  {
    id: "refrigerator",
    slug: "refrigerator",
    name: "Refrigerator",
    title: "Expert Refrigerator Repair",
    startingPrice: "$89",
    icon: "ac_unit",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0B1-gRGQ0-y6dLqR66y3RysO__pD34jve1LEeZJRaQC9TyVvJ2CA-OK0CLT4GkQwJtNsWnVU5620xaT8zN4htYRXFuaoyeLUgVI_snL_DhnIIl7MBXEwxudVvN9p5sw9bTI5Wvb4pAG0dkrixsKu9QIcl2W8RXle152nuYZFf-BE6ipkwHmfQR-F2wUTRGDOS-f0buqsJU64_LGadh3iDLTrof5cuUmqEsBbEdL9GY1IX8hT-1i2FDE-3a4JGjyC_OrFN8ko0RV4",
    description: "Professional grade technical mastery for your kitchen's heart. We specialize in luxury brands and complex refrigeration systems.",
    features: ["Sub-Zero & High-End Specialist", "Genuine OEM Parts", "Same-Day Emergency Dispatch", "90-Day Warranty"],
  },
  {
    id: "cooking",
    slug: "cooking",
    name: "Cooking",
    title: "Professional Range & Oven Repair",
    startingPrice: "$75",
    icon: "cooking",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3s8n1Y8P9dN4ZdOV0sGANliFTG2L64F1a9gpkUpoIL_b2eCJ3UoBsb3TLmjCYWzyWFm5Zqvu4aL3cgkP8D6onejGF1qw8DRalVCwWPNcY_iLiVNOkDdXQUzNW-IfHoav6h6Dc-7EgEWbE9SIzaeQbSCVhnWb03vN59ryHAxCJHM8huD_9g1omeyb1O2aBq7Q81XelswOkJC9f3Jcx8Lwm7al7qjgnpkoBIECqXplR3IsXThNsGuLfSgFCDG_s9rqTO4_kuE_Don8",
    description: "Keep your kitchen running perfectly. Our technicians are factory-trained for gas, electric, and induction cooking appliances.",
    features: ["Wolf & Viking Expert Service", "Calibration & Safety Checks", "Glass Cooktop Specialists", "Upfront Flat-Rate Pricing"],
  },
  {
    id: "laundry",
    slug: "laundry",
    name: "Laundry",
    title: "Premium Washer & Dryer Service",
    startingPrice: "$85",
    icon: "local_laundry_service",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVQrVF0gjKqzXmnA-6II5Ve7upg9gasfveq5BOZa7wVv5GqpqsxCjjH9qW7lt8tMNBdHoSq2TNe5VzmaOWm9Ish6ukjHifbxiBufM6XcOde1cef4anUCmi9eE-_zi0mJZC91wNjSvULInj9-eRoPFtep8LhLrqbdu_sc7eejkyYbYExkXxdirWRDLvuKzE8HSBchEHSBAsLN_At8_KjHtdtXIc9xtXGuhNkyfc-j4AAlscfyR_Akysou2Jd7gqMi51kKO6M9PoyCY",
    description: "Don't let laundry pile up. We provide fast, reliable repairs for all major washer and dryer models.",
    features: ["Vibration & Noise Diagnosis", "Electronic Control Board Specialist", "Vent & Duct Cleaning", "All Parts Guaranteed"],
  },
  {
    id: "hvac",
    slug: "hvac",
    name: "HVAC",
    title: "Modern HVAC Recovery",
    startingPrice: "$99",
    icon: "thermostat",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWG1RWv-VwqzV7Rq1ME1gQIyJdRIn4mB67fouPdd9ZHSXzHeKAlvnNl5CfLTMyOfIvm1i7uHPHoXUIRo9Ye2QIEpknvT67kHAMaIIE8_coOqc3x52wwbfjShvp2m8u1q82C8KAXC9R1FcX7wdK63lbpd1IZRjjiaRYj3YzEjMXhApbPNrQj6WFiytMWVwwX9HmoU4FZWEYrYa7nbWzYtLHHkIfz2diSKrZ_HlwTQh7guw6Gk2ePU16XYCzCppQhtZSTnqIi98ILDM",
    description: "Climate master for your modern home. From digital thermostats to full central units, we restore your comfort quickly.",
    features: ["Smart Thermostat Integration", "Refrigerant Leak Detection", "Full System Performance Audit", "Licensed & Bonded Technicians"],
  },
];

export function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

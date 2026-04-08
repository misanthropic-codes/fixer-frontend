import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getSparePartBySlug } from "@/app/lib/spareParts";

export default async function SparePartDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const part = getSparePartBySlug(slug);

  if (!part) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-14 md:pt-20 pb-14 bg-white min-h-screen">
        <section className="container mx-auto px-6 md:px-10 max-w-screen-xl pt-8 md:pt-14">
          <Link
            href="/spare-parts"
            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Back to Spare Parts
          </Link>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            <div className="relative aspect-[5/4] rounded-3xl overflow-hidden border border-outline shadow-xl shadow-black/5">
              <Image
                src={part.image}
                alt={part.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-primary">
                {part.category}
              </p>
              <h1 className="mt-3 font-headline text-4xl md:text-6xl leading-tight text-on-surface">
                {part.name}
              </h1>
              <p className="mt-4 text-base text-on-surface-variant leading-relaxed">
                {part.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <InfoCard label="Manufacturer" value={part.manufacturer} />
                <InfoCard label="Seller" value={part.seller} />
                <InfoCard label="Delivery" value={part.deliveryEta} />
                <InfoCard label="Warranty" value={part.warranty} />
              </div>

              <div className="mt-6 rounded-2xl border border-outline p-5 bg-surface-container-low">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">
                  Service Booking
                </p>
                <p className="mt-1 text-sm text-on-surface">
                  {part.supportsServiceBooking
                    ? "Available with technician installation support."
                    : "Part-only delivery available."}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex h-12 items-center px-5 rounded-xl bg-primary text-on-primary font-black">
                  {part.price}
                </span>
                <Link
                  href={`/spare-parts/enquiry?part=${part.id}`}
                  className="h-12 px-6 rounded-xl bg-zinc-900 text-white inline-flex items-center font-black uppercase tracking-wider text-xs"
                >
                  Quick Buy Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 md:px-10 max-w-screen-xl mt-12 md:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-outline p-6 bg-surface-container-lowest">
              <h2 className="font-headline text-2xl text-on-surface">
                Compatible Models
              </h2>
              <ul className="mt-4 space-y-3">
                {part.compatibleModels.map((model) => (
                  <li
                    key={model}
                    className="text-sm text-on-surface-variant flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-primary text-base">
                      check_circle
                    </span>
                    {model}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-outline p-6 bg-surface-container-lowest">
              <h2 className="font-headline text-2xl text-on-surface">
                Highlights
              </h2>
              <ul className="mt-4 space-y-3">
                {part.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="text-sm text-on-surface-variant flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-primary text-base">
                      bolt
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline bg-surface-container-low p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 text-sm text-on-surface font-medium">{value}</p>
    </div>
  );
}

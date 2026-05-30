import CTACard from "./CTACard";
import AdDisclosure from "@/components/content/AdDisclosure";
import type { CpaOffer } from "@/types";

interface Props {
  offers: CpaOffer[];
  page_slug: string;
  region_id: string | null;
}

export default function CTAFooter({ offers, page_slug, region_id }: Props) {
  if (offers.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-gray-700">관련 서비스</h2>
      <div className="space-y-2">
        {offers.map((offer) => (
          <CTACard
            key={offer.id}
            offer={offer}
            page_slug={page_slug}
            region_id={region_id}
            adLabel="제휴 광고"
          />
        ))}
      </div>
      <AdDisclosure />
    </section>
  );
}

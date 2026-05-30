import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Subsidy } from "@/types";

interface Props {
  subsidy: Subsidy;
}

const CATEGORY_LABEL: Record<string, string> = {
  marriage: "결혼",
  newlywed: "신혼부부",
  housing: "주거",
};

const CATEGORY_CLASS: Record<string, string> = {
  marriage: "bg-[var(--pink-100)] text-[var(--pink-400)]",
  newlywed: "bg-[var(--lav-100)] text-[var(--lav-600)]",
  housing: "bg-[var(--sage-100)] text-[var(--sage-500)]",
};

export default function SubsidyCard({ subsidy }: Props) {
  return (
    <Card className="w-full transition hover:-translate-y-0.5 hover:border-[var(--lav-200)] hover:shadow-[var(--shadow-md)]">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">
            {subsidy.name}
          </CardTitle>
          <Badge
            variant="secondary"
            className={`shrink-0 border-transparent ${
              CATEGORY_CLASS[subsidy.category] ?? "bg-[var(--lav-50)]"
            }`}
          >
            {CATEGORY_LABEL[subsidy.category] ?? subsidy.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {subsidy.amount_text && (
          <p className="font-semibold text-[var(--lav-600)]">
            {subsidy.amount_text}
          </p>
        )}
        {subsidy.eligibility && (
          <div>
            <span className="font-medium text-[var(--text-strong)]">
              자격 조건:{" "}
            </span>
            <span className="text-[var(--text-secondary)]">
              {subsidy.eligibility}
            </span>
          </div>
        )}
        {subsidy.application && (
          <div>
            <span className="font-medium text-[var(--text-strong)]">
              신청 방법:{" "}
            </span>
            <span className="text-[var(--text-secondary)]">
              {subsidy.application}
            </span>
          </div>
        )}
        {subsidy.source_name && subsidy.source_url && (
          <p className="text-xs text-[var(--text-caption)]">
            출처:{" "}
            <a
              href={subsidy.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--text-secondary)]"
            >
              {subsidy.source_name}
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

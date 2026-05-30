import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  label: string;
  value: string;
  note?: string;
}

interface Props {
  title: string;
  items: DataPoint[];
}

export default function ComparisonCards({ title, items }: Props) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-[var(--text-strong)]">
        {title}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <Card key={idx} className="bg-[var(--lav-50)]/60">
            <CardHeader className="pb-1 pt-4">
              <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="num text-xl font-bold text-[var(--lav-600)]">
                {item.value}
              </p>
              {item.note && (
                <p className="mt-1 text-xs text-[var(--text-caption)]">
                  {item.note}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

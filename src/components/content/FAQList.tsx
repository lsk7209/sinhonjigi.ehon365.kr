import type { FaqItem } from "@/types";

interface Props {
  faqs: FaqItem[];
}

export default function FAQList({ faqs }: Props) {
  if (faqs.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        자주 묻는 질문
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="rounded-lg border bg-white p-4">
            <p className="font-medium text-gray-800">Q. {faq.question}</p>
            <p className="mt-2 text-sm text-gray-600">A. {faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface FairItem {
  name: string;
  date: string;
  location: string;
  url?: string;
}

interface Props {
  fairs: FairItem[];
  region: string;
}

export default function FairList({ fairs, region }: Props) {
  if (fairs.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">웨딩박람회</h2>
        <p className="text-sm text-gray-500">
          {region} 인근 웨딩박람회 정보를 준비 중입니다.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-gray-800">웨딩박람회</h2>
      <div className="space-y-3">
        {fairs.map((fair, idx) => (
          <div key={idx} className="rounded-lg border bg-white p-4">
            <p className="font-medium text-gray-800">{fair.name}</p>
            <p className="mt-1 text-sm text-gray-600">
              {fair.date} · {fair.location}
            </p>
            {fair.url && (
              <a
                href={fair.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-blue-600 underline"
              >
                사전 등록하기
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

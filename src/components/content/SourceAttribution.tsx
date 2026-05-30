interface Source {
  name: string;
  url: string;
  verified_at?: string;
}

interface Props {
  sources: Source[];
}

export default function SourceAttribution({ sources }: Props) {
  if (sources.length === 0) return null;

  return (
    <section className="rounded-lg bg-gray-50 p-4">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">데이터 출처</h3>
      <ul className="space-y-1">
        {sources.map((source, idx) => (
          <li key={idx} className="text-xs text-gray-500">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              {source.name}
            </a>
            {source.verified_at && (
              <span className="ml-1 text-gray-400">
                (확인: {source.verified_at})
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

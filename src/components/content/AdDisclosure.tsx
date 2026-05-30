import Link from "next/link";

export default function AdDisclosure() {
  return (
    <p className="text-xs text-gray-400">
      일부 링크는{" "}
      <Link href="/disclosure" className="underline hover:text-gray-600">
        제휴 광고
      </Link>
      로, 클릭 시 수수료가 발생할 수 있습니다. 광고 여부는 [광고] 라벨로
      표시됩니다.
    </p>
  );
}

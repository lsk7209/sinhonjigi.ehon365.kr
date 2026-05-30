import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-lg text-gray-600">페이지를 찾을 수 없습니다.</p>
      <p className="text-sm text-gray-500">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-blue-700 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

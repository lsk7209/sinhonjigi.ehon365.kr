import Link from "next/link";

const NAV_ITEMS = [
  { href: "/jiwon", label: "지원금" },
  { href: "/wedding", label: "결혼식" },
  { href: "/sinhon", label: "신혼생활" },
];

export default function Nav() {
  return (
    <nav className="flex items-center gap-6">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-700"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

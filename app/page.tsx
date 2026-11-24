import Link from "next/link";
import { practices } from "./practices";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12">
      <h1>Dojo</h1>
      <p className="mb-8 mt-2 opacity-70">Pick a practice.</p>
      <ul className="grid gap-3">
        {practices.map(({ slug, title, description }) => (
          <li key={slug}>
            <Link href={`/${slug}`} className="block rounded-lg border border-current/20 p-4 hover:border-current">
              <h2>{title}</h2>
              <p className="mt-1 opacity-70">{description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

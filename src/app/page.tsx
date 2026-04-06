import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4 dark:from-gray-900 dark:to-gray-950">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Link in Bio
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          One link to share everything.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg">Get started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="secondary">Sign in</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

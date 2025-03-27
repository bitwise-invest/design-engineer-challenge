import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-md">
        <Image
          className="dark:invert"
          src="/bitwise.svg"
          alt="Next.js logo"
          width={102}
          height={24}
          priority
        />

        <h1 className="text-2xl font-bold">
          Welcome to the Design Engineer Technical Interview
        </h1>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Documentation can be found in this:{" "}
            <a
              className="underline font-bold"
              href="https://www.notion.so/bitwise/Design-Engineer-Correlations-Tool-1c38a476fbc48064beeeda3ab4622053"
            >
              Notion Doc
            </a>
          </li>
        </ol>
      </main>
    </div>
  );
}

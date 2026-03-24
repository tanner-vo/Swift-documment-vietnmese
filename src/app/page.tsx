import Link from "next/link";
import {
  CHAPTER_SECTION_TITLES,
  CHAPTER_SECTIONS,
  getChaptersBySection,
} from "@/lib/swift-docs/chapters";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Swift Docs VN Companion
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Danh sách chapter được đồng bộ theo đúng thứ tự tài liệu Swift gốc.
            Mỗi chapter hiển thị song ngữ 2 cột: trái English, phải Vietnamese.
          </p>
        </section>

        {CHAPTER_SECTIONS.map((section) => {
          const chapters = getChaptersBySection(section);

          return (
            <section
              key={section}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
            >
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                {CHAPTER_SECTION_TITLES[section]}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{chapters.length} chapters</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {chapters.map((chapter, idx) => (
                  <Link
                    key={chapter.slug}
                    href={`/chapter/${chapter.slug}`}
                    className="group rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-blue-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500/60 dark:hover:bg-slate-800"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      #{idx + 1}
                    </p>
                    <h3 className="mt-1 text-base font-semibold leading-6 text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">
                      {chapter.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{chapter.description}</p>
                    <p className="mt-3 text-sm font-medium text-blue-700 dark:text-blue-300">Mở chapter →</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

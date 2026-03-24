import Link from "next/link";
import { notFound } from "next/navigation";
import { BilingualChapterReader } from "@/components/bilingual-chapter-reader";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { CHAPTERS } from "@/lib/swift-docs/chapters";
import { getChapterContent } from "@/lib/swift-docs/service";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const runtime = "nodejs";

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params;

  if (!CHAPTERS.some((chapter) => chapter.slug === slug)) {
    notFound();
  }

  const chapter = await getChapterContent(slug);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-medium hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              ← Danh sách chapter
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <ThemeModeToggle />
              <a
                href={chapter.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Mở nguồn gốc
              </a>
            </div>
          </div>
        </section>

        <BilingualChapterReader chapter={chapter} />

        <section className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Nguồn nội dung: Swift.org docs. Tài liệu gốc được cấp phép theo CC BY 4.0.
          Bản này là nội dung chuyển ngữ/biên tập để hỗ trợ học tập; vui lòng đối
          chiếu bản gốc khi cần độ chính xác cao.
        </section>
      </main>
    </div>
  );
}

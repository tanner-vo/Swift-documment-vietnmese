"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ChapterError({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-xl font-semibold">Không thể hiển thị chapter</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Có lỗi runtime khi tải nội dung. Bạn thử tải lại trang hoặc quay về danh
            sách chapter.
          </p>
          <p className="mt-2 break-all rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {error.message}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Thử lại
            </button>
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Về trang chủ
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

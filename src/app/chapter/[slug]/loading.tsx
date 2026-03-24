export default function LoadingChapter() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-300">Đang tải chapter...</p>
        </section>
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            />
          ))}
        </section>
      </main>
    </div>
  );
}

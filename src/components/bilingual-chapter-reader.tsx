"use client";

import { useState } from "react";
import { ChapterContent, ContentBlock } from "@/lib/swift-docs/types";
import { CodeBlock } from "./code-block";

type BilingualChapterReaderProps = {
  chapter: ChapterContent;
};

type SaveState = {
  status: "idle" | "saving" | "saved" | "error";
  message?: string;
};

const translationEditingEnabled =
  process.env.NEXT_PUBLIC_ENABLE_TRANSLATION_EDITING === "true";

function headingClass(level?: number) {
  if (level === 1) {
    return "text-2xl font-bold tracking-tight sm:text-3xl";
  }

  if (level === 2) {
    return "text-xl font-semibold tracking-tight sm:text-2xl";
  }

  return "text-lg font-semibold tracking-tight sm:text-xl";
}

function textClass(block: ContentBlock) {
  switch (block.type) {
    case "heading":
      return `${headingClass(block.headingLevel)} text-slate-900 dark:text-slate-100`;
    case "list":
      return "whitespace-pre-line text-[15px] leading-7 text-slate-800 dark:text-slate-200";
    case "quote":
      return "border-l-4 border-slate-300 pl-3 text-[15px] italic leading-7 text-slate-700 dark:border-slate-600 dark:text-slate-300";
    default:
      return "text-[15px] leading-7 text-slate-800 dark:text-slate-200";
  }
}

function cardClass(block: ContentBlock) {
  if (block.type === "heading") {
    return "rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70";
  }

  return "rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900";
}

export function BilingualChapterReader({ chapter }: BilingualChapterReaderProps) {
  const [blocks, setBlocks] = useState(chapter.blocks);
  const [editMode, setEditMode] = useState(false);
  const [maintainerToken, setMaintainerToken] = useState("");
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});

  const setBlockVi = (blockId: string, vi: string) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== blockId) {
          return block;
        }

        return {
          ...block,
          vi,
        };
      }),
    );
  };

  const saveBlock = async (block: ContentBlock) => {
    if (!maintainerToken) {
      setSaveStates((prev) => ({
        ...prev,
        [block.id]: { status: "error", message: "Nhập mã maintainer trước khi lưu" },
      }));
      return;
    }

    setSaveStates((prev) => ({
      ...prev,
      [block.id]: { status: "saving" },
    }));

    try {
      const response = await fetch("/api/translation-override", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${maintainerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterSlug: chapter.slug,
          blockId: block.id,
          translatedText: block.vi,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể lưu bản dịch tay");
      }

      setBlocks((prev) =>
        prev.map((item) =>
          item.id === block.id
            ? {
                ...item,
                translationSource: "manual",
              }
            : item,
        ),
      );

      setSaveStates((prev) => ({
        ...prev,
        [block.id]: {
          status: "saved",
          message: "Đã lưu",
        },
      }));
    } catch {
      setSaveStates((prev) => ({
        ...prev,
        [block.id]: {
          status: "error",
          message: "Lưu thất bại",
        },
      }));
    }
  };

  const resetBlock = async (block: ContentBlock) => {
    if (!maintainerToken) {
      setSaveStates((prev) => ({
        ...prev,
        [block.id]: { status: "error", message: "Nhập mã maintainer trước khi reset" },
      }));
      return;
    }

    setSaveStates((prev) => ({
      ...prev,
      [block.id]: { status: "saving" },
    }));

    try {
      const response = await fetch("/api/translation-override", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${maintainerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapterSlug: chapter.slug,
          blockId: block.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể reset bản dịch");
      }

      setBlocks((prev) =>
        prev.map((item) =>
          item.id === block.id
            ? {
                ...item,
                vi: item.autoVi ?? item.en,
                translationSource: "auto",
              }
            : item,
        ),
      );

      setSaveStates((prev) => ({
        ...prev,
        [block.id]: {
          status: "saved",
          message: "Đã trả về bản tự động",
        },
      }));
    } catch {
      setSaveStates((prev) => ({
        ...prev,
        [block.id]: {
          status: "error",
          message: "Reset thất bại",
        },
      }));
    }
  };

  if (blocks.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Chapter chưa có dữ liệu hiển thị
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Có thể nguồn tài liệu phản hồi khác định dạng mong đợi. Bạn mở nguồn gốc
          để đối chiếu và thử tải lại sau.
        </p>
        <a
          href={chapter.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-lg bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Mở tài liệu gốc
        </a>
      </section>
    );
  }

  return (
    <>
      <section className="sticky top-2 z-10 rounded-xl border border-slate-200 bg-white/95 p-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Song ngữ
            </p>
            <h1 className="text-lg font-bold leading-7 text-slate-900 dark:text-slate-100 sm:text-2xl">
              {chapter.title}
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Trái EN, phải VI. Chế độ chỉnh sửa chỉ dành cho maintainer đã xác thực.
            </p>
          </div>

          {translationEditingEnabled ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto">
              {editMode ? (
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Mã maintainer
                  <input
                    type="password"
                    autoComplete="off"
                    value={maintainerToken}
                    onChange={(event) => setMaintainerToken(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </label>
              ) : null}
              <button
                type="button"
                onClick={() => setEditMode((prev) => !prev)}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {editMode ? "Tắt chỉnh sửa" : "Chỉnh sửa (maintainer)"}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 lg:sticky lg:top-[6.5rem] lg:z-[5]">
          Trái EN (Original)
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 lg:sticky lg:top-[6.5rem] lg:z-[5]">
          Phải VI ({editMode ? "Chỉnh sửa" : "Hiển thị"})
        </div>

        {blocks.map((block) => {
          const saveState = saveStates[block.id]?.status ?? "idle";
          const saveMessage = saveStates[block.id]?.message;

          return (
            <div key={block.id} className="contents">
              <article className={cardClass(block)}>
                {block.type === "code" ? (
                  <CodeBlock code={block.en} language="swift" />
                ) : (
                  <p className={textClass(block)}>{block.en}</p>
                )}
              </article>

              <article className={cardClass(block)}>
                {block.type === "code" ? (
                  <CodeBlock code={block.vi} language="swift" />
                ) : editMode ? (
                  <div className="space-y-2">
                    <textarea
                      className="min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm leading-7 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
                      value={block.vi}
                      onChange={(event) => setBlockVi(block.id, event.target.value)}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={saveState === "saving"}
                        onClick={() => void saveBlock(block)}
                        className="rounded-md bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saveState === "saving" ? "Đang lưu..." : "Lưu bản dịch tay"}
                      </button>
                      <button
                        type="button"
                        disabled={saveState === "saving"}
                        onClick={() => void resetBlock(block)}
                        className="rounded-md border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                      >
                        Reset về auto
                      </button>
                      {saveMessage ? (
                        <span
                          className={`text-xs ${
                            saveState === "error" ? "text-red-600" : "text-emerald-600"
                          }`}
                        >
                          {saveMessage}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className={textClass(block)}>{block.vi}</p>
                  </div>
                )}
              </article>
            </div>
          );
        })}
      </section>
    </>
  );
}

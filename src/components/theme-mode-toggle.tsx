"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "theme-mode";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemMode(): Exclude<ThemeMode, "system"> {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveMode(mode: ThemeMode): Exclude<ThemeMode, "system"> {
  return mode === "system" ? getSystemMode() : mode;
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  const resolvedMode = resolveMode(mode);

  root.classList.remove("light", "dark");
  root.classList.add(resolvedMode);
  root.style.colorScheme = resolvedMode;
}

export function ThemeModeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "system";
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    return isThemeMode(stored) ? stored : "system";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(mode);

    if (mode !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, [mode]);

  const options: Array<{ value: ThemeMode; label: string }> = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  return (
    <div
      className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-100 p-1 dark:border-slate-600 dark:bg-slate-800"
      role="group"
      aria-label="Chế độ giao diện"
    >
      {options.map((option) => {
        const isActive = option.value === mode;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${
              isActive
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            }`}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

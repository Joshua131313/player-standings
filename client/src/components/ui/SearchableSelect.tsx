import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SearchableOption = {
  value: string;
  label: string;
  meta?: string; // optional small hint text
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: SearchableOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  listClassName?: string;
  emptyText?: string;
};

export const SearchableSelect = ({
  value,
  onChange,
  options,
  placeholder = "Search...",
  disabled,
  className,
  buttonClassName,
  listClassName,
  emptyText = "No results",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label || "";
  }, [options, value]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return options;

    return options.filter((o) => {
      const hay = `${o.label} ${o.value} ${o.meta ?? ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [options, q]);

  // close on outside click
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  // focus search input when opened
  useEffect(() => {
    if (open) {
      setQ("");
      // focus after render
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const selectOption = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKeyDownButton = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((x) => !x);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((x) => !x)}
        onKeyDown={onKeyDownButton}
        className={cn(
          "w-full h-11 px-3 rounded-lg border border-border/60 bg-background/30 backdrop-blur-md",
          "text-left flex items-center justify-between gap-2",
          "hover:bg-background/40 transition",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          buttonClassName
        )}
      >
        <span className={cn("truncate", !value && "text-muted-foreground")}>
          {value ? selectedLabel : placeholder}
        </span>
        <span className="text-muted-foreground text-xs">▼</span>
      </button>

      {open && !disabled && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-full rounded-xl border border-border/60",
            "bg-background/90 backdrop-blur-xl shadow-xl overflow-hidden",
            listClassName
          )}
        >
          <div className="p-2 border-b border-border/50">
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDownInput}
              placeholder={placeholder}
              className={cn(
                "w-full h-10 px-3 rounded-lg border border-border/60 bg-background/40",
                "outline-none focus:ring-2 focus:ring-primary/30"
              )}
            />
          </div>

          <div className="max-h-64 overflow-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              filtered.map((o) => {
                const active = o.value === value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => selectOption(o.value)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg transition flex items-start gap-2",
                      active
                        ? "bg-primary/15 border border-primary/25"
                        : "hover:bg-secondary/40"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">
                        {o.label}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useReadingLogs, ReadingLog } from "@/context/ReadingLogContext";
import {
  BookOpen,
  Plus,
  Trash2,
  Bookmark,
  Search,
  RotateCcw,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Home,
  Compass,
  Settings,
  Sparkles,
} from "lucide-react";

const GENRES = ["Fiction", "Non-Fiction", "Sci-Fi", "Biography", "Other"] as const;
type Genre = typeof GENRES[number];

const GENRE_CHIP_STYLES: Record<Genre, { bg: string; text: string; dot: string; cover: string }> = {
  Fiction: {
    bg: "bg-muc/8 border-muc/15",
    text: "text-muc",
    dot: "bg-muc",
    cover: "bg-muc text-nga",
  },
  "Non-Fiction": {
    bg: "bg-sanho/12 border-sanho/25",
    text: "text-sanho",
    dot: "bg-sanho",
    cover: "bg-sanho text-nga",
  },
  "Sci-Fi": {
    bg: "bg-muc/12 border-muc/20",
    text: "text-muc",
    dot: "bg-muc/80",
    cover: "bg-muc/85 text-nga",
  },
  Biography: {
    bg: "bg-sanho/18 border-sanho/30",
    text: "text-sanho",
    dot: "bg-sanho",
    cover: "bg-sanho/90 text-nga",
  },
  Other: {
    bg: "bg-muc/5 border-muc/10",
    text: "text-muc/75",
    dot: "bg-muc/50",
    cover: "bg-muc/50 text-nga",
  },
};

// ───────────────────────── Add Reading Log Form ─────────────────────────
function AddReadingLogForm() {
  const { addReadingLog } = useReadingLogs();
  const [bookTitle, setBookTitle] = useState("");
  const [minutesRead, setMinutesRead] = useState("");
  const [genre, setGenre] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({
    bookTitle: "",
    minutesRead: "",
    genre: "",
    date: "",
  });
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function validateTitle(v: string) {
    if (!v || !v.trim()) return "Book title is required";
    if (v.trim().length > 80) return "Book title must be at most 80 characters";
    return "";
  }
  function validateMinutes(v: string) {
    if (v === "" || v === undefined) return "Minutes read is required";
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0) return "Minutes read must be a positive number";
    return "";
  }
  function validateGenre(v: string) {
    if (!v) return "Please choose a genre";
    if (!GENRES.includes(v as Genre)) return "Invalid genre";
    return "";
  }
  function validateDate(v: string) {
    if (!v) return "Date is required";
    if (v > today) return "Date cannot be in the future";
    return "";
  }

  const validate = () => {
    const e = {
      bookTitle: validateTitle(bookTitle),
      minutesRead: validateMinutes(minutesRead),
      genre: validateGenre(genre),
      date: validateDate(date),
    };
    setErrors(e);
    return !e.bookTitle && !e.minutesRead && !e.genre && !e.date;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError("");
    setSuccess(false);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reading-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle: bookTitle.trim(),
          minutesRead: parseInt(minutesRead, 10),
          genre,
          note,
          readOn: date,
        }),
      });

      if (res.ok) {
        const log = await res.json();
        addReadingLog(log);
        setBookTitle("");
        setMinutesRead("");
        setGenre("");
        setNote("");
        setDate("");
        setSubmitted(false);
        setErrors({ bookTitle: "", minutesRead: "", genre: "", date: "" });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        const data = await res.json();
        setApiError(data.error || "Failed to add reading session");
      }
    } catch {
      setApiError("Failed to connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="card-editorial p-6 sm:p-7 relative">
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muc text-nga shadow-xs">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-serif font-bold text-muc">Add Reading Session</CardTitle>
            <p className="text-xs text-muc/65">Record a new session to your reading journal</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <form
          data-testid="reading-log-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
        >
          {/* Book Title */}
          <div>
            <Label htmlFor="bookTitle" className="text-[11px] font-bold text-muc uppercase tracking-[0.15em]">
              Book Title <span className="text-sanho">*</span>
            </Label>
            <Input
              id="bookTitle"
              data-testid="input-book-title"
              value={bookTitle}
              onChange={(e) => {
                setBookTitle(e.target.value);
                if (submitted)
                  setErrors((prev) => ({
                    ...prev,
                    bookTitle: validateTitle(e.target.value),
                  }));
              }}
              placeholder="e.g. Atomic Habits"
              className={`mt-1 rounded-[12px] border bg-nga px-3.5 py-2 text-sm transition-all focus:border-sanho focus:ring-1 focus:ring-sanho ${
                errors.bookTitle ? "border-sanho bg-sanho/5" : "border-muc/15"
              }`}
            />
            {errors.bookTitle && (
              <p data-testid="error-book-title" className="text-xs font-medium text-sanho mt-1">
                {errors.bookTitle}
              </p>
            )}
          </div>

          {/* Minutes Read & Genre in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Label htmlFor="minutesRead" className="text-[11px] font-bold text-muc uppercase tracking-[0.15em]">
                Minutes Read <span className="text-sanho">*</span>
              </Label>
              <Input
                id="minutesRead"
                data-testid="input-minutes"
                type="number"
                min="1"
                step="1"
                value={minutesRead}
                onChange={(e) => {
                  setMinutesRead(e.target.value);
                  if (submitted)
                    setErrors((prev) => ({
                      ...prev,
                      minutesRead: validateMinutes(e.target.value),
                    }));
                }}
                placeholder="e.g. 40"
                className={`mt-1 rounded-[12px] border bg-nga px-3.5 py-2 text-sm transition-all focus:border-sanho focus:ring-1 focus:ring-sanho ${
                  errors.minutesRead ? "border-sanho bg-sanho/5" : "border-muc/15"
                }`}
              />
              {errors.minutesRead && (
                <p data-testid="error-minutes" className="text-xs font-medium text-sanho mt-1">
                  {errors.minutesRead}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="genre" className="text-[11px] font-bold text-muc uppercase tracking-[0.15em]">
                Genre <span className="text-sanho">*</span>
              </Label>
              <select
                id="genre"
                data-testid="input-genre"
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value);
                  if (submitted)
                    setErrors((prev) => ({
                      ...prev,
                      genre: validateGenre(e.target.value),
                    }));
                }}
                className={`mt-1 flex h-10 w-full rounded-[12px] border bg-nga px-3 py-2 text-sm transition-all focus:border-sanho focus:ring-1 focus:ring-sanho cursor-pointer ${
                  errors.genre ? "border-sanho bg-sanho/5" : "border-muc/15"
                }`}
              >
                <option value="">Choose genre</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.genre && (
                <p data-testid="error-genre" className="text-xs font-medium text-sanho mt-1">
                  {errors.genre}
                </p>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date" className="text-[11px] font-bold text-muc uppercase tracking-[0.15em]">
              Date <span className="text-sanho">*</span>
            </Label>
            <Input
              id="date"
              data-testid="input-date"
              type="date"
              max={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (submitted)
                  setErrors((prev) => ({
                    ...prev,
                    date: validateDate(e.target.value),
                  }));
              }}
              className={`mt-1 rounded-[12px] border bg-nga px-3.5 py-2 text-sm transition-all focus:border-sanho focus:ring-1 focus:ring-sanho ${
                errors.date ? "border-sanho bg-sanho/5" : "border-muc/15"
              }`}
            />
            {errors.date && (
              <p data-testid="error-date" className="text-xs font-medium text-sanho mt-1">
                {errors.date}
              </p>
            )}
          </div>

          {/* Note (Optional) */}
          <div>
            <Label htmlFor="note" className="text-[11px] font-bold text-muc uppercase tracking-[0.15em]">
              Note <span className="text-muc/40 font-normal lowercase">(optional)</span>
            </Label>
            <Input
              id="note"
              data-testid="input-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Chapter 3 reflections"
              className="mt-1 rounded-[12px] border border-muc/15 bg-nga px-3.5 py-2 text-sm transition-all focus:border-sanho focus:ring-1 focus:ring-sanho"
            />
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="rounded-[12px] border border-sanho/30 bg-sanho/10 p-3">
              <p data-testid="error-reading-log" className="text-xs font-medium text-sanho flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{apiError}</span>
              </p>
            </div>
          )}

          {/* Form Success Alert */}
          {success && (
            <div className="rounded-[12px] border border-muc/20 bg-muc text-nga p-3 shadow-subtle">
              <p
                data-testid="reading-log-success"
                className="text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-sanho" />
                <span>Reading session added</span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            data-testid="btn-add-reading-log"
            disabled={isSubmitting}
            className="w-full btn-pill-dark py-5 text-sm font-semibold cursor-pointer mt-1"
          >
            {isSubmitting ? "Adding Session..." : "Add Reading Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ───────────────────────── Reading Log Item ─────────────────────────
function ReadingLogItem({ log }: { log: ReadingLog }) {
  const { updateReadingLog, deleteReadingLog } = useReadingLogs();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const chipStyle = GENRE_CHIP_STYLES[log.genre as Genre] || GENRE_CHIP_STYLES.Other;
  const initial = (log.bookTitle.trim().charAt(0) || "B").toUpperCase();

  const handleToggleFavorite = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      const res = await fetch(`/api/reading-logs/${log.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: !log.favorite }),
      });
      if (res.ok) {
        const updated = await res.json();
        updateReadingLog(updated);
      }
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/reading-logs/${log.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        deleteReadingLog(log.id);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      data-testid="reading-log-item"
      className="card-editorial p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 relative group"
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
        {/* CSS Book Cover Spine */}
        <div
          className={`w-10 sm:w-12 h-14 sm:h-16 rounded-[6px] shrink-0 flex items-center justify-center font-serif text-lg sm:text-xl font-bold shadow-subtle border border-muc/10 ${chipStyle.cover}`}
        >
          {initial}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              data-testid="reading-log-title"
              className="text-base sm:text-lg font-serif font-bold text-muc truncate max-w-[200px] sm:max-w-xs"
            >
              {log.bookTitle}
            </span>
            <span
              data-testid="reading-log-genre"
              className={`inline-flex items-center gap-1 rounded-pill border px-2.5 py-0.5 text-[11px] font-semibold ${chipStyle.bg} ${chipStyle.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${chipStyle.dot}`} />
              {log.genre}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muc/70">
            {/* Reading Minutes: Plain integer in reading-log-minutes */}
            <div className="flex items-center gap-1 font-semibold text-muc">
              <Clock className="h-3.5 w-3.5 text-sanho" />
              <span data-testid="reading-log-minutes" className="font-bold text-sm">
                {log.minutesRead}
              </span>
              <span className="text-xs font-normal text-muc/60">mins</span>
            </div>

            <div className="flex items-center gap-1 text-muc/65">
              <Calendar className="h-3.5 w-3.5 opacity-60" />
              <span data-testid="reading-log-date">{log.readOn}</span>
            </div>

            {log.note && (
              <span className="hidden md:inline truncate max-w-xs text-muc/50 italic">
                &ldquo;{log.note}&rdquo;
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          data-testid="btn-toggle-favorite"
          aria-pressed={log.favorite ? "true" : "false"}
          onClick={handleToggleFavorite}
          title={log.favorite ? "Unfavorite session" : "Favorite session"}
          className={`h-9 w-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            log.favorite
              ? "bg-sanho/15 text-sanho hover:bg-sanho/25"
              : "text-muc/30 hover:text-sanho hover:bg-sanho/10"
          }`}
        >
          <Bookmark className="h-4 w-4" fill={log.favorite ? "currentColor" : "none"} />
        </button>
        <button
          data-testid="btn-delete-reading-log"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete session"
          className="h-9 w-9 rounded-full flex items-center justify-center text-muc/35 transition-all hover:text-sanho hover:bg-sanho/10 cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ───────────────────────── Summary ─────────────────────────
interface SummaryData {
  count: number;
  favoriteCount: number;
  totalMinutes: number;
  breakdown: { genre: string; count: number; total: number }[];
}

function SummaryPanel({ summary }: { summary: SummaryData }) {
  return (
    <Card className="editorial-glass rounded-3xl p-6 relative">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muc text-nga shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <CardTitle className="text-base font-serif font-bold text-muc">Summary</CardTitle>
          </div>
          <span className="text-[10px] font-bold tracking-[0.18em] text-muc/50 uppercase">
            Live Metrics
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl border border-muc/10 bg-nga/80 p-3 text-center">
            <span className="text-[10px] font-bold text-muc/60 uppercase tracking-wider block">
              Sessions
            </span>
            <span data-testid="reading-log-count" className="text-xl sm:text-2xl font-serif font-black text-muc block mt-0.5">
              {summary.count}
            </span>
          </div>

          <div className="rounded-2xl border border-muc/10 bg-nga/80 p-3 text-center">
            <span className="text-[10px] font-bold text-sanho uppercase tracking-wider block">
              Favorites
            </span>
            <span data-testid="favorite-count" className="text-xl sm:text-2xl font-serif font-black text-sanho block mt-0.5">
              {summary.favoriteCount}
            </span>
          </div>

          <div className="rounded-2xl border border-muc/10 bg-nga/80 p-3 text-center">
            <span className="text-[10px] font-bold text-muc/60 uppercase tracking-wider block">
              Total Mins
            </span>
            <span data-testid="total-minutes" className="text-xl sm:text-2xl font-serif font-black text-muc block mt-0.5">
              {summary.totalMinutes}
            </span>
          </div>
        </div>

        {/* Genre Breakdown */}
        {summary.breakdown.length > 0 && (
          <div className="space-y-2 border-t border-muc/10 pt-3">
            <span className="text-[11px] font-bold text-muc uppercase tracking-[0.15em] block">
              Genre Breakdown
            </span>
            <div data-testid="genre-breakdown" className="space-y-2">
              {summary.breakdown.map((row) => {
                const chipStyle = GENRE_CHIP_STYLES[row.genre as Genre] || GENRE_CHIP_STYLES.Other;
                const percent = summary.totalMinutes > 0 ? (row.total / summary.totalMinutes) * 100 : 0;

                return (
                  <div
                    data-testid="breakdown-row"
                    key={row.genre}
                    className="rounded-[14px] border border-muc/8 bg-nga/90 p-2.5 transition-all hover:bg-nga"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${chipStyle.dot}`} />
                        <span data-testid="breakdown-name" className="text-muc">{row.genre}</span>
                        <span className="text-muc/45 font-normal ml-0.5">
                          (<span data-testid="breakdown-count">{row.count}</span>)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muc font-bold">
                        <span data-testid="breakdown-total">{row.total}</span>
                        <span className="text-[10px] text-muc/55 font-normal">mins</span>
                      </div>
                    </div>
                    {/* Decorative Progress Line */}
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muc/10">
                      <div
                        className="h-full rounded-full bg-muc transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ───────────────────────── Main Page ─────────────────────────
export default function ReadingLogsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { readingLogs, setReadingLogs } = useReadingLogs();

  const [genreFilter, setGenreFilter] = useState("");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [summary, setSummary] = useState<SummaryData>({
    count: 0,
    favoriteCount: 0,
    totalMinutes: 0,
    breakdown: [],
  });

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch logs & summary
  const fetchData = useCallback(async () => {
    if (!user) return;

    const params = new URLSearchParams();
    if (genreFilter) params.set("genre", genreFilter);
    if (favoriteOnly) params.set("favorite", "true");
    if (searchQuery.trim()) params.set("q", searchQuery.trim());

    const qs = params.toString() ? `?${params.toString()}` : "";

    try {
      const [logsRes, summaryRes] = await Promise.all([
        fetch(`/api/reading-logs${qs}`),
        fetch(`/api/reading-logs/summary${qs}`),
      ]);

      if (logsRes.ok) {
        const data = await logsRes.json();
        setReadingLogs(data);
      }
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary(data);
      }
    } catch (err) {
      console.error("Fetch reading logs error:", err);
    }
  }, [user, genreFilter, favoriteOnly, searchQuery, setReadingLogs]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClearFilters = () => {
    setGenreFilter("");
    setFavoriteOnly(false);
    setSearchQuery("");
  };

  // Auth gate without flash
  if (authLoading || !user) {
    return null;
  }

  return (
    <div
      data-testid="reading-logs-page"
      className="min-h-screen bg-kem text-muc flex flex-col font-sans selection:bg-sanho/20"
    >
      <Header />

      <div className="container mx-auto px-4 sm:px-8 py-8 flex-1 max-w-7xl flex gap-6 sm:gap-8">
        {/* Decorative Pure SVG Vertical Sidebar (Inspired by Image 1 & 2) */}
        <aside
          aria-hidden="true"
          className="hidden xl:flex flex-col items-center justify-between py-6 px-3 rounded-full bg-nga/80 border border-muc/10 shadow-subtle h-[540px] sticky top-24 shrink-0"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="h-9 w-9 rounded-full bg-sanho text-nga flex items-center justify-center shadow-xs">
              <Home className="h-4 w-4" />
            </div>
            <div className="h-8 w-8 rounded-full text-muc/40 flex items-center justify-center hover:text-muc transition-colors">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="h-8 w-8 rounded-full text-muc/40 flex items-center justify-center hover:text-muc transition-colors">
              <Compass className="h-4 w-4" />
            </div>
            <div className="h-8 w-8 rounded-full text-muc/40 flex items-center justify-center hover:text-muc transition-colors">
              <Bookmark className="h-4 w-4" />
            </div>
          </div>
          <div className="h-8 w-8 rounded-full text-muc/40 flex items-center justify-center">
            <Settings className="h-4 w-4" />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Header Title */}
          <div className="mb-7">
            <span className="text-[11px] font-bold tracking-[0.18em] text-sanho uppercase block mb-1">
              Personal Library
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-muc">
              Reading Sessions
            </h1>
            <p className="text-xs sm:text-sm text-muc/65 mt-1">
              Track reading habits, review session logs, and discover genre balances.
            </p>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: Form + Filters + Summary */}
            <div className="lg:col-span-5 space-y-6">
              <AddReadingLogForm />

              {/* Filters Bar */}
              <Card className="card-editorial p-5 relative">
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Genre Filter */}
                    <div>
                      <Label className="text-[11px] font-bold text-muc uppercase tracking-[0.15em] block mb-1">
                        Filter Genre
                      </Label>
                      <select
                        data-testid="filter-genre"
                        value={genreFilter}
                        onChange={(e) => setGenreFilter(e.target.value)}
                        className="flex h-10 w-full rounded-pill border border-muc/15 bg-nga px-3.5 py-2 text-sm transition-all focus:border-sanho focus:ring-1 focus:ring-sanho cursor-pointer"
                      >
                        <option value="">All Genres</option>
                        {GENRES.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Query */}
                    <div>
                      <Label className="text-[11px] font-bold text-muc uppercase tracking-[0.15em] block mb-1">
                        Search Book / Note
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muc/35" />
                        <Input
                          data-testid="search-input"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search..."
                          className="pl-9 rounded-pill border border-muc/15 bg-nga text-sm focus:border-sanho focus:ring-1 focus:ring-sanho"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Checkbox & Clear Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-muc/10">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-muc">
                      <input
                        type="checkbox"
                        data-testid="filter-favorite"
                        checked={favoriteOnly}
                        onChange={(e) => setFavoriteOnly(e.target.checked)}
                        className="h-4 w-4 rounded border-muc/25 text-sanho focus:ring-sanho cursor-pointer"
                      />
                      <span>Favorites only</span>
                    </label>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      data-testid="btn-clear-filters"
                      onClick={handleClearFilters}
                      className="gap-1 text-xs font-medium text-muc/65 hover:text-sanho hover:bg-sanho/10 rounded-pill cursor-pointer px-3 py-1.5 h-auto"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Clear Filters</span>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Summary */}
              <SummaryPanel summary={summary} />
            </div>

            {/* Right Column: Reading Log List */}
            <div className="lg:col-span-7 space-y-3.5">
              <div data-testid="reading-log-list" className="space-y-3.5">
                {readingLogs.length === 0 ? (
                  <div
                    data-testid="reading-logs-empty"
                    className="card-editorial p-12 text-center border-dashed border-muc/25"
                  >
                    <BookOpen className="mx-auto h-11 w-11 text-muc/25 mb-3" />
                    <p className="text-base font-serif font-bold text-muc">No reading sessions found</p>
                    <p className="text-xs text-muc/60 mt-1">
                      Try clearing filters or add a new reading session.
                    </p>
                  </div>
                ) : (
                  readingLogs.map((log) => (
                    <ReadingLogItem key={log.id} log={log} />
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

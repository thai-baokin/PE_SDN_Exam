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
  Sparkles,
  PieChart as PieIcon,
  Search,
  RotateCcw,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const GENRES = ["Fiction", "Non-Fiction", "Sci-Fi", "Biography", "Other"] as const;
type Genre = typeof GENRES[number];

const GENRE_STYLES: Record<Genre, { bg: string; text: string; dot: string; bar: string }> = {
  Fiction: {
    bg: "bg-amber-800/10 border-amber-800/20",
    text: "text-amber-900",
    dot: "bg-amber-700",
    bar: "from-amber-600 to-amber-700",
  },
  "Non-Fiction": {
    bg: "bg-emerald-800/10 border-emerald-800/20",
    text: "text-emerald-900",
    dot: "bg-emerald-700",
    bar: "from-emerald-600 to-emerald-700",
  },
  "Sci-Fi": {
    bg: "bg-indigo-800/10 border-indigo-800/20",
    text: "text-indigo-900",
    dot: "bg-indigo-700",
    bar: "from-indigo-600 to-indigo-700",
  },
  Biography: {
    bg: "bg-purple-800/10 border-purple-800/20",
    text: "text-purple-900",
    dot: "bg-purple-700",
    bar: "from-purple-600 to-purple-700",
  },
  Other: {
    bg: "bg-stone-800/10 border-stone-800/20",
    text: "text-stone-900",
    dot: "bg-stone-700",
    bar: "from-stone-600 to-stone-700",
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
    <Card className="relative rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_16px_40px_rgba(44,36,25,0.05)] backdrop-blur-xl">
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-800 text-amber-50 shadow-xs">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-serif font-bold text-amber-950">Add Reading Session</CardTitle>
            <p className="text-xs text-amber-900/70">Record your latest reading session</p>
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
            <Label htmlFor="bookTitle" className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Book Title <span className="text-rose-500">*</span>
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
              className={`mt-1 rounded-xl border bg-white/90 px-3.5 py-2 text-sm transition-all focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20 ${
                errors.bookTitle ? "border-rose-400 bg-rose-50/20" : "border-amber-900/15"
              }`}
            />
            {errors.bookTitle && (
              <p data-testid="error-book-title" className="text-xs font-medium text-rose-600 mt-1">
                {errors.bookTitle}
              </p>
            )}
          </div>

          {/* Minutes Read & Genre in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <Label htmlFor="minutesRead" className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Minutes Read <span className="text-rose-500">*</span>
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
                className={`mt-1 rounded-xl border bg-white/90 px-3.5 py-2 text-sm transition-all focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20 ${
                  errors.minutesRead ? "border-rose-400 bg-rose-50/20" : "border-amber-900/15"
                }`}
              />
              {errors.minutesRead && (
                <p data-testid="error-minutes" className="text-xs font-medium text-rose-600 mt-1">
                  {errors.minutesRead}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="genre" className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Genre <span className="text-rose-500">*</span>
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
                className={`mt-1 flex h-10 w-full rounded-xl border bg-white/90 px-3 py-2 text-sm transition-all focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20 cursor-pointer ${
                  errors.genre ? "border-rose-400 bg-rose-50/20" : "border-amber-900/15"
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
                <p data-testid="error-genre" className="text-xs font-medium text-rose-600 mt-1">
                  {errors.genre}
                </p>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date" className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Date <span className="text-rose-500">*</span>
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
              className={`mt-1 rounded-xl border bg-white/90 px-3.5 py-2 text-sm transition-all focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20 ${
                errors.date ? "border-rose-400 bg-rose-50/20" : "border-amber-900/15"
              }`}
            />
            {errors.date && (
              <p data-testid="error-date" className="text-xs font-medium text-rose-600 mt-1">
                {errors.date}
              </p>
            )}
          </div>

          {/* Note (Optional) */}
          <div>
            <Label htmlFor="note" className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Note <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </Label>
            <Input
              id="note"
              data-testid="input-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Chapter 3: Habit loop"
              className="mt-1 rounded-xl border border-amber-900/15 bg-white/90 px-3.5 py-2 text-sm transition-all focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20"
            />
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3">
              <p data-testid="error-reading-log" className="text-xs font-medium text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{apiError}</span>
              </p>
            </div>
          )}

          {/* Form Success Alert */}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
              <p
                data-testid="reading-log-success"
                className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Reading session added</span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            data-testid="btn-add-reading-log"
            disabled={isSubmitting}
            className="w-full bg-amber-900 hover:bg-amber-950 text-amber-50 font-semibold py-5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer mt-1"
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

  const genreStyle = GENRE_STYLES[log.genre as Genre] || GENRE_STYLES.Other;

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
      className="group relative flex items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/70 p-4 shadow-[0_4px_20px_rgba(44,36,25,0.03)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(44,36,25,0.06)] hover:bg-white/90"
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span
            data-testid="reading-log-title"
            className="text-base font-serif font-bold text-amber-950 truncate max-w-sm"
          >
            {log.bookTitle}
          </span>
          <span
            data-testid="reading-log-genre"
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${genreStyle.bg} ${genreStyle.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${genreStyle.dot}`} />
            {log.genre}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-amber-900/70">
          <div className="flex items-center gap-1 font-semibold text-amber-900">
            <Clock className="h-3.5 w-3.5 text-amber-700" />
            <span data-testid="reading-log-minutes" className="text-sm font-black">
              {log.minutesRead}
            </span>
            <span className="text-xs font-medium text-amber-900/60">mins</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-amber-900/40" />
            <span data-testid="reading-log-date">{log.readOn}</span>
          </div>

          {log.note && (
            <span className="truncate max-w-xs text-amber-900/50 italic">
              &ldquo;{log.note}&rdquo;
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 pl-2">
        <button
          data-testid="btn-toggle-favorite"
          aria-pressed={log.favorite ? "true" : "false"}
          onClick={handleToggleFavorite}
          title={log.favorite ? "Unfavorite session" : "Favorite session"}
          className={`rounded-xl p-2 transition-all cursor-pointer ${
            log.favorite
              ? "bg-amber-100 text-amber-700 shadow-xs hover:bg-amber-200 hover:scale-110"
              : "text-amber-900/30 hover:text-amber-700 hover:bg-amber-50 hover:scale-110"
          }`}
        >
          <Bookmark className="h-5 w-5" fill={log.favorite ? "currentColor" : "none"} />
        </button>
        <button
          data-testid="btn-delete-reading-log"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete reading session"
          className="rounded-xl p-2 text-amber-900/40 transition-all hover:text-rose-600 hover:bg-rose-50 hover:scale-110 cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="h-5 w-5" />
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
    <Card className="relative rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_16px_40px_rgba(44,36,25,0.05)] backdrop-blur-xl overflow-hidden">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-800 text-amber-50 shadow-xs">
              <PieIcon className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-serif font-bold text-amber-950">Summary</CardTitle>
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-amber-900/60 uppercase">Live Metrics</span>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-900/10 bg-amber-50/50 p-3.5">
            <span className="text-xs font-semibold text-amber-900/70 block">Total Sessions</span>
            <span data-testid="reading-log-count" className="text-2xl font-black text-amber-950 block mt-0.5">
              {summary.count}
            </span>
          </div>

          <div className="rounded-2xl border border-amber-900/10 bg-amber-50/50 p-3.5">
            <span className="text-xs font-semibold text-amber-900/70 block">Favorites</span>
            <span data-testid="favorite-count" className="text-2xl font-black text-amber-700 block mt-0.5">
              {summary.favoriteCount}
            </span>
          </div>
        </div>

        {/* Total Minutes Highlight */}
        <div className="rounded-2xl border border-white/80 bg-gradient-to-tr from-amber-900 via-amber-800 to-amber-700 p-4 text-amber-50 shadow-[0_10px_25px_rgba(120,53,15,0.2)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-200 uppercase tracking-wide">Total Minutes</span>
            <Sparkles className="h-4 w-4 text-amber-200" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span data-testid="total-minutes" className="text-3xl font-serif font-black tracking-tight">
              {summary.totalMinutes}
            </span>
            <span className="text-sm font-semibold text-amber-200">minutes read</span>
          </div>
        </div>

        {/* Genre Breakdown */}
        {summary.breakdown.length > 0 && (
          <div className="space-y-2 border-t border-amber-900/10 pt-3">
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
              Genre Breakdown
            </span>
            <div data-testid="genre-breakdown" className="space-y-2">
              {summary.breakdown.map((row) => {
                const genreStyle = GENRE_STYLES[row.genre as Genre] || GENRE_STYLES.Other;
                const percent = summary.totalMinutes > 0 ? (row.total / summary.totalMinutes) * 100 : 0;
                
                return (
                  <div
                    data-testid="breakdown-row"
                    key={row.genre}
                    className="rounded-xl border border-amber-900/10 bg-white/60 p-2.5 transition-all hover:bg-white"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${genreStyle.dot}`} />
                        <span data-testid="breakdown-name" className="text-amber-950">{row.genre}</span>
                        <span className="text-amber-900/50 font-normal ml-0.5">
                          (<span data-testid="breakdown-count">{row.count}</span>)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-950 font-bold">
                        <span data-testid="breakdown-total">{row.total}</span>
                        <span className="text-[10px] text-amber-900/60 font-normal">mins</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-amber-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${genreStyle.bar} transition-all duration-500`}
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

  // Auth gate
  if (authLoading || !user) {
    return null;
  }

  return (
    <div
      data-testid="reading-logs-page"
      className="min-h-screen bg-[#FAF7F2] text-amber-950 relative overflow-hidden flex flex-col font-sans"
    >
      <Header />

      {/* Warm Ambient Floating Spheres */}
      <div className="pointer-events-none absolute -top-32 left-1/3 h-[32rem] w-[32rem] rounded-full bg-amber-200/35 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-32 h-[30rem] w-[30rem] rounded-full bg-emerald-100/35 blur-3xl" />

      <main className="container mx-auto px-4 py-8 relative z-10 flex-1 max-w-7xl">
        {/* Page Title */}
        <div className="mb-8">
          <span className="text-[11px] font-bold tracking-[0.2em] text-amber-900/70 uppercase block mb-1">
            Personal Library
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-amber-950">
            Reading Sessions
          </h1>
          <p className="text-sm text-amber-900/70 mt-1">
            Track reading habits, monitor progress, and review genre distributions.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Summary */}
          <div className="lg:col-span-5 space-y-6">
            <AddReadingLogForm />
            <SummaryPanel summary={summary} />
          </div>

          {/* Right Column: Filters & List */}
          <div className="lg:col-span-7 space-y-6">
            {/* Filters Bar */}
            <Card className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_12px_36px_rgba(44,36,25,0.04)] backdrop-blur-xl">
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Genre Filter */}
                  <div>
                    <Label className="text-[11px] font-bold text-amber-950 uppercase tracking-wider block mb-1">
                      Filter Genre
                    </Label>
                    <select
                      data-testid="filter-genre"
                      value={genreFilter}
                      onChange={(e) => setGenreFilter(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-amber-900/15 bg-white/90 px-3 py-2 text-sm transition-all focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20 cursor-pointer"
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
                    <Label className="text-[11px] font-bold text-amber-950 uppercase tracking-wider block mb-1">
                      Search Book / Note
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-amber-900/40" />
                      <Input
                        data-testid="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search title or note..."
                        className="pl-9 rounded-xl border border-amber-900/15 bg-white/90 text-sm focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Filter Checkbox & Clear Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-amber-900/10">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-amber-950">
                    <input
                      type="checkbox"
                      data-testid="filter-favorite"
                      checked={favoriteOnly}
                      onChange={(e) => setFavoriteOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-amber-900/20 text-amber-800 focus:ring-amber-800/20 cursor-pointer"
                    />
                    <span>Favorites only</span>
                  </label>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    data-testid="btn-clear-filters"
                    onClick={handleClearFilters}
                    className="gap-1.5 text-xs font-medium text-amber-900/70 hover:text-amber-950 hover:bg-amber-100/50 rounded-lg cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Clear Filters</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Reading Log List */}
            <div data-testid="reading-log-list" className="space-y-3.5">
              {readingLogs.length === 0 ? (
                <div
                  data-testid="reading-logs-empty"
                  className="rounded-3xl border border-dashed border-amber-900/20 bg-white/50 p-12 text-center backdrop-blur-md"
                >
                  <BookOpen className="mx-auto h-12 w-12 text-amber-900/30 mb-3" />
                  <p className="text-base font-serif font-bold text-amber-950">No reading sessions found</p>
                  <p className="text-xs text-amber-900/60 mt-1">
                    Try clearing filters or add a new reading session above.
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
  );
}

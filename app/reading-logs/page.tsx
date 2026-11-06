"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useReadingLogs, ReadingLog } from "@/context/ReadingLogContext";
import {
  BookOpen,
  Plus,
  Trash2,
  Star,
  Search,
  RotateCcw,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PieChart as PieIcon,
  Sparkles,
} from "lucide-react";

const GENRES = ["Fiction", "Non-Fiction", "Sci-Fi", "Biography", "Other"] as const;
type Genre = typeof GENRES[number];

const GENRE_GRADIENTS: Record<Genre, string> = {
  Fiction: "genre-fiction",
  "Non-Fiction": "genre-non-fiction",
  "Sci-Fi": "genre-sci-fi",
  Biography: "genre-biography",
  Other: "genre-other",
};

// ───────────────────────── Add Reading Log Form (Left Banner) ─────────────────────────
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
    <div className="rounded-[28px] genre-fiction p-6 sm:p-7 text-white relative overflow-hidden shadow-flix flex flex-col justify-between">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />

      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xs">
            <Plus className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">Add Reading Session</h2>
        </div>

        <form
          data-testid="reading-log-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-3.5"
        >
          {/* Book Title */}
          <div>
            <Label htmlFor="bookTitle" className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
              Book Title <span className="text-flix-star">*</span>
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
              className={`mt-1 rounded-[14px] border bg-white/20 text-white placeholder:text-white/50 px-3.5 py-2 text-sm transition-all focus:border-white focus:ring-1 focus:ring-white backdrop-blur-md ${
                errors.bookTitle ? "border-red-300 bg-red-500/20" : "border-white/35"
              }`}
            />
            {errors.bookTitle && (
              <p data-testid="error-book-title" className="text-xs font-bold text-red-200 mt-1">
                {errors.bookTitle}
              </p>
            )}
          </div>

          {/* Minutes Read & Genre in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="minutesRead" className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
                Minutes Read <span className="text-flix-star">*</span>
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
                className={`mt-1 rounded-[14px] border bg-white/20 text-white placeholder:text-white/50 px-3.5 py-2 text-sm transition-all focus:border-white focus:ring-1 focus:ring-white backdrop-blur-md ${
                  errors.minutesRead ? "border-red-300 bg-red-500/20" : "border-white/35"
                }`}
              />
              {errors.minutesRead && (
                <p data-testid="error-minutes" className="text-xs font-bold text-red-200 mt-1">
                  {errors.minutesRead}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="genre" className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
                Genre <span className="text-flix-star">*</span>
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
                className={`mt-1 flex h-10 w-full rounded-[14px] border bg-white/20 text-white px-3 py-2 text-sm transition-all focus:border-white focus:ring-1 focus:ring-white backdrop-blur-md cursor-pointer ${
                  errors.genre ? "border-red-300 bg-red-500/20" : "border-white/35"
                }`}
              >
                <option value="" className="text-flix-dark">Choose genre</option>
                {GENRES.map((g) => (
                  <option key={g} value={g} className="text-flix-dark">
                    {g}
                  </option>
                ))}
              </select>
              {errors.genre && (
                <p data-testid="error-genre" className="text-xs font-bold text-red-200 mt-1">
                  {errors.genre}
                </p>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date" className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
              Date <span className="text-flix-star">*</span>
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
              className={`mt-1 rounded-[14px] border bg-white/20 text-white px-3.5 py-2 text-sm transition-all focus:border-white focus:ring-1 focus:ring-white backdrop-blur-md ${
                errors.date ? "border-red-300 bg-red-500/20" : "border-white/35"
              }`}
            />
            {errors.date && (
              <p data-testid="error-date" className="text-xs font-bold text-red-200 mt-1">
                {errors.date}
              </p>
            )}
          </div>

          {/* Note */}
          <div>
            <Label htmlFor="note" className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
              Note <span className="text-white/50 font-normal lowercase">(optional)</span>
            </Label>
            <Input
              id="note"
              data-testid="input-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Chapter 3 reflections"
              className="mt-1 rounded-[14px] border border-white/35 bg-white/20 text-white placeholder:text-white/50 px-3.5 py-2 text-sm transition-all focus:border-white focus:ring-1 focus:ring-white backdrop-blur-md"
            />
          </div>

          {/* Error Message */}
          {apiError && (
            <div className="rounded-[14px] border border-red-300/40 bg-red-600/30 p-2.5 backdrop-blur-md">
              <p data-testid="error-reading-log" className="text-xs font-bold text-red-100 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-200" />
                <span>{apiError}</span>
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-[14px] border border-emerald-300/40 bg-emerald-600/30 p-2.5 backdrop-blur-md">
              <p
                data-testid="reading-log-success"
                className="text-xs font-bold text-emerald-100 flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                <span>Reading session added</span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            data-testid="btn-add-reading-log"
            disabled={isSubmitting}
            className="w-full btn-flix-white py-5 text-sm font-bold cursor-pointer mt-1"
          >
            {isSubmitting ? "Adding Session..." : "Add Reading Session"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ───────────────────────── Summary Panel (Right Banner) ─────────────────────────
interface SummaryData {
  count: number;
  favoriteCount: number;
  totalMinutes: number;
  breakdown: { genre: string; count: number; total: number }[];
}

function SummaryBanner({ summary }: { summary: SummaryData }) {
  return (
    <div className="rounded-[28px] bg-gradient-to-tr from-[#0F1B2D] via-[#1E3F8F] to-[#3A2A8C] p-6 sm:p-7 text-white relative overflow-hidden shadow-flix flex flex-col justify-between">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -left-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xs">
              <PieIcon className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">Summary</h2>
          </div>
          <div className="flex items-center gap-1 rounded-pill bg-white/15 px-3 py-1 text-[10px] font-bold tracking-wider uppercase border border-white/20">
            <Sparkles className="h-3 w-3 text-flix-star" />
            <span>Live Metrics</span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="rounded-[16px] bg-white/15 border border-white/25 p-3 text-center backdrop-blur-md">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">
              Sessions
            </span>
            <span data-testid="reading-log-count" className="text-2xl font-black text-white block mt-0.5">
              {summary.count}
            </span>
          </div>

          <div className="rounded-[16px] bg-white/15 border border-white/25 p-3 text-center backdrop-blur-md">
            <span className="text-[10px] font-bold text-flix-star uppercase tracking-wider block">
              Favorites
            </span>
            <span data-testid="favorite-count" className="text-2xl font-black text-flix-star block mt-0.5">
              {summary.favoriteCount}
            </span>
          </div>

          <div className="rounded-[16px] bg-white/15 border border-white/25 p-3 text-center backdrop-blur-md">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">
              Total Mins
            </span>
            <span data-testid="total-minutes" className="text-2xl font-black text-white block mt-0.5">
              {summary.totalMinutes}
            </span>
          </div>
        </div>

        {/* Genre Breakdown */}
        {summary.breakdown.length > 0 && (
          <div className="space-y-2 border-t border-white/15 pt-3.5">
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider block">
              Genre Breakdown
            </span>
            <div data-testid="genre-breakdown" className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {summary.breakdown.map((row) => {
                const percent = summary.totalMinutes > 0 ? (row.total / summary.totalMinutes) * 100 : 0;

                return (
                  <div
                    data-testid="breakdown-row"
                    key={row.genre}
                    className="rounded-[14px] bg-white/15 border border-white/20 p-2.5 backdrop-blur-md transition-all hover:bg-white/20"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span data-testid="breakdown-name" className="text-white font-bold">{row.genre}</span>
                        <span className="text-white/60 font-normal">
                          (<span data-testid="breakdown-count">{row.count}</span>)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-white font-bold">
                        <span data-testid="breakdown-total">{row.total}</span>
                        <span className="text-[10px] text-white/70 font-normal">mins</span>
                      </div>
                    </div>
                    {/* Decorative Progress Bar */}
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/25">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────── Reading Log Item (Poster Card) ─────────────────────────
function ReadingLogPosterItem({ log }: { log: ReadingLog }) {
  const { updateReadingLog, deleteReadingLog } = useReadingLogs();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const gradientClass = GENRE_GRADIENTS[log.genre as Genre] || "genre-other";
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
      className={`poster-ratio rounded-[20px] ${gradientClass} text-white relative overflow-hidden shadow-poster border border-white/40 flex flex-col justify-between p-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-flix group`}
    >
      {/* Decorative Large Background Initial & Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-2 text-7xl font-black text-white/10 select-none"
      >
        {initial}
      </div>
      <BookOpen
        aria-hidden="true"
        className="pointer-events-none absolute -left-4 -bottom-4 w-28 h-28 text-white/10"
      />

      {/* Top Bar: Action Buttons */}
      <div className="flex items-center justify-between relative z-10">
        <span
          data-testid="reading-log-genre"
          className="rounded-pill bg-black/35 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider border border-white/20"
        >
          {log.genre}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            data-testid="btn-toggle-favorite"
            aria-pressed={log.favorite ? "true" : "false"}
            onClick={handleToggleFavorite}
            title={log.favorite ? "Unfavorite session" : "Favorite session"}
            className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border border-white/30 ${
              log.favorite
                ? "bg-flix-star text-flix-dark shadow-xs"
                : "bg-black/35 text-white/80 hover:text-white hover:bg-black/50"
            }`}
          >
            <Star className="h-3.5 w-3.5" fill={log.favorite ? "currentColor" : "none"} />
          </button>

          <button
            data-testid="btn-delete-reading-log"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete session"
            className="w-7 h-7 rounded-full flex items-center justify-center bg-black/35 text-white/80 hover:text-red-300 hover:bg-red-600/40 backdrop-blur-md transition-all cursor-pointer border border-white/30 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Frosted Glass Overlay Card */}
      <div className="rounded-[14px] bg-white/25 backdrop-blur-md border border-white/35 p-2.5 text-white relative z-10 shadow-xs">
        <h3
          data-testid="reading-log-title"
          className="font-bold text-sm leading-tight truncate mb-1 text-white drop-shadow-xs"
          title={log.bookTitle}
        >
          {log.bookTitle}
        </h3>

        <div className="flex items-center justify-between text-[11px] text-white/90 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-flix-star" />
            <span data-testid="reading-log-minutes" className="font-bold">
              {log.minutesRead}
            </span>
            <span className="text-[10px] text-white/75 font-normal">min</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-white/80">
            <Calendar className="h-2.5 w-2.5 opacity-70" />
            <span data-testid="reading-log-date">{log.readOn}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Main Dashboard Page ─────────────────────────
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

  // Protect route without flash
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
      className="py-6 sm:py-10 px-3 sm:px-6 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center"
    >
      {/* Large Flix.id Frosted Glass Frame */}
      <div className="flix-frame overflow-hidden flex flex-col p-4 sm:p-7 md:p-8">
        <Header />

        <main className="mt-6 sm:mt-8 space-y-7">
          {/* Row 1: Two colored banners side-by-side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AddReadingLogForm />
            <SummaryBanner summary={summary} />
          </div>

          {/* Row 2: Filter chip bar */}
          <div className="flix-card rounded-[22px] p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
              {/* Genre Filter */}
              <select
                data-testid="filter-genre"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="flix-glass-pill h-10 rounded-pill px-4 py-2 text-xs font-bold text-flix-dark cursor-pointer border-white/60 focus:outline-hidden"
              >
                <option value="">All Genres</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              {/* Favorites Checkbox Chip */}
              <label className="flix-glass-pill h-10 px-4 rounded-pill flex items-center gap-2 text-xs font-bold text-flix-dark cursor-pointer select-none border-white/60">
                <input
                  type="checkbox"
                  data-testid="filter-favorite"
                  checked={favoriteOnly}
                  onChange={(e) => setFavoriteOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-flix-dark/30 text-flix-dark focus:ring-flix-dark cursor-pointer"
                />
                <span>Favorites only</span>
              </label>

              {/* Search Pill Input */}
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-flix-dark/50" />
                <Input
                  data-testid="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search book or note..."
                  className="pl-9 h-10 rounded-pill border-white/60 bg-white/50 text-xs font-semibold text-flix-dark placeholder:text-flix-dark/45 focus:border-flix-dark focus:ring-1 focus:ring-flix-dark"
                />
              </div>
            </div>

            {/* Clear Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-testid="btn-clear-filters"
              onClick={handleClearFilters}
              className="btn-flix-dark text-xs px-4 py-2 h-10 gap-1.5 cursor-pointer shadow-subtle shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Filters</span>
            </Button>
          </div>

          {/* Row 3: Reading Sessions Header & Poster Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl sm:text-2xl font-black text-flix-dark tracking-tight">
                Your reading sessions
              </h2>
            </div>

            {/* Reading Log Poster Grid */}
            <div data-testid="reading-log-list">
              {readingLogs.length === 0 ? (
                <div
                  data-testid="reading-logs-empty"
                  className="flix-card rounded-[24px] p-12 text-center border-dashed border-white/80"
                >
                  <BookOpen className="mx-auto h-12 w-12 text-flix-dark/30 mb-3" />
                  <p className="text-lg font-bold text-flix-dark">No reading sessions found</p>
                  <p className="text-xs text-flix-dark/60 mt-1">
                    Try clearing filters or add a new reading session above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
                  {readingLogs.map((log) => (
                    <ReadingLogPosterItem key={log.id} log={log} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

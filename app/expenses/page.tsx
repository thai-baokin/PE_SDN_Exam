"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useExpenses, Expense } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Star, 
  Trash2, 
  X, 
  PlusCircle, 
  Search, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Receipt,
  PieChart as PieIcon,
  Sparkles
} from "lucide-react";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Other"] as const;
type Category = typeof CATEGORIES[number];

function formatAmount(n: number) {
  return n.toFixed(2);
}

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; dot: string; bar: string }> = {
  Food: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-700", dot: "bg-amber-500", bar: "from-amber-400 to-amber-500" },
  Transport: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-700", dot: "bg-blue-500", bar: "from-blue-400 to-blue-500" },
  Bills: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-700", dot: "bg-purple-500", bar: "from-purple-400 to-purple-500" },
  Shopping: { bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-700", dot: "bg-rose-500", bar: "from-rose-400 to-rose-500" },
  Other: { bg: "bg-slate-500/10 border-slate-500/20", text: "text-slate-700", dot: "bg-slate-500", bar: "from-slate-400 to-slate-500" },
};

// ───────────────────────── Add Expense Form ─────────────────────────
function AddExpenseForm() {
  const { addExpense } = useExpenses();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function validateTitle(v: string) {
    if (!v || !v.trim()) return "Title is required";
    if (v.trim().length > 80) return "Title must be at most 80 characters";
    return "";
  }
  function validateAmount(v: string) {
    if (v === "" || v === undefined) return "Amount is required";
    const n = parseFloat(v);
    if (isNaN(n)) return "Amount is required";
    if (n <= 0) return "Amount must be a positive number";
    return "";
  }
  function validateCategory(v: string) {
    if (!v) return "Please choose a category";
    if (!CATEGORIES.includes(v as Category)) return "Invalid category";
    return "";
  }
  function validateDate(v: string) {
    if (!v) return "Date is required";
    if (v > today) return "Date cannot be in the future";
    return "";
  }

  const validate = () => {
    const e = {
      title: validateTitle(title),
      amount: validateAmount(amount),
      category: validateCategory(category),
      date: validateDate(date),
    };
    setErrors(e);
    return !e.title && !e.amount && !e.category && !e.date;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError("");
    setSuccess(false);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          amount: parseFloat(amount),
          category,
          note,
          spentAt: date,
        }),
      });

      if (res.ok) {
        const expense = await res.json();
        addExpense(expense);
        setTitle("");
        setAmount("");
        setCategory("");
        setNote("");
        setDate("");
        setSubmitted(false);
        setErrors({ title: "", amount: "", category: "", date: "" });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        const data = await res.json();
        setApiError(data.error || "Failed to add expense");
      }
    } catch {
      setApiError("Failed to connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-panel relative rounded-2xl border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <PlusCircle className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Add Expense</CardTitle>
            <CardDescription className="text-xs text-gray-500">Record a new spending entry</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <form
          data-testid="expense-form"
          noValidate
          onSubmit={handleSubmit}
          className="space-y-3.5"
        >
          <div className="space-y-1">
            <Label htmlFor="title" className="text-xs font-semibold text-gray-700">Title</Label>
            <Input
              id="title"
              data-testid="input-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (submitted)
                  setErrors((p) => ({ ...p, title: validateTitle(e.target.value) }));
              }}
              placeholder="e.g. Grab to campus, Lunch"
              className="h-10 rounded-xl border-gray-200 bg-white/90 shadow-inner text-sm focus-visible:ring-4 focus-visible:ring-blue-500/15"
            />
            {errors.title && (
              <p data-testid="error-title" className="text-xs font-medium text-red-500 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="amount" className="text-xs font-semibold text-gray-700">Amount</Label>
              <Input
                id="amount"
                data-testid="input-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (submitted)
                    setErrors((p) => ({ ...p, amount: validateAmount(e.target.value) }));
                }}
                placeholder="0.00"
                className="h-10 rounded-xl border-gray-200 bg-white/90 shadow-inner text-sm focus-visible:ring-4 focus-visible:ring-blue-500/15"
              />
              {errors.amount && (
                <p data-testid="error-amount" className="text-xs font-medium text-red-500 mt-1">
                  {errors.amount}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="category" className="text-xs font-semibold text-gray-700">Category</Label>
              <select
                id="category"
                data-testid="input-category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (submitted)
                    setErrors((p) => ({
                      ...p,
                      category: validateCategory(e.target.value),
                    }));
                }}
                className="flex h-10 w-full rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-sm shadow-inner focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Choose category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p data-testid="error-category" className="text-xs font-medium text-red-500 mt-1">
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="date" className="text-xs font-semibold text-gray-700">Date</Label>
            <Input
              id="date"
              data-testid="input-date"
              type="date"
              max={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (submitted)
                  setErrors((p) => ({ ...p, date: validateDate(e.target.value) }));
              }}
              className="h-10 rounded-xl border-gray-200 bg-white/90 shadow-inner text-sm focus-visible:ring-4 focus-visible:ring-blue-500/15"
            />
            {errors.date && (
              <p data-testid="error-date" className="text-xs font-medium text-red-500 mt-1">
                {errors.date}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="note" className="text-xs font-semibold text-gray-700">Note (optional)</Label>
            <Input
              id="note"
              data-testid="input-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Morning class, with team..."
              className="h-10 rounded-xl border-gray-200 bg-white/90 shadow-inner text-sm focus-visible:ring-4 focus-visible:ring-blue-500/15"
            />
          </div>

          {apiError && (
            <div className="rounded-xl border border-red-200 bg-red-50/90 p-2.5">
              <p data-testid="error-expense" className="text-xs font-medium text-red-600 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{apiError}</span>
              </p>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-2.5">
              <p
                data-testid="expense-success"
                className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Expense added</span>
              </p>
            </div>
          )}

          <Button
            data-testid="btn-add-expense"
            type="submit"
            disabled={isSubmitting}
            className="button-3d-primary w-full h-10 font-bold text-white rounded-xl shadow-md cursor-pointer mt-1"
          >
            {isSubmitting ? "Adding..." : "Add Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ───────────────────────── Expense Item ─────────────────────────
function ExpenseItem({ expense }: { expense: Expense }) {
  const { updateExpense, deleteExpense } = useExpenses();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleStar = async () => {
    const res = await fetch(`/api/expenses/${expense.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starred: !expense.starred }),
    });
    if (res.ok) {
      const updated = await res.json();
      updateExpense(updated);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await fetch(`/api/expenses/${expense.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      deleteExpense(expense.id);
    } else {
      setIsDeleting(false);
    }
  };

  const catStyle = CATEGORY_COLORS[expense.category as Category] || CATEGORY_COLORS.Other;

  return (
    <div
      data-testid="expense-item"
      className="card-3d group relative flex items-center justify-between rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all hover:border-blue-200"
    >
      <div className="flex-1 min-w-0 pr-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            data-testid="expense-title"
            className="font-bold text-gray-900 text-base tracking-tight truncate max-w-[240px] sm:max-w-md"
          >
            {expense.title}
          </span>
          <span
            data-testid="expense-category"
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${catStyle.bg} ${catStyle.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${catStyle.dot}`} />
            {expense.category}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-3.5 text-xs text-gray-500 flex-wrap">
          <div className="flex items-center gap-1 font-extrabold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100">
            <span>₫</span>
            <span data-testid="expense-amount" className="text-sm font-black">
              {formatAmount(expense.amount)}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span data-testid="expense-date">{expense.spentAt}</span>
          </div>

          {expense.note && (
            <span className="truncate max-w-xs text-gray-400 italic">
              &ldquo;{expense.note}&rdquo;
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 pl-2">
        <button
          data-testid="btn-toggle-star"
          aria-pressed={expense.starred}
          onClick={handleToggleStar}
          title={expense.starred ? "Unstar expense" : "Star expense"}
          className={`rounded-xl p-2 transition-all cursor-pointer ${
            expense.starred
              ? "bg-amber-100 text-amber-500 shadow-xs hover:bg-amber-200 hover:scale-110"
              : "text-gray-300 hover:text-amber-400 hover:bg-amber-50/50 hover:scale-110"
          }`}
        >
          <Star className="h-5 w-5" fill={expense.starred ? "currentColor" : "none"} />
        </button>
        <button
          data-testid="btn-delete-expense"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete expense"
          className="rounded-xl p-2 text-gray-400 transition-all hover:text-rose-600 hover:bg-rose-50 hover:scale-110 cursor-pointer disabled:opacity-50"
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
  starredCount: number;
  totalAmount: number;
  breakdown: { category: string; count: number; total: number }[];
}

function SummaryPanel({ summary }: { summary: SummaryData }) {
  return (
    <Card className="glass-panel relative rounded-2xl border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />
      
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <PieIcon className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-gray-900">Summary</CardTitle>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Metrics</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3.5 pt-1">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-2.5 text-center shadow-xs">
            <span className="text-[11px] font-medium text-blue-900 block">Total Expenses</span>
            <span data-testid="expense-count" className="text-xl font-black text-blue-700 block mt-0.5">
              {summary.count}
            </span>
          </div>

          <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/70 to-yellow-50/40 p-2.5 text-center shadow-xs">
            <span className="text-[11px] font-medium text-amber-900 block">Starred Items</span>
            <span data-testid="starred-count" className="text-xl font-black text-amber-600 block mt-0.5">
              {summary.starredCount}
            </span>
          </div>
        </div>

        {/* Total Spending Highlight Card */}
        <div className="rounded-xl border border-white/80 bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 p-4 text-white shadow-md shadow-blue-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-100 uppercase tracking-wide">Total Amount</span>
            <Sparkles className="h-4 w-4 text-blue-200" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm font-semibold text-blue-200">₫</span>
            <span data-testid="total-amount" className="text-2xl font-black tracking-tight">
              {formatAmount(summary.totalAmount)}
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        {summary.breakdown.length > 0 && (
          <div className="space-y-2 border-t border-gray-100 pt-3">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Category Breakdown
            </span>
            <div data-testid="category-breakdown" className="space-y-2">
              {summary.breakdown.map((row) => {
                const catStyle = CATEGORY_COLORS[row.category as Category] || CATEGORY_COLORS.Other;
                const percent = summary.totalAmount > 0 ? (row.total / summary.totalAmount) * 100 : 0;
                
                return (
                  <div
                    data-testid="breakdown-row"
                    key={row.category}
                    className="rounded-xl border border-gray-100 bg-white/70 p-2.5 shadow-xs transition-all hover:bg-white"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                        <span className={`h-2 w-2 rounded-full ${catStyle.dot}`} />
                        <span data-testid="breakdown-name">{row.category}</span>
                        <span data-testid="breakdown-count" className="text-gray-400 font-normal ml-0.5">
                          ×{row.count}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-gray-900">
                        <span>₫</span>
                        <span data-testid="breakdown-total">{formatAmount(row.total)}</span>
                      </div>
                    </div>
                    {/* Visual 3D Progress Bar */}
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${catStyle.bar} transition-all duration-500`}
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

// ───────────────────────── Expenses Page ─────────────────────────
export default function ExpensesPage() {
  const { user, loading: authLoading } = useAuth();
  const { expenses, setExpenses } = useExpenses();
  const router = useRouter();

  const [filterCategory, setFilterCategory] = useState("");
  const [filterStarred, setFilterStarred] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [summary, setSummary] = useState<SummaryData>({
    count: 0,
    starredCount: 0,
    totalAmount: 0,
    breakdown: [],
  });
  const [dataLoaded, setDataLoaded] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  // Load expenses once on mount
  useEffect(() => {
    if (!user) return;
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
        setDataLoaded(true);
      });
  }, [user, setExpenses]);

  // Build query params
  const buildParams = useCallback(() => {
    const p = new URLSearchParams();
    if (filterCategory) p.set("category", filterCategory);
    if (filterStarred) p.set("starred", "true");
    if (searchQ.trim()) p.set("q", searchQ.trim());
    return p.toString();
  }, [filterCategory, filterStarred, searchQ]);

  // Fetch filtered list + summary whenever filters change
  useEffect(() => {
    if (!user || !dataLoaded) return;
    const qs = buildParams();
    const url = qs ? `/api/expenses?${qs}` : "/api/expenses";
    const sumUrl = qs ? `/api/expenses/summary?${qs}` : "/api/expenses/summary";

    Promise.all([fetch(url).then((r) => r.json()), fetch(sumUrl).then((r) => r.json())]).then(
      ([list, sum]) => {
        setExpenses(list);
        setSummary(sum);
      }
    );
  }, [filterCategory, filterStarred, searchQ, user, dataLoaded, buildParams, setExpenses]);

  const handleClear = () => {
    setFilterCategory("");
    setFilterStarred(false);
    setSearchQ("");
  };

  if (authLoading || !user) return null;

  return (
    <div data-testid="expenses-page" className="min-h-screen bg-mesh-gradient relative overflow-hidden flex flex-col">
      <Header />

      {/* 3D Decorative Ambient Background Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl animate-float-slow" style={{ animationDelay: "-3s" }} />

      <main className="container mx-auto px-4 py-8 relative z-10 flex-1">
        {/* Page Top Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">My Expenses</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage, filter and analyze your spending trail</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Synced
            </span>
          </div>
        </div>

        {/* 3D Glassmorphic Filters Bar */}
        <Card className="glass-panel mb-8 rounded-2xl border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Label htmlFor="filter-category" className="text-xs font-bold uppercase tracking-wider text-gray-600 whitespace-nowrap">
                  Category
                </Label>
                <select
                  id="filter-category"
                  data-testid="filter-category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-10 rounded-xl border border-gray-200 bg-white/90 px-3 text-sm shadow-inner focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15"
                >
                  <option value="">All</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Starred Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-gray-200 bg-white/80 px-3 py-2 shadow-xs transition-colors hover:bg-amber-50/40">
                <input
                  type="checkbox"
                  data-testid="filter-starred"
                  checked={filterStarred}
                  onChange={(e) => setFilterStarred(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 accent-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-500" fill={filterStarred ? "currentColor" : "none"} />
                  <span>Starred only</span>
                </span>
              </label>

              {/* Search Box */}
              <div className="flex flex-1 min-w-[220px] items-center gap-2 relative">
                <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  data-testid="search-input"
                  placeholder="Search title or note..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="h-10 pl-9 rounded-xl border-gray-200 bg-white/90 shadow-inner text-sm focus-visible:ring-4 focus-visible:ring-blue-500/15"
                />
              </div>

              {/* Clear Button */}
              <Button
                data-testid="btn-clear-filters"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-10 px-3 font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                <X className="mr-1.5 h-4 w-4" />
                <span>Clear</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Grid: Form + Summary on left, List on right at 1280px */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Add Form & Summary Panel */}
          <div className="space-y-6 lg:col-span-1">
            <AddExpenseForm />
            <SummaryPanel summary={summary} />
          </div>

          {/* Right Column: Expense List */}
          <div className="lg:col-span-2">
            <div data-testid="expense-list" className="space-y-3.5">
              {expenses.length === 0 ? (
                <div
                  data-testid="expenses-empty"
                  className="glass-panel flex flex-col items-center justify-center rounded-2xl border-dashed border-2 border-gray-200 p-14 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-3 shadow-inner">
                    <Receipt className="h-7 w-7" />
                  </div>
                  <span className="text-base font-bold text-gray-600">No expenses found</span>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    Try adjusting your filters or record your first expense entry using the form.
                  </p>
                </div>
              ) : (
                expenses.map((e) => <ExpenseItem key={e.id} expense={e} />)
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

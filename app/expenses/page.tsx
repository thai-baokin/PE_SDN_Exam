"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useExpenses, Expense } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Trash2, X } from "lucide-react";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Other"] as const;
type Category = typeof CATEGORIES[number];

function formatAmount(n: number) {
  return n.toFixed(2);
}

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
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const data = await res.json();
      setApiError(data.error || "Failed to add expense");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          data-testid="expense-form"
          noValidate
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              data-testid="input-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (submitted)
                  setErrors((p) => ({ ...p, title: validateTitle(e.target.value) }));
              }}
              placeholder="e.g. Coffee"
            />
            {errors.title && (
              <p data-testid="error-title" className="text-sm text-red-500">
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="amount">Amount</Label>
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
            />
            {errors.amount && (
              <p data-testid="error-amount" className="text-sm text-red-500">
                {errors.amount}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Choose category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p data-testid="error-category" className="text-sm text-red-500">
                {errors.category}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              data-testid="input-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any extra detail..."
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="date">Date</Label>
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
            />
            {errors.date && (
              <p data-testid="error-date" className="text-sm text-red-500">
                {errors.date}
              </p>
            )}
          </div>

          {apiError && (
            <p data-testid="error-expense" className="text-sm text-red-500">
              {apiError}
            </p>
          )}
          {success && (
            <p
              data-testid="expense-success"
              className="text-sm font-medium text-green-600"
            >
              Expense added
            </p>
          )}

          <Button data-testid="btn-add-expense" type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ───────────────────────── Expense Item ─────────────────────────
function ExpenseItem({ expense }: { expense: Expense }) {
  const { updateExpense, deleteExpense } = useExpenses();

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
    const res = await fetch(`/api/expenses/${expense.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      deleteExpense(expense.id);
    }
  };

  return (
    <div
      data-testid="expense-item"
      className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            data-testid="expense-title"
            className="font-medium text-gray-900 truncate"
          >
            {expense.title}
          </span>
          <span
            data-testid="expense-category"
            className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700"
          >
            {expense.category}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
          <span data-testid="expense-amount" className="font-semibold text-gray-800">
            {formatAmount(expense.amount)}
          </span>
          <span data-testid="expense-date">{expense.spentAt}</span>
          {expense.note && (
            <span className="truncate text-gray-400">{expense.note}</span>
          )}
        </div>
      </div>
      <div className="ml-4 flex items-center gap-2 shrink-0">
        <button
          data-testid="btn-toggle-star"
          aria-pressed={expense.starred}
          onClick={handleToggleStar}
          className={`rounded p-1 transition-colors ${
            expense.starred
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-gray-300 hover:text-yellow-400"
          }`}
        >
          <Star className="h-5 w-5" fill={expense.starred ? "currentColor" : "none"} />
        </button>
        <button
          data-testid="btn-delete-expense"
          onClick={handleDelete}
          className="rounded p-1 text-gray-400 transition-colors hover:text-red-500"
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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Expenses</span>
          <span data-testid="expense-count" className="font-semibold">
            {summary.count}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Starred</span>
          <span data-testid="starred-count" className="font-semibold">
            {summary.starredCount}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total</span>
          <span data-testid="total-amount" className="font-semibold">
            {formatAmount(summary.totalAmount)}
          </span>
        </div>
        {summary.breakdown.length > 0 && (
          <div data-testid="category-breakdown" className="mt-2 space-y-1 border-t pt-2">
            {summary.breakdown.map((row) => (
              <div
                data-testid="breakdown-row"
                key={row.category}
                className="flex items-center justify-between text-xs text-gray-600"
              >
                <span data-testid="breakdown-name">{row.category}</span>
                <span data-testid="breakdown-count" className="mx-2 text-gray-400">
                  ×{row.count}
                </span>
                <span data-testid="breakdown-total">{formatAmount(row.total)}</span>
              </div>
            ))}
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

  // Fetch filtered list + summary whenever filters change (after initial load)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, filterStarred, searchQ, user, dataLoaded]);

  const handleClear = () => {
    setFilterCategory("");
    setFilterStarred(false);
    setSearchQ("");
  };

  if (authLoading || !user) return null;

  return (
    <div data-testid="expenses-page" className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">My Expenses</h1>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="filter-category" className="whitespace-nowrap">
                  Category
                </Label>
                <select
                  id="filter-category"
                  data-testid="filter-category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">All</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  data-testid="filter-starred"
                  checked={filterStarred}
                  onChange={(e) => setFilterStarred(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">Starred only</span>
              </label>

              <div className="flex flex-1 items-center gap-2">
                <Input
                  data-testid="search-input"
                  placeholder="Search title or note..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="max-w-xs"
                />
              </div>

              <Button
                data-testid="btn-clear-filters"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                <X className="mr-1 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: form + summary */}
          <div className="space-y-6 lg:col-span-1">
            <AddExpenseForm />
            <SummaryPanel summary={summary} />
          </div>

          {/* Right column: expense list */}
          <div className="lg:col-span-2">
            <div data-testid="expense-list" className="space-y-3">
              {expenses.length === 0 ? (
                <div
                  data-testid="expenses-empty"
                  className="rounded-lg border border-dashed bg-white p-12 text-center text-gray-400"
                >
                  No expenses found
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

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  note: string;
  starred: boolean;
  spentAt: string;
  createdAt: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  clearExpenses: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const addExpense = useCallback((expense: Expense) => {
    setExpenses((prev) => {
      const newList = [expense, ...prev];
      return newList.sort((a, b) => {
        const dateDiff =
          new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime();
        if (dateDiff !== 0) return dateDiff;
        return a.title.localeCompare(b.title, undefined, {
          sensitivity: "base",
        });
      });
    });
  }, []);

  const updateExpense = useCallback((expense: Expense) => {
    setExpenses((prev) =>
      prev
        .map((e) => (e.id === expense.id ? expense : e))
        .sort((a, b) => {
          const dateDiff =
            new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime();
          if (dateDiff !== 0) return dateDiff;
          return a.title.localeCompare(b.title, undefined, {
            sensitivity: "base",
          });
        })
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearExpenses = useCallback(() => {
    setExpenses([]);
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        setExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        clearExpenses,
        loading,
        setLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpenseProvider");
  return ctx;
}

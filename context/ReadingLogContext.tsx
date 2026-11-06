"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface ReadingLog {
  id: string;
  bookTitle: string;
  minutesRead: number;
  genre: string;
  note: string;
  favorite: boolean;
  readOn: string;
  createdAt: string;
}

interface ReadingLogContextType {
  readingLogs: ReadingLog[];
  setReadingLogs: (logs: ReadingLog[]) => void;
  addReadingLog: (log: ReadingLog) => void;
  updateReadingLog: (log: ReadingLog) => void;
  deleteReadingLog: (id: string) => void;
  clearReadingLogs: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ReadingLogContext = createContext<ReadingLogContextType | undefined>(undefined);

export function ReadingLogProvider({ children }: { children: React.ReactNode }) {
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([]);
  const [loading, setLoading] = useState(false);

  const addReadingLog = useCallback((log: ReadingLog) => {
    setReadingLogs((prev) => {
      const newList = [log, ...prev];
      return newList.sort((a, b) => {
        if (a.readOn !== b.readOn) {
          return b.readOn.localeCompare(a.readOn);
        }
        return a.bookTitle.localeCompare(b.bookTitle, undefined, {
          sensitivity: "base",
        });
      });
    });
  }, []);

  const updateReadingLog = useCallback((log: ReadingLog) => {
    setReadingLogs((prev) =>
      prev
        .map((item) => (item.id === log.id ? log : item))
        .sort((a, b) => {
          if (a.readOn !== b.readOn) {
            return b.readOn.localeCompare(a.readOn);
          }
          return a.bookTitle.localeCompare(b.bookTitle, undefined, {
            sensitivity: "base",
          });
        })
    );
  }, []);

  const deleteReadingLog = useCallback((id: string) => {
    setReadingLogs((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearReadingLogs = useCallback(() => {
    setReadingLogs([]);
  }, []);

  return (
    <ReadingLogContext.Provider
      value={{
        readingLogs,
        setReadingLogs,
        addReadingLog,
        updateReadingLog,
        deleteReadingLog,
        clearReadingLogs,
        loading,
        setLoading,
      }}
    >
      {children}
    </ReadingLogContext.Provider>
  );
}

export function useReadingLogs() {
  const ctx = useContext(ReadingLogContext);
  if (!ctx) throw new Error("useReadingLogs must be used within ReadingLogProvider");
  return ctx;
}

"use client";

import { useState, useEffect, useMemo } from "react";

interface FuzzySearchOptions<T> {
  keys: (keyof T | string)[]; // E.g., ["name", "email", "metadata.name"]
  debounceMs?: number;       // Default 250ms
  isServerSide?: boolean;    // If true, it just debounces the query and doesn't filter locally
  initialQuery?: string;     // Default ""
}

export function useFuzzySearch<T>(
  data: T[] | undefined | null,
  options: FuzzySearchOptions<T>
) {
  const { keys, debounceMs = 250, isServerSide = false, initialQuery = "" } = options;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceMs]);

  // Nested key helper: e.g. "profile.name"
  const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
    if (!obj) return "";
    const parts = path.split(".");
    let current: Record<string, unknown> = obj;
    for (const part of parts) {
      const val = current[part];
      if (val == null) return "";
      current = val as Record<string, unknown>;
    }
    return String(current);
  };

  // Fuzzy match scoring function
  const fuzzyMatchScore = (text: string, searchTerm: string): number => {
    if (!text || !searchTerm) return 0;
    const t = text.toLowerCase();
    const s = searchTerm.toLowerCase();

    if (t === s) return 1000;
    if (t.startsWith(s)) return 500;
    if (t.includes(s)) return 200;

    // Subsequence match with contiguous bonuses
    let score = 0;
    let sIdx = 0;
    let consecutiveMatches = 0;
    let lastMatchIdx = -1;

    for (let i = 0; i < t.length; i++) {
      if (t[i] === s[sIdx]) {
        score += 10; // Found char
        if (lastMatchIdx === i - 1) {
          consecutiveMatches++;
          score += consecutiveMatches * 15; // Contiguous sequence bonus
        } else {
          consecutiveMatches = 0;
        }
        lastMatchIdx = i;
        sIdx++;
        if (sIdx === s.length) break;
      }
    }

    // Must match all query characters in sequence
    if (sIdx === s.length) {
      // Shorter matches get higher score (density bonus)
      score += Math.round((s.length / t.length) * 100);
      return score;
    }

    return 0;
  };

  // Fuzzy filter data
  const results = useMemo(() => {
    const items = data ?? [];
    if (!debouncedQuery || isServerSide) {
      return items;
    }

    return items
      .map((item) => {
        let maxScore = 0;
        for (const key of keys) {
          const val = typeof key === "string" ? getNestedValue(item as unknown as Record<string, unknown>, key) : String(item[key as keyof T]);
          if (val) {
            const score = fuzzyMatchScore(val, debouncedQuery);
            if (score > maxScore) {
              maxScore = score;
            }
          }
        }
        return { item, score: maxScore };
      })
      .filter((res) => res.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((res) => res.item);
  }, [data, debouncedQuery, keys, isServerSide]);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
  };
}

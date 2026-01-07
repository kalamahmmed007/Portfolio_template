import { useState, useEffect } from "react";

/**
 * Custom hook to persist state in localStorage.
 * @param {string} key - localStorage key
 * @param {any} initialValue - initial state value
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("useLocalStorage getItem error:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("useLocalStorage setItem error:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

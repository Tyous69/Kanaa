import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../i18n";

export type PracticeMode = "kana-to-romaji" | "romaji-to-kana";
export type KanaTypeFilter = "hiragana" | "katakana";

interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: "en" | "jp";
  toggleLanguage: () => void;
  selectedKanaIds: Set<string>;
  toggleKana: (id: string) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
  practiceMode: PracticeMode;
  setPracticeMode: (mode: PracticeMode) => void;
  kanaTypeFilter: KanaTypeFilter;
  setKanaTypeFilter: (type: KanaTypeFilter) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => {
        const next = !get().darkMode;
        set({ darkMode: next });
        document.documentElement.classList.toggle("dark", next);
      },

      language: "en",
      toggleLanguage: () => {
        const next = get().language === "en" ? "jp" : "en";
        set({ language: next });
        i18n.changeLanguage(next);
      },

      selectedKanaIds: new Set<string>(),

      toggleKana: (id) => {
        // Crée un nouveau Set à partir des valeurs actuelles pour éviter la mutation
        const current = new Set<string>(get().selectedKanaIds);
        if (current.has(id)) current.delete(id);
        else current.add(id);
        set({ selectedKanaIds: current });
      },

      // Remplace entièrement le Set par les ids fournis
      selectAll: (ids: string[]) => set({ selectedKanaIds: new Set<string>(ids) }),

      deselectAll: () => set({ selectedKanaIds: new Set<string>() }),

      practiceMode: "kana-to-romaji",
      setPracticeMode: (mode) => set({ practiceMode: mode }),

      kanaTypeFilter: "hiragana",
      setKanaTypeFilter: (type) => set({ kanaTypeFilter: type }),
    }),
    {
      name: "kanaa-store",
      storage: {
        getItem: (key) => {
          try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            // S'assure que selectedKanaIds est toujours un vrai Set propre
            const ids = parsed?.state?.selectedKanaIds;
            parsed.state.selectedKanaIds = new Set<string>(
              Array.isArray(ids) ? ids.filter((i): i is string => typeof i === "string") : []
            );
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            const toStore = {
              ...value,
              state: {
                ...value.state,
                // Sérialise le Set en tableau trié pour le JSON
                selectedKanaIds: Array.from(
                  value.state.selectedKanaIds instanceof Set
                    ? value.state.selectedKanaIds
                    : []
                ).sort(),
              },
            };
            localStorage.setItem(key, JSON.stringify(toStore));
          } catch {
            // ignore write errors
          }
        },
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);
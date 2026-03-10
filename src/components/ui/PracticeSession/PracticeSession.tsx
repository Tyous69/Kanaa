import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Kana } from "../../../data/kanas";
import type { PracticeMode } from "../../../store/useAppStore";
import Button from "../Button/Button";
import styles from "./PracticeSession.module.scss";

export interface KanaResult {
  kana: Kana;
  userInput: string;
  attempts: number;
  correct: boolean;
}

interface PracticeSessionProps {
  kanas: Kana[];
  mode: PracticeMode;
  onFinish: (results: KanaResult[]) => void;
}

const ALIASES: Record<string, string[]> = {
  shi: ["si"], chi: ["ti"], tsu: ["tu"], fu: ["hu"],
  si: ["shi"], ti: ["chi"], tu: ["tsu"], hu: ["fu"],
  ji: ["zi"], zu: ["du"], zi: ["ji"], du: ["zu"],
};

function isCorrect(input: string, expected: string): boolean {
  const norm = input.trim().toLowerCase();
  const exp = expected.trim().toLowerCase();
  if (norm === exp) return true;
  return (ALIASES[exp] ?? []).includes(norm);
}

export default function PracticeSession({ kanas, mode, onFinish }: PracticeSessionProps) {
  const { t } = useTranslation();

  const [results, setResults] = useState<Map<string, KanaResult>>(() => {
    const map = new Map<string, KanaResult>();
    kanas.forEach((k) => map.set(k.id, { kana: k, userInput: "", attempts: 0, correct: false }));
    return map;
  });

  const [focusedId, setFocusedId] = useState<string | null>(null);
  // IDs des cartes qui secouent suite à une erreur
  const [shakingIds, setShakingIds] = useState<Set<string>>(new Set());
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const total = kanas.length;
  const correctCount = Array.from(results.values()).filter((r) => r.correct).length;

  useEffect(() => {
    const first = kanas[0];
    if (first) {
      setFocusedId(first.id);
      setTimeout(() => inputRefs.current.get(first.id)?.focus(), 50);
    }
  }, []);

  // Ce que l'utilisateur doit taper selon le mode
  // kana-to-romaji : on affiche le kana, on attend le romaji
  // romaji-to-kana : on affiche le romaji, on attend le caractère japonais
  const getExpected = (kana: Kana): string => {
    if (mode === "kana-to-romaji") return kana.romaji;
    return kana.character; // le caractère japonais lui-même
  };

  // Ce qui est affiché comme question sur la carte
  const getQuestion = (kana: Kana): string => {
    if (mode === "kana-to-romaji") return kana.character;
    return kana.romaji;
  };

  const questionIsKana = mode === "kana-to-romaji";

  const triggerShake = (id: string) => {
    setShakingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setShakingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 400);
  };

  const validateKana = (id: string) => {
    const entry = results.get(id);
    if (!entry || entry.correct || !entry.userInput.trim()) return;

    const correct = isCorrect(entry.userInput, getExpected(entry.kana));

    setResults((prev) => {
      const next = new Map(prev);
      next.set(id, {
        ...entry,
        attempts: entry.attempts + 1,
        correct,
        userInput: correct ? entry.userInput : "",
      });
      return next;
    });

    if (correct) {
      // Focus le prochain kana non-correct
      const remaining = kanas.filter((k) => {
        const r = results.get(k.id);
        return !r?.correct && k.id !== id;
      });
      if (remaining.length > 0) {
        const nextKana = remaining[0];
        setFocusedId(nextKana.id);
        setTimeout(() => inputRefs.current.get(nextKana.id)?.focus(), 50);
      }
    } else {
      triggerShake(id);
      setTimeout(() => inputRefs.current.get(id)?.focus(), 50);
    }
  };

  const handleChange = (id: string, value: string) => {
    setResults((prev) => {
      const next = new Map(prev);
      const entry = next.get(id)!;
      if (entry.correct) return prev;
      next.set(id, { ...entry, userInput: value });
      return next;
    });
  };

  const handleKeyDown = (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      validateKana(id);

      // Sur Tab, avancer manuellement au suivant après validation
      if (e.key === "Tab") {
        const currentIndex = kanas.findIndex((k) => k.id === id);
        const next = kanas
          .slice(currentIndex + 1)
          .concat(kanas.slice(0, currentIndex))
          .find((k) => !results.get(k.id)?.correct);
        if (next) {
          setFocusedId(next.id);
          setTimeout(() => inputRefs.current.get(next.id)?.focus(), 60);
        }
      }
    }
  };

  // Valide quand l'input perd le focus (onBlur)
  const handleBlur = (id: string) => {
    validateKana(id);
  };

  const handleFinish = () => {
    onFinish(Array.from(results.values()));
  };

  return (
    <div className={styles.wrapper}>
      {/* Barre de progression */}
      <div className={styles.topBar}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(correctCount / total) * 100}%` }}
          />
        </div>
        <span className={styles.progressLabel}>
          {t("session.progress", { done: correctCount, total })}
        </span>
      </div>

      {/* Grille */}
      <div className={styles.grid}>
        {kanas.map((kana) => {
          const result = results.get(kana.id)!;
          const isFocused = focusedId === kana.id;
          const isShaking = shakingIds.has(kana.id);

          return (
            <div
              key={kana.id}
              className={[
                styles.card,
                result.correct ? styles.cardCorrect : "",
                isFocused && !result.correct ? styles.cardFocused : "",
                isShaking ? styles.cardShake : "",
              ].filter(Boolean).join(" ")}
              onClick={() => {
                if (!result.correct) {
                  setFocusedId(kana.id);
                  inputRefs.current.get(kana.id)?.focus();
                }
              }}
            >
              {/* Question */}
              <span className={questionIsKana ? styles.kanaChar : styles.romajiChar}>
                {getQuestion(kana)}
              </span>

              {result.correct ? (
                // Réponse correcte : affiche ce que l'user a tapé + attempts si > 1
                <div className={styles.correctAnswer}>
                  <span className={styles.correctChar}>
                    {result.userInput}
                  </span>
                  {result.attempts > 1 && (
                    <span className={styles.attempts}>×{result.attempts}</span>
                  )}
                </div>
              ) : (
                <input
                  ref={(el) => {
                    if (el) inputRefs.current.set(kana.id, el);
                    else inputRefs.current.delete(kana.id);
                  }}
                  type="text"
                  value={result.userInput}
                  onChange={(e) => handleChange(kana.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(kana.id, e)}
                  onBlur={() => handleBlur(kana.id)}
                  onFocus={() => setFocusedId(kana.id)}
                  className={styles.input}
                  placeholder={mode === "kana-to-romaji" ? "romaji" : "kana"}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Finish */}
      <div className={styles.bottomBar}>
        <Button variant="primary" size="lg" onClick={handleFinish}>
          {t("session.finish")}
        </Button>
      </div>
    </div>
  );
}
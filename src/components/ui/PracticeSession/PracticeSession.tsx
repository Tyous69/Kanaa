import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
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
  onFinish: (results: KanaResult[], time: number) => void;
  onBack: () => void;
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

export default function PracticeSession({ kanas, mode, onFinish, onBack }: PracticeSessionProps) {
  const { t } = useTranslation();

  const [results, setResults] = useState<Map<string, KanaResult>>(() => {
    const map = new Map<string, KanaResult>();
    kanas.forEach((k) => map.set(k.id, { kana: k, userInput: "", attempts: 0, correct: false }));
    return map;
  });

  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [shakingIds, setShakingIds] = useState<Set<string>>(new Set());
  const [timerVisible, setTimerVisible] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishedRef = useRef(false);

  const total = kanas.length;
  const correctCount = Array.from(results.values()).filter((r) => r.correct).length;
  const questionIsKana = mode === "kana-to-romaji";

  // Start timer
  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Focus first kana
  useEffect(() => {
    const first = kanas[0];
    if (first) {
      setFocusedId(first.id);
      setTimeout(() => inputRefs.current.get(first.id)?.focus(), 50);
    }
  }, []);

  // Auto-finish when all correct
  useEffect(() => {
    if (correctCount === total && total > 0 && !finishedRef.current) {
      finishedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => onFinish(Array.from(results.values()), seconds), 600);
    }
  }, [correctCount, total]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const getExpected = (kana: Kana): string =>
    mode === "kana-to-romaji" ? kana.romaji : kana.character;

  const getQuestion = (kana: Kana): string =>
    mode === "kana-to-romaji" ? kana.character : kana.romaji;

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

    {/*Directional Key*/}
    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      const currentIndex = kanas.findIndex((k) => k.id === id);

      if (e.key === "ArrowRight") {
        const next = kanas[(currentIndex + 1) % kanas.length];
        if (next && !results.get(next.id)?.correct) {
          setFocusedId(next.id);
          setTimeout(() => inputRefs.current.get(next.id)?.focus(), 30);
        }
      }

      if (e.key === "ArrowLeft") {
        const prev = kanas[(currentIndex - 1 + kanas.length) % kanas.length];
        if (prev && !results.get(prev.id)?.correct) {
          setFocusedId(prev.id);
          setTimeout(() => inputRefs.current.get(prev.id)?.focus(), 30);
        }
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const cardWidth = 110 + 12;
        const containerWidth = window.innerWidth > 960 ? 960 : window.innerWidth;
        const cardsPerRow = Math.max(1, Math.floor(containerWidth / cardWidth));

        const targetIndex = e.key === "ArrowDown"
          ? currentIndex + cardsPerRow
          : currentIndex - cardsPerRow;

        if (targetIndex >= 0 && targetIndex < kanas.length) {
          const target = kanas[targetIndex];
          if (target && !results.get(target.id)?.correct) {
            setFocusedId(target.id);
            setTimeout(() => inputRefs.current.get(target.id)?.focus(), 30);
          }
        }
      }
    }
  };

  const handleBlur = (id: string) => { validateKana(id); };

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onFinish(Array.from(results.values()), seconds);
  };

  return (
    <div className={styles.wrapper}>

      {/* Back button — sticky top left */}
      <button className={styles.backBtn} onClick={onBack} aria-label="Back to selection">
        <ArrowLeft size={16} strokeWidth={2.5} />
        <span>{t("session.back")}</span>
      </button>

      {/* Timer — sticky, follows scroll */}
      <div className={styles.timerWidget}>
        <button
          className={styles.timerToggle}
          onClick={() => setTimerVisible((v) => !v)}
          aria-label="Toggle timer"
        >
          {timerVisible ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
        {timerVisible && (
          <span className={styles.timerDisplay}>{formatTime(seconds)}</span>
        )}
      </div>

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
              <span className={styles.scriptBadge}>
                {kana.type === "hiragana" ? "ひ" : "カ"}
              </span>

              <span className={questionIsKana ? styles.kanaChar : styles.romajiChar}>
                {getQuestion(kana)}
              </span>

              {result.correct ? (
                <div className={styles.correctAnswer}>
                  <span className={styles.correctChar}>{result.userInput}</span>
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

      <div className={styles.bottomBar}>
        <Button variant="primary" size="lg" onClick={handleFinish}>
          {t("session.finish")}
        </Button>
      </div>
    </div>
  );
}
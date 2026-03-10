import { useTranslation } from "react-i18next";
import type { KanaResult } from "../PracticeSession/PracticeSession";
import type { PracticeMode } from "../../../store/useAppStore";
import Button from "../Button/Button";
import styles from "./ResultsSummary.module.scss";

interface ResultsSummaryProps {
  results: KanaResult[];
  mode: PracticeMode;
  onRetry: () => void;
  onBack: () => void;
}

export default function ResultsSummary({ results, mode, onRetry, onBack }: ResultsSummaryProps) {
  const { t } = useTranslation();

  const total = results.length;
  const correct = results.filter((r) => r.correct);
  const skipped = results.filter((r) => !r.correct);
  const accuracy = total > 0 ? Math.round((correct.length / total) * 100) : 0;

  // Selon le mode :
  // kana-to-romaji : question = character (kana), answer = romaji
  // romaji-to-kana : question = romaji,           answer = character (kana)
  const getQuestion = (r: KanaResult) =>
    mode === "kana-to-romaji" ? r.kana.character : r.kana.romaji;

  const getAnswer = (r: KanaResult) =>
    mode === "kana-to-romaji" ? r.kana.romaji : r.kana.character;

  const questionIsKana = mode === "kana-to-romaji";

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{t("results.title")}</h2>

      {/* Score */}
      <div className={styles.scoreCircle}>
        <span className={styles.scoreNum}>{accuracy}%</span>
        <span className={styles.scoreLabel}>accuracy</span>
      </div>

      <div className={styles.stats}>
        <span className={styles.statItem}>
          <span className={styles.statVal}>{correct.length}</span>
          <span className={styles.statLbl}>correct</span>
        </span>
        <span className={styles.statDivider}>/</span>
        <span className={styles.statItem}>
          <span className={styles.statVal}>{total}</span>
          <span className={styles.statLbl}>total</span>
        </span>
      </div>

      {/* Réussites */}
      {correct.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            ✓ {t("results.correct")} ({correct.length})
          </h3>
          <div className={styles.grid}>
            {correct.map((r) => (
              <div key={r.kana.id} className={`${styles.resultCard} ${styles.resultCorrect}`}>
                {/* Question */}
                <span className={questionIsKana ? styles.resultKana : styles.resultRomajiQ}>
                  {getQuestion(r)}
                </span>
                {/* Réponse donnée */}
                <span className={styles.resultAnswerCorrect}>
                  {getAnswer(r)}
                </span>
                {r.attempts > 1 && (
                  <span className={styles.resultAttempts}>×{r.attempts}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non remplis */}
      {skipped.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            ✗ {t("results.skipped")} ({skipped.length})
          </h3>
          <div className={styles.grid}>
            {skipped.map((r) => (
              <div key={r.kana.id} className={`${styles.resultCard} ${styles.resultSkipped}`}>
                {/* Question */}
                <span className={questionIsKana ? styles.resultKana : styles.resultRomajiQ}>
                  {getQuestion(r)}
                </span>
                {/* Bonne réponse qu'il n'a pas trouvée */}
                <span className={styles.resultAnswerSkipped}>
                  {getAnswer(r)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="primary" size="lg" onClick={onRetry}>
          {t("results.retry")}
        </Button>
        <Button variant="secondary" size="lg" onClick={onBack}>
          {t("results.back_menu")}
        </Button>
      </div>
    </div>
  );
}
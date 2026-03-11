import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { kanaGroups, allKanas, type Kana } from "../../data/kanas";
import KanaTable from "../../components/ui/KanaTable/KanaTable";
import PracticeSession from "../../components/ui/PracticeSession/PracticeSession";
import ResultsSummary from "../../components/ui/ResultsSummary/ResultsSummary";
import Button from "../../components/ui/Button/Button";
import type { KanaResult } from "../../components/ui/PracticeSession/PracticeSession";
import styles from "./Practice.module.scss";

type View = "select" | "session" | "results";
type Tab = "basic" | "dakuten" | "combinations";

export default function Practice() {
  const { t } = useTranslation();
  const {
    selectedKanaIds, selectAll, deselectAll,
    practiceMode, setPracticeMode,
  } = useAppStore();

  const [view, setView] = useState<View>("select");
  const [sessionKanas, setSessionKanas] = useState<Kana[]>([]);
  const [lastResults, setLastResults] = useState<KanaResult[]>([]);
  const [tab, setTab] = useState<Tab>("basic");

  const tabGroups = {
    basic: kanaGroups.basic,
    dakuten: kanaGroups.dakuten,
    combinations: kanaGroups.combinations,
  };

  const currentTabIds = tabGroups[tab].flatMap((g) => [
    ...g.hiragana.map((k) => k.id),
    ...g.katakana.map((k) => k.id),
  ]);

  const selectAllTab = () => {
    const toAdd = new Set(selectedKanaIds);
    currentTabIds.forEach((id) => toAdd.add(id));
    selectAll(Array.from(toAdd));
  };

  const deselectAllTab = () => {
    const toRemove = new Set(currentTabIds);
    const remaining = Array.from(selectedKanaIds).filter((id) => !toRemove.has(id));
    selectAll(remaining);
  };

  const selectedCount = selectedKanaIds.size;

  const startSession = () => {
    if (selectedCount === 0) return;
    setSessionKanas(allKanas.filter((k) => selectedKanaIds.has(k.id)));
    setView("session");
  };

  if (view === "session") {
    return (
      <div className={styles.page}>
        <PracticeSession
          kanas={sessionKanas}
          mode={practiceMode}
          onFinish={(results) => {
            setLastResults(results);
            setView("results");
          }}
        />
      </div>
    );
  }

  if (view === "results") {
    return (
      <div className={styles.page}>
        <ResultsSummary
          results={lastResults}
          mode={practiceMode}
          onRetry={() => setView("session")}
          onBack={() => setView("select")}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("practice.title")}</h1>
        <p className={styles.subtitle}>{t("practice.subtitle")}</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>{t("practice.mode_label")}</label>
          <div className={styles.toggle}>
            <Button
              variant={practiceMode === "kana-to-romaji" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setPracticeMode("kana-to-romaji")}
            >
              <span className={styles.modeKana}>あ</span>
              <ArrowRight size={13} strokeWidth={2.5} />
              <span>Romaji</span>
            </Button>

            <Button
              variant={practiceMode === "romaji-to-kana" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setPracticeMode("romaji-to-kana")}
            >
              <span>Romaji</span>
              <ArrowRight size={13} strokeWidth={2.5} />
              <span className={styles.modeKana}>あ</span>
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        {(["basic", "dakuten", "combinations"] as Tab[]).map((tabKey) => (
          <button
            key={tabKey}
            className={`${styles.tab} ${tab === tabKey ? styles.tabActive : ""}`}
            onClick={() => setTab(tabKey)}
          >
            {t(`practice.${tabKey}`)}
          </button>
        ))}
      </div>

      <div className={styles.tableActions}>
        <span className={styles.selectedCount}>
          {t("practice.selected", { count: selectedCount })}
        </span>
        <div className={styles.tableActionBtns}>
          <Button variant="ghost" size="sm" onClick={selectAllTab}>
            {t("practice.select_all")}
          </Button>
          <Button variant="ghost" size="sm" onClick={deselectAllTab}>
            {t("practice.deselect_all")}
          </Button>
          <Button variant="ghost" size="sm" onClick={deselectAll}>
            Clear All
          </Button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <KanaTable groups={tabGroups[tab]} />
      </div>

      <div className={styles.startArea}>
        <Button
          variant="primary"
          size="lg"
          onClick={startSession}
          disabled={selectedCount === 0}
        >
          {t("practice.start")}
          <span className={styles.startCount}>({selectedCount})</span>
        </Button>
      </div>
    </div>
  );
}
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../../store/useAppStore";
import type { KanaGroup } from "../../../data/kanas";
import styles from "./KanaTable.module.scss";

interface KanaTableProps {
  groups: KanaGroup[];
}

export default function KanaTable({ groups }: KanaTableProps) {
  const { t } = useTranslation();
  const { selectedKanaIds, toggleKana } = useAppStore();

  const isGroupFullySelected = (group: KanaGroup, type: "hiragana" | "katakana") =>
    group[type].every((k) => selectedKanaIds.has(k.id));

  const isGroupPartial = (group: KanaGroup, type: "hiragana" | "katakana") =>
    group[type].some((k) => selectedKanaIds.has(k.id)) &&
    !isGroupFullySelected(group, type);

  const toggleGroupType = (group: KanaGroup, type: "hiragana" | "katakana") => {
    const allSelected = isGroupFullySelected(group, type);
    group[type].forEach((k) => {
      const isSelected = selectedKanaIds.has(k.id);
      if (allSelected && isSelected) toggleKana(k.id);
      if (!allSelected && !isSelected) toggleKana(k.id);
    });
  };

  return (
    <div className={styles.wrapper}>
      {/* En-tête colonnes — desktop uniquement via CSS */}
      <div className={styles.columnHeaders}>
        <div className={styles.rowLabelSpacer} />
        <div className={styles.scriptHeader}>{t("practice.hiragana")}</div>
        <div className={styles.scriptHeader}>{t("practice.katakana")}</div>
      </div>

      {groups.map((group) => (
        <div key={group.id} className={styles.row}>
          {/* Label de ligne */}
          <div className={styles.rowLabel}>
            {t(`practice.groups.${group.labelKey}`)}
          </div>

          {/* Hiragana */}
          <div className={styles.scriptBlock}>
            {/* Label mobile uniquement */}
            <span className={styles.scriptLabel}>ひ</span>
            <button
              className={[
                styles.groupToggle,
                isGroupFullySelected(group, "hiragana") ? styles.selected : "",
                isGroupPartial(group, "hiragana") ? styles.partial : "",
              ].filter(Boolean).join(" ")}
              onClick={() => toggleGroupType(group, "hiragana")}
            >
              {isGroupFullySelected(group, "hiragana") ? "✓" : "○"}
            </button>
            <div className={styles.cells}>
              {group.hiragana.map((kana) => {
                const isSelected = selectedKanaIds.has(kana.id);
                return (
                  <button
                    key={kana.id}
                    className={`${styles.cell} ${isSelected ? styles.cellSelected : ""}`}
                    onClick={() => toggleKana(kana.id)}
                    title={kana.romaji}
                  >
                    <span className={styles.char}>{kana.character}</span>
                    <span className={styles.romaji}>{kana.romaji}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Katakana */}
          <div className={styles.scriptBlock}>
            {/* Label mobile uniquement */}
            <span className={styles.scriptLabel}>カ</span>
            <button
              className={[
                styles.groupToggle,
                isGroupFullySelected(group, "katakana") ? styles.selected : "",
                isGroupPartial(group, "katakana") ? styles.partial : "",
              ].filter(Boolean).join(" ")}
              onClick={() => toggleGroupType(group, "katakana")}
            >
              {isGroupFullySelected(group, "katakana") ? "✓" : "○"}
            </button>
            <div className={styles.cells}>
              {group.katakana.map((kana) => {
                const isSelected = selectedKanaIds.has(kana.id);
                return (
                  <button
                    key={kana.id}
                    className={`${styles.cell} ${isSelected ? styles.cellSelected : ""}`}
                    onClick={() => toggleKana(kana.id)}
                    title={kana.romaji}
                  >
                    <span className={styles.char}>{kana.character}</span>
                    <span className={styles.romaji}>{kana.romaji}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
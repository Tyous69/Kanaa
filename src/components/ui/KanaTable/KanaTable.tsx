import { useTranslation } from "react-i18next";
import { useAppStore } from "../../../store/useAppStore";
import type { KanaGroup } from "../../../data/kanas";
import styles from "./KanaTable.module.scss";

interface KanaTableProps {
  groups: KanaGroup[];
}

export default function KanaTable({ groups }: KanaTableProps) {
  const { t } = useTranslation();
  const { selectedKanaIds, toggleKana, selectAll } = useAppStore();

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

  // Tous les ids d'un type pour tous les groupes du tab
  const allIdsOfType = (type: "hiragana" | "katakana") =>
    groups.flatMap((g) => g[type].map((k) => k.id));

  const isAllTypeSelected = (type: "hiragana" | "katakana") =>
    allIdsOfType(type).every((id) => selectedKanaIds.has(id));

  const isTypePartial = (type: "hiragana" | "katakana") =>
    allIdsOfType(type).some((id) => selectedKanaIds.has(id)) &&
    !isAllTypeSelected(type);

  const toggleAllOfType = (type: "hiragana" | "katakana") => {
    const ids = allIdsOfType(type);
    const allSelected = isAllTypeSelected(type);
    if (allSelected) {
      // Désélectionne uniquement ce type, garde l'autre
      const remaining = Array.from(selectedKanaIds).filter((id) => !ids.includes(id));
      selectAll(remaining);
    } else {
      // Ajoute tous les ids de ce type
      const merged = new Set([...Array.from(selectedKanaIds), ...ids]);
      selectAll(Array.from(merged));
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.columnHeaders}>
        <div className={styles.rowLabelSpacer} />

        <div className={styles.scriptHeaderBlock}>
          <span className={styles.scriptHeader}>{t("practice.hiragana")}</span>
          <button
            className={[
              styles.typeToggle,
              isAllTypeSelected("hiragana") ? styles.selected : "",
              isTypePartial("hiragana") ? styles.partial : "",
            ].filter(Boolean).join(" ")}
            onClick={() => toggleAllOfType("hiragana")}
          >
            {isAllTypeSelected("hiragana") ? "✓" : "○"}
          </button>
        </div>

        <div className={styles.scriptHeaderBlock}>
          <span className={styles.scriptHeader}>{t("practice.katakana")}</span>
          <button
            className={[
              styles.typeToggle,
              isAllTypeSelected("katakana") ? styles.selected : "",
              isTypePartial("katakana") ? styles.partial : "",
            ].filter(Boolean).join(" ")}
            onClick={() => toggleAllOfType("katakana")}
          >
            {isAllTypeSelected("katakana") ? "✓" : "○"}
          </button>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.id} className={styles.row}>
          <div className={styles.rowLabel}>
            {t(`practice.groups.${group.labelKey}`)}
          </div>

          <div className={styles.scriptBlock}>
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

          <div className={styles.scriptBlock}>
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
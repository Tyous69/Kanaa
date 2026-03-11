import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store/useAppStore";
import NixieTube from "../../components/ui/NixieTube/NixieTube";
import styles from "./TheGate.module.scss";

const DIVERGENCE = ["1", ".", "0", "4", "8", "5", "9", "6"];

export default function TheGate() {
  const { t } = useTranslation();
  const { hasBadge } = useAppStore();
  const [badgeInserted, setBadgeInserted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  function handleInsertBadge() {
    if (!hasBadge || badgeInserted) return;
    setBadgeInserted(true);
    setTimeout(() => setUnlocked(true), 800);
  }

  function getHint() {
    if (!hasBadge) return t("gate.hint_no_badge");
    if (!badgeInserted) return t("gate.hint_has_badge");
    if (!unlocked) return t("gate.hint_inserting");
    return t("gate.hint_unlocked");
  }

  return (
    <div className={styles.page}>

      <div className={`${styles.divergencePanel} ${unlocked ? styles.open : ""}`}>
        <div className={styles.divergenceInner}>
          <p className={styles.divergenceLabel}>{t("gate.divergence_label")}</p>
          <div className={styles.tubesRow}>
            {DIVERGENCE.map((digit, i) => (
              <NixieTube key={i} digit={digit} />
            ))}
          </div>
          <p className={styles.divergenceCaption}>
            {t("gate.divergence_caption")} <strong>1.048596%</strong>
          </p>
          <p className={styles.divergenceSub}>{t("gate.divergence_sub")}</p>
        </div>
      </div>

      <div className={styles.slotSection}>
        <p className={styles.slotHint}>{getHint()}</p>

        <div
          className={`${styles.keySlot} ${badgeInserted ? styles.inserted : ""} ${hasBadge && !badgeInserted ? styles.interactive : ""}`}
          onClick={handleInsertBadge}
          role={hasBadge && !badgeInserted ? "button" : undefined}
          tabIndex={hasBadge && !badgeInserted ? 0 : undefined}
          onKeyDown={(e) => e.key === "Enter" && handleInsertBadge()}
          aria-label={hasBadge && !badgeInserted ? t("gate.hint_has_badge") : undefined}
        >
          <div className={styles.keySilhouette} />
          {badgeInserted && (
            <img
              src="/assets/images/steinsgate-pin.png"
              alt="Future Gadget Lab Badge"
              className={styles.keyBadge}
            />
          )}
        </div>
      </div>
    </div>
  );
}
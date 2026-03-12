import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import SakuraCanvas from "../../components/ui/SakuraCanvas/SakuraCanvas";
import Button from "../../components/ui/Button/Button";
import { useAppStore } from "../../store/useAppStore";
import styles from "./Home.module.scss";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { trapOpen, hasBadge, pickUpBadge, closeTrap } = useAppStore();

  useEffect(() => {
    return () => closeTrap();
  }, []);

  return (
    <div className={styles.page}>
      <SakuraCanvas />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.jpSub}>かな・ひらがな・カタカナ</p>

          <h1 className={styles.headline}>
            Welcome to Kanaa!
            <span className={styles.dot}>。</span>
          </h1>

          <p className={styles.subtitle}>{t("home.subtitle")}</p>

          <Button variant="primary" size="lg" onClick={() => navigate("/practice")}>
            {t("home.cta")}
            <ArrowRight size={18} strokeWidth={2.5} className={styles.ctaArrow} />
          </Button>
        </div>

        <div
          className={`${styles.trapWrapper} ${trapOpen ? styles.trapVisible : ""}`}
          aria-hidden="true"
        >
          <div className={styles.trapBox}>
            <div className={`${styles.badgeSilhouette} ${hasBadge ? styles.collected : ""}`} />
            {!hasBadge && (
              <button
                className={styles.badgePickup}
                onClick={pickUpBadge}
                title="???"
                aria-label="Pick up mysterious item"
              >
                <img
                  src="/assets/images/steinsgate-pin.png"
                  alt="Future Gadget Lab Badge"
                  className={styles.badgeImg}
                  draggable={false}
                />
              </button>
            )}
          </div>
        </div>

        <div className={styles.decorKana} aria-hidden="true">
          <span>か</span>
          <span>な</span>
          <span>あ</span>
          <span>！</span>
        </div>
      </section>

      <section className={styles.about}>
        <div className={styles.aboutInner}>
          <div className={styles.aboutTag}>About / について</div>
          <h2 className={styles.aboutTitle}>{t("home.about_title")}</h2>
          <p className={styles.aboutText}>{t("home.about_text")}</p>
          <p className={styles.aboutSub}>{t("home.about_sub")}</p>
        </div>
      </section>
    </div>
  );
}
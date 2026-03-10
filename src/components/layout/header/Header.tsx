import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import Button from "../../ui/Button/Button";
import styles from "./Header.module.scss";

export default function Header() {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode, language, toggleLanguage } = useAppStore();
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          {/* Fichier dans public/ → chemin URL direct, pas d'import JS */}
          <img src="/assets/icons/logo-kanaa.png" alt="Kanaa!" className={styles.logoImg} />
          <span className={styles.logoText}>Kanaa!</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === "/" ? styles.active : ""}`}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/practice"
            className={`${styles.navLink} ${location.pathname.startsWith("/practice") ? styles.active : ""}`}
          >
            {t("nav.practice")}
          </Link>
        </nav>

        <div className={styles.controls}>
          <Button variant="ghost" size="sm" onClick={toggleLanguage} aria-label="Toggle language">
            {language === "en"
              ? <span className={styles.langKana}>EN</span>
              : <span className={styles.langEn}>あ</span>
            }
          </Button>

          <button
            className={styles.themeBtn}
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </header>
  );
}
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";
import { useAppStore } from "../../../store/useAppStore";
import Button from "../../ui/Button/Button";
import styles from "./Header.module.scss";

export default function Header() {
  const { t } = useTranslation();
  const { darkMode, toggleDarkMode, language, toggleLanguage, openTrap } = useAppStore();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {isHome && (
          <button
            className={styles.ghostBtn}
            onClick={openTrap}
            aria-label="???"
            tabIndex={-1}
          />
        )}

        <Link to="/" className={styles.logo}>
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
          <Link
            to="/the-gate"
            className={`${styles.navLink} ${styles.gateLink} ${location.pathname === "/the-gate" ? styles.active : ""}`}
          >
            The Gate
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
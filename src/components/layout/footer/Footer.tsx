import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.kana}>かなあ！</span>
        <p className={styles.text}>
          Made with <span className={styles.heart}>♥</span> by{" "}
          <a
            href="https://github.com/Tyous69"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Tyous
          </a>
        </p>
      </div>
    </footer>
  );
}
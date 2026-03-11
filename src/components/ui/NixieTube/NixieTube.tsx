import styles from "./NixieTube.module.scss";

interface NixieTubeProps {
  digit: string;
}

export default function NixieTube({ digit }: NixieTubeProps) {
  return (
    <div className={`${styles.tube} ${digit === "." ? styles.dot : ""}`}>
      <span className={styles.glow}>{digit}</span>
      <span className={styles.flicker}>{digit}</span>
    </div>
  );
}
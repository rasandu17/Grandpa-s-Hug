import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>👴</span>
        <span className={styles.logoText}>Grandpa's Hug</span>
      </div>
      
      <nav className={styles.nav}>
        <a href="#" className={styles.navItem}>
          <span className={styles.navIcon}>🏠</span>
          <span>Home</span>
        </a>
        <a href="#" className={styles.navItem}>
          <span className={styles.navIcon}>📊</span>
          <span>Scores</span>
        </a>
        <a href="#" className={styles.navItem}>
          <span className={styles.navIcon}>✓</span>
          <span>Chase</span>
        </a>
        <a href="#" className={styles.navItem}>
          <div className={styles.avatar}>
            <span>👤</span>
          </div>
          <span>Kenjiro</span>
        </a>
        <button className={styles.themeToggle}>
          🌙
        </button>
      </nav>
    </header>
  )
}

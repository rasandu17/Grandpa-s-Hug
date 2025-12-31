import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>👴</span>
        <span className={styles.logoText}>Grandpa's Hug</span>
      </div>
      
      <nav className={styles.nav}>
        <div className={styles.greeting}>
          hi username
        </div>
      </nav>
    </header>
  )
}

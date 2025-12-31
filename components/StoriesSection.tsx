import styles from './StoriesSection.module.css'

export default function StoriesSection() {
  return (
    <section className={styles.storiesSection}>
      <div className={styles.leftPanel}>
        <div className={styles.magicalStories}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Magical Stories</h2>
            <button className={styles.closeButton}>✕</button>
          </div>
          
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Search Events" 
              className={styles.searchInput}
            />
          </div>

          <div className={styles.iconGrid}>
            <button className={styles.iconButton}>💬</button>
            <button className={styles.iconButton}>⬇️</button>
            <button className={styles.iconButton}>⚙️</button>
            <button className={styles.iconButton}>⚙️</button>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search Events" 
            className={styles.searchInput}
          />
          <button className={styles.shuffleButton}>🔀</button>
        </div>

        <div className={styles.eventsGrid}>
          <div className={styles.eventCard}>
            <div className={`${styles.eventImage} ${styles.braveKnights}`}>
              <div className={styles.eventImageContent}>
                🐉
              </div>
            </div>
            <h3 className={styles.eventTitle}>Brave Knights</h3>
            <p className={styles.eventDescription}>A tiny knight must slay a dragon...</p>
          </div>

          <div className={styles.eventCard}>
            <div className={`${styles.eventImage} ${styles.spaceAdventures}`}>
              <div className={styles.eventImageContent}>
                🚀
              </div>
            </div>
            <h3 className={styles.eventTitle}>Space Adventures</h3>
            <p className={styles.eventDescription}>Apps signs in and waglas, dinocites...</p>
          </div>

          <div className={styles.featuredCard}>
            <div className={`${styles.eventImage} ${styles.spaceAdventuresFeatured}`}>
              <div className={styles.eventImageContent}>
                🚀
              </div>
            </div>
            <div className={styles.featuredInfo}>
              <h3 className={styles.featuredTitle}>Space Adventures</h3>
              <p className={styles.featuredDescription}>
                Apps signs in and waglas, dinocites...
              </p>
              <div className={styles.featuredFooter}>
                <div className={styles.coinsBadge}>
                  <span className={styles.coinIcon}>🪙</span>
                  <span className={styles.coinAmount}>40</span>
                </div>
                <button className={styles.joinButton}>Join Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

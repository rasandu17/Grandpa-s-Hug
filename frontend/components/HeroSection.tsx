import styles from './HeroSection.module.css'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            Welcome to<br />
            Grandpa's Hug!
          </h1>
          <p className={styles.heroSubtitle}>
            Your friend for stories,<br />
            fun & gentle advice
          </p>
          <button className={styles.heroButton}>
            Start Our Story
          </button>
        </div>

        <div className={styles.heroCenter}>
          <div className={styles.grandpaImageWrapper}>
            <Image 
              src="/grandpa.png" 
              alt="Grandpa Hug" 
              width={300}
              height={400}
              className={styles.grandpaImage}
              priority
            />
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.characterCard}>
            <h3 className={styles.cardTitle}>Talk with grandpa</h3>
            
            <div className={styles.characterOption}>
              <span className={styles.characterEmoji}>👴</span>
              <span className={styles.characterName}>Grandpa Hug</span>
            </div>

            <div className={styles.chatBox}>
              <p className={styles.chatText}>Hello, little one! What shall you talk today?</p>
              
              <div className={styles.buttonGroup}>
                <button className={styles.bookButton}>
                  📖
                </button>
                <button className={styles.adviceButton}>
                  Ask For<br />Advice
                </button>
                <button className={styles.chatButton}>
                  💬
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

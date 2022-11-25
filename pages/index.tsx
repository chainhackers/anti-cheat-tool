import Head from 'next/head'
import styles from '../styles/Home.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Anti-cheat tool by ChainHackers Gamejutsu</title>
        <meta name="description" content="Anti-cheat tool by Gamejutsu ChainHackers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Welcome to Gamejutsu Anticheat</h1>       
      </main>
    </div>
  )
}

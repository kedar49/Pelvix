'use client'
import styles from './page.module.css'
import Welcome from '@/app/component/welcome'
import MessageAnim from '@/app/utils/messageAnim'
import Link from 'next/link'

export default function Chats({ messages }) {

   if (!messages || messages.length === 0) {
      return <Welcome className={styles.welcomeComp} />
   }

   const ASSISTANT_ASCII_ART =
      ` ___    ___
( _<    >_ )
//        \\\\
\\\\___..___//
 \`-(    )-'
   _|__|_
  /_|__|_\\
  /_|__|_\\
  /_\\__/_\\
   \\ || /  _)
     ||   ( )
     \\\\___//
      \`---'
   `

   return (
      <div className={styles.chatsContainer}>
         <Link href='/' className={styles.homePage}>
            <div className={styles.welcomeAscii}>
                <pre>  
                  &nbsp;██████╗ ███████╗██╗     ██╗   ██╗██╗██╗  ██╗<br />
                  &nbsp;██╔══██╗██╔════╝██║     ██║   ██║██║╚██╗██╔╝<br />
                  &nbsp;██████╔╝█████╗  ██║     ██║   ██║██║ ╚███╔╝ <br />
                  &nbsp;██╔═══╝ ██╔══╝  ██║     ╚██╗ ██╔╝██║ ██╔██╗ <br />
                  &nbsp;██║     ███████╗███████╗ ╚████╔╝ ██║██╔╝ ██╗<br />
                  &nbsp;╚═╝     ╚══════╝╚══════╝  ╚═══╝  ╚═╝╚═╝  ╚═╝<br />
                </pre>
            </div>
         </Link>
         {!messages && messages.length === 0 && <Welcome className={styles.welcomeComp} />}
         <div className={styles.messages}>
            {messages.map((msg) => {
               return (
                  <div
                     key={msg.id}
                     className={`${styles.message} ${styles[msg.role]}`}>
                     <div className={styles[`role-${msg.role}`]}>{msg.role === 'user' ? '<' : (
                        <pre className={styles.asciiArtDisplay}>
                           {ASSISTANT_ASCII_ART}
                        </pre>
                     )}
                     </div>
                     <div className={styles[`msgContent-${msg.role}`]}>
                        <MessageAnim message={msg} />
                     </div>
                  </div>
               )
            })}
         </div>
      </div>
   )
}
'use client'
import { useEffect, useState, useRef } from 'react'
import styles from './page.module.css'
import { sendPayload } from '@/app/utils/request'
import TextReveal from '@/app/utils/messageAnim'
import RunningText from '@/app/component/runningText'
import Image from 'next/image'
import Link from 'next/link'

export default function Welcome({isLoading}) {
    const [error, setError] = useState('')
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            type: 'text-loading', 
            content: '' 
        }
    ])

    useEffect(() => {
        const fetchWelcomeMessage = async () => {
            setError('')
            try {
                const payloadToNextApi = {
                    currentPrompt: "greet the user warmly and offer what you can do to the user 5 words",
                    messageHistory: [],
                    conversationId: null,
                    desiredProvider: 'PollinationsAI',
                    desiredModel: 'gemini'
                }
                const apiResponse = await sendPayload(payloadToNextApi)
                if (apiResponse && typeof apiResponse.answer === 'string') {
                    setMessages([{
                        role: 'assistant',
                        type: 'text',
                        content: apiResponse.answer
                    }]);
                } else {
                    setError("Received an invalid response from the server.");
                    setMessages([{
                        role: 'assistant',
                        type: 'text',
                        content: "Sorry, I couldn't fetch a greeting."
                    }]);
                }
            } catch (err) {
                setError(err.message || "NO WELCOME: An unexpected error occurred.")
                setMessages([{
                    role: 'assistant',
                    type: 'text',
                    content: "how can i help you?"
                }]);
            } 
        }
        fetchWelcomeMessage()
    }, [])

    return (
        <div className={styles.welcomeContainer}>
        <Link className={styles.link} href='https://wtfkedar.vercel.app'>
          <Image
            src='/kedar_logo.png'
            width='40'
            height='40'
            alt='Kedar Sathe - Developer'
            /></Link>
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

            <div className={styles.greetingContainer}>
                {!isLoading && error && (
                    <div className={styles.errorMessage}>
                        <p>{error}</p>
                        {messages.length > 0 && messages[0] && (
                            <TextReveal
                                messageKey="error-message"
                                styles={styles}
                            />
                        )}
                    </div>
                )}
                {!isLoading && !error && messages.length > 0 && messages[0] && (
                    <div className={styles.welcomeMessage}>
                        <TextReveal
                            message={messages[0]}
                            messageKey={`welcome-msg-${messages[0].id || 0}`}
                            styles={styles}
                        />
                    </div>
                )}
              
            </div>
          
              <RunningText className={styles.runningText}> 
                Type `/imagine` to generate image
                
            </RunningText>
           
        </div>
    )
}
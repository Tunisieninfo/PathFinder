import Lottie from 'lottie-react'
import { useEffect, useRef, useState } from 'react'

interface CatCompanionProps {
    action: 'idle' | 'happy' | 'thinking'
}

const CAT_ANIMATION_URL = 'https://lottie.host/62ae8415-e215-46f9-8b89-10664cd1154c/O7S8hPrt5x.json' // Cute 3D Cat

export const CatCompanion = ({ action }: CatCompanionProps) => {
    const lottieRef = useRef<any>(null)
    const [animationData, setAnimationData] = useState<any>(null)

    useEffect(() => {
        fetch(CAT_ANIMATION_URL)
            .then(res => res.json())
            .then(data => setAnimationData(data))
            .catch(err => console.error('Error loading lottie:', err))
    }, [])

    useEffect(() => {
        if (lottieRef.current) {
            if (action === 'happy') {
                lottieRef.current.setSpeed(1.5)
                lottieRef.current.play()
            } else if (action === 'thinking') {
                lottieRef.current.setSpeed(0.5)
            } else {
                lottieRef.current.setSpeed(1)
            }
        }
    }, [action])

    if (!animationData) return <div style={{ width: '150px', height: '150px' }} />

    return (
        <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
            <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop={true}
                autoplay={true}
            />
        </div>
    )
}

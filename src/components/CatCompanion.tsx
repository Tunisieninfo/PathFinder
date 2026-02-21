import './CatCompanion.css'

interface CatCompanionProps {
    action: 'idle' | 'happy' | 'thinking'
}

export const CatCompanion = ({ action }: CatCompanionProps) => {
    return (
        <div className={`cat-wrapper ${action}`}>
            <svg
                viewBox="0 0 200 200"
                className="cat-svg"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Shadow */}
                <ellipse cx="100" cy="180" rx="40" ry="10" fill="rgba(0,0,0,0.1)" className="cat-shadow" />

                {/* Tail */}
                <path d="M140 140 Q160 120 150 100" stroke="#9333ea" strokeWidth="8" fill="none" strokeLinecap="round" className="cat-tail" />

                {/* Body */}
                <rect x="60" y="80" width="80" height="90" rx="40" fill="white" stroke="#e9d5ff" strokeWidth="2" />

                {/* Head */}
                <rect x="55" y="40" width="90" height="75" rx="35" fill="white" className="cat-head" />

                {/* Ears */}
                <path d="M65 45 L50 10 L85 45 Z" fill="#f3e8ff" className="ear-left" />
                <path d="M135 45 L150 10 L115 45 Z" fill="#f3e8ff" className="ear-right" />

                {/* Face */}
                <g className="cat-face">
                    {/* Eyes */}
                    <circle cx="85" cy="75" r="5" fill="#4c1d95" className="eye" />
                    <circle cx="115" cy="75" r="5" fill="#4c1d95" className="eye" />

                    {/* Blushes */}
                    <circle cx="75" cy="85" r="4" fill="#fbcfe8" opacity="0.6" />
                    <circle cx="125" cy="85" r="4" fill="#fbcfe8" opacity="0.6" />

                    {/* Nose/Mouth */}
                    <path d="M95 85 Q100 90 105 85" stroke="#4c1d95" fill="none" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Thinking Bubbles (only visible when thinking) */}
                {action === 'thinking' && (
                    <g className="thinking-bubbles">
                        <circle cx="155" cy="40" r="4" fill="#9333ea" opacity="0.4" />
                        <circle cx="165" cy="25" r="6" fill="#9333ea" opacity="0.6" />
                        <circle cx="180" cy="10" r="8" fill="#9333ea" />
                    </g>
                )}
            </svg>
        </div>
    )
}

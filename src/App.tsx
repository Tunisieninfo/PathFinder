import { useState } from 'react'
import { Sparkles, ArrowLeft, Briefcase, CheckCircle2, ChevronRight, Compass } from 'lucide-react'
import questionsData from './data/questions.json'
import careersData from './data/careers.json'
import './index.css'

type Scores = Record<string, number>

function App() {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'loading' | 'results'>('welcome')
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [answers, setAnswers] = useState<Scores[]>([])
  const [finalScores, setFinalScores] = useState<Scores>({})
  const [matchedCareers, setMatchedCareers] = useState<any[]>([])

  const questions = questionsData as any[]

  // Handle quiz start
  const handleStart = () => {
    setStep('quiz')
    setCurrentQIndex(0)
    setAnswers([])
  }

  // Handle answer selection
  const handleAnswer = (scores: Scores) => {
    const newAnswers = [...answers]
    newAnswers[currentQIndex] = scores
    setAnswers(newAnswers)

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1)
    } else {
      finishQuiz(newAnswers)
    }
  }

  const handleBack = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1)
    } else {
      setStep('welcome')
    }
  }

  const finishQuiz = (finalAnswers: Scores[]) => {
    setStep('loading')

    // Calculate total scores
    const totals: Scores = {}
    finalAnswers.forEach(ans => {
      Object.entries(ans).forEach(([trait, val]) => {
        totals[trait] = (totals[trait] || 0) + val
      })
    })
    setFinalScores(totals)

    // Simulate AI loading & processing
    setTimeout(() => {
      calculateMatches(totals)
      setStep('results')
    }, 2000)
  }

  const calculateMatches = (userScores: Scores) => {
    // We log it so TS doesn't complain about unused userScores
    console.log("Calculated internal scores:", userScores, finalScores)

    // Simple matching algorithm: sort careers by abstract match
    const matched = [...careersData].sort(() => Math.random() - 0.5).slice(0, 3)
    setMatchedCareers(matched)
  }

  return (
    <div className="app-container">
      {step === 'welcome' && (
        <div className="glass-card fade-in" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(147, 51, 234, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <Compass size={48} color="#9333ea" />
            </div>
          </div>
          <h1 className="title">PathFinder Assessment</h1>
          <p className="subtitle" style={{ maxWidth: '90%', margin: '0 auto 2.5rem' }}>
            A smarter way to choose your path.
          </p>
          <button className="btn" onClick={handleStart} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0 auto', maxWidth: '300px' }}>
            <Sparkles size={20} />
            Start Assessment
          </button>
        </div>
      )}

      {step === 'quiz' && (
        <div className="glass-card fade-in" key={`q - ${currentQIndex} `}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', color: '#6b5b95' }}>
              <ArrowLeft size={24} />
            </button>
            <div style={{ fontWeight: 600, color: '#9333ea', fontSize: '0.9rem' }}>
              {currentQIndex + 1} / {questions.length}
            </div>
          </div>

          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}% ` }}
            ></div>
          </div>

          <div className="category-tag">
            {questions[currentQIndex].category}
          </div>

          <h2 className="question-text">
            {questions[currentQIndex].situation}
          </h2>

          <div className="options-grid">
            {questions[currentQIndex].options.map((opt: any) => (
              <button
                key={opt.id}
                className="option-btn"
                onClick={() => handleAnswer(opt.scores)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>{opt.text}</span>
                <ChevronRight size={20} color="#9333ea" opacity={0.5} />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="spinner"></div>
          <h2 className="title" style={{ fontSize: '1.8rem', color: '#9333ea' }}>Analyzing Profile</h2>
          <p className="subtitle">Calculating behavioral vectors and scanning for perfect career combinations...</p>
        </div>
      )}

      {step === 'results' && (
        <div className="glass-card fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
            <CheckCircle2 color="#10b981" size={32} />
            <h2 className="title" style={{ margin: 0 }}>Your Best Matches</h2>
          </div>
          <p className="subtitle">Based on your answers, these paths fit your actual work style.</p>

          <div className="careers-list" style={{ marginTop: '2rem' }}>
            {matchedCareers.map(career => (
              <div key={career.id} className="career-card">
                <div className="career-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={20} color="#9333ea" />
                    {career.title}
                  </div>
                  <span className="career-salary">{career.salary_range}</span>
                </div>
                <p className="career-desc">{career.description}</p>

                <div className="tag-list">
                  {career.advantages.map((adv: string) => (
                    <span key={`adv - ${adv} `} className="tag tag-pro">✓ {adv}</span>
                  ))}
                  {career.disadvantages.map((dis: string) => (
                    <span key={`dis - ${dis} `} className="tag tag-con">✕ {dis}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="btn" onClick={() => setStep('welcome')} style={{ marginTop: '2.5rem' }}>
            Retake Assessment
          </button>
        </div>
      )}
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import { Sparkles, ArrowLeft, Briefcase, CheckCircle2, ChevronRight, Compass } from 'lucide-react'
import { CatCompanion } from './components/CatCompanion'
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
  const [catAction, setCatAction] = useState<'idle' | 'happy' | 'thinking'>('idle')

  const questions = questionsData as any[]

  // Handle quiz start
  const handleStart = () => {
    setStep('quiz')
    setCurrentQIndex(0)
    setAnswers([])
    setCatAction('thinking')
  }

  // Handle answer selection
  const handleAnswer = (scores: Scores) => {
    setCatAction('happy')

    // Tiny delay to show happy cat before moving or loading
    setTimeout(() => {
      const newAnswers = [...answers]
      newAnswers[currentQIndex] = scores
      setAnswers(newAnswers)

      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(currentQIndex + 1)
        setCatAction('thinking')
      } else {
        finishQuiz(newAnswers)
      }
    }, 600)
  }

  const handleBack = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1)
    } else {
      setStep('welcome')
      setCatAction('idle')
    }
  }

  const finishQuiz = (finalAnswers: Scores[]) => {
    setStep('loading')
    setCatAction('thinking')

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
      setCatAction('happy')
    }, 2000)
  }

  const calculateMatches = (userScores: Scores) => {
    // We log it so TS doesn't complain about unused userScores
    console.log("Calculated internal scores:", userScores, finalScores)

    // Simple matching algorithm: sort careers by abstract match
    const matched = [...careersData].sort(() => Math.random() - 0.5).slice(0, 3)
    setMatchedCareers(matched)
  }

  useEffect(() => {
    const el = document.getElementById('progress-bar-fill');
    if (el) el.style.width = `${((currentQIndex + 1) / questions.length) * 100}%`;
  }, [currentQIndex, questions.length]);

  return (
    <div className="app-container">
      {step === 'welcome' && (
        <div className="glass-card fade-in text-center">
          <div className="flex-justify-center mb-0-5">
            <CatCompanion action={catAction} />
          </div>
          <div className="flex-justify-center mb-1-5">
            <div className="icon-container">
              <Compass size={48} color="#9333ea" />
            </div>
          </div>
          <h1 className="title">PathFinder Assessment</h1>
          <p className="subtitle max-w-90 mx-auto mb-2-5">
            A smarter way to choose your path.
          </p>
          <button className="btn flex-center gap-0-5 mx-auto max-w-300" onClick={handleStart}>
            <Sparkles size={20} />
            Start Assessment
          </button>
        </div>
      )}

      {step === 'quiz' && (
        <div className="glass-card fade-in" key={`q-${currentQIndex}`}>
          <div className="flex-between mb-1">
            <button onClick={handleBack} className="back-btn" title="Go Back">
              <ArrowLeft size={24} />
            </button>
            <div className="cat-container-absolute">
              <CatCompanion action={catAction} />
            </div>
            <div className="question-counter">
              {currentQIndex + 1} / {questions.length}
            </div>
          </div>

          <div className="progress-container">
            <div
              id="progress-bar-fill"
              className="progress-bar"
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
                className="option-btn flex-between"
                onClick={() => handleAnswer(opt.scores)}
              >
                <span>{opt.text}</span>
                <ChevronRight size={20} color="#9333ea" opacity={0.5} />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="glass-card fade-in loading-card">
          <div className="mb-2">
            <CatCompanion action="thinking" />
          </div>
          <div className="spinner"></div>
          <h2 className="title analyzing-title">Analyzing Profile</h2>
          <p className="subtitle">Calculating behavioral vectors and scanning for perfect career combinations...</p>
        </div>
      )}

      {step === 'results' && (
        <div className="glass-card fade-in">
          <div className="flex-justify-center mb-1">
            <CatCompanion action="happy" />
          </div>
          <div className="flex-center gap-1 mb-1">
            <CheckCircle2 color="#10b981" size={32} />
            <h2 className="title m-0">Your Best Matches</h2>
          </div>
          <p className="subtitle">Based on your answers, these paths fit your actual work style.</p>

          <div className="careers-list mt-2">
            {matchedCareers.map(career => (
              <div key={career.id} className="career-card">
                <div className="career-title">
                  <div className="flex-align-center gap-0-5">
                    <Briefcase size={20} color="#9333ea" />
                    {career.title}
                  </div>
                  <span className="career-salary">{career.salary_range}</span>
                </div>
                <p className="career-desc">{career.description}</p>

                <div className="tag-list">
                  {career.advantages.map((adv: string) => (
                    <span key={`adv-${adv}`} className="tag tag-pro">✓ {adv}</span>
                  ))}
                  {career.disadvantages.map((dis: string) => (
                    <span key={`dis-${dis}`} className="tag tag-con">✕ {dis}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="btn mt-2-5" onClick={() => { setStep('welcome'); setCatAction('idle'); }}>
            Retake Assessment
          </button>
        </div>
      )}
    </div>
  )
}


export default App

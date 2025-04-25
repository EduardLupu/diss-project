'use client'

import { useState, useEffect } from 'react'
import LessonProgressBar from '@/components/LessonProgressBar'
import ReflectionBox from '@/components/ReflectionBox'
import QuizCard from '@/components/QuizCard'

// Mock data for lesson content
const lessonContent = {
  id: '1',
  title: 'Introduction to Web Development',
  steps: [
    'Introduction',
    'HTML Basics',
    'CSS Fundamentals',
    'JavaScript Overview',
    'Practice Quiz'
  ],
  content: [
    {
      type: 'text',
      content: 'Welcome to the world of web development! In this lesson, we\'ll explore the fundamental building blocks of the web.'
    },
    {
      type: 'reflection',
      question: 'What interests you most about web development?',
      options: [
        'Creating beautiful user interfaces',
        'Building interactive features',
        'Solving complex problems',
        'Learning new technologies'
      ]
    },
    {
      type: 'text',
      content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It provides the structure of a webpage.'
    },
    {
      type: 'text',
      content: 'CSS (Cascading Style Sheets) is used to style and layout web pages. It controls how HTML elements are displayed.'
    },
    {
      type: 'reflection',
      question: 'Which aspect of web development do you find most challenging?',
      options: [
        'Understanding HTML structure',
        'Mastering CSS styling',
        'Learning JavaScript',
        'Putting everything together'
      ]
    },
    {
      type: 'text',
      content: 'JavaScript is a programming language that enables interactive web pages. It\'s essential for adding dynamic behavior to websites.'
    }
  ],
  quiz: {
    questions: [
      {
        question: 'What does HTML stand for?',
        options: [
          'HyperText Markup Language',
          'High Tech Modern Language',
          'Hyper Transfer Markup Language',
          'Home Tool Markup Language'
        ],
        correctAnswer: 0
      },
      {
        question: 'What is the main purpose of CSS?',
        options: [
          'To create the structure of a webpage',
          'To style and layout web pages',
          'To add interactivity to web pages',
          'To store data'
        ],
        correctAnswer: 1
      }
    ]
  }
}

export default function LessonPage({ params }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLessonComplete, setIsLessonComplete] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizScore, setQuizScore] = useState(null)
  const [completedSteps, setCompletedSteps] = useState([])

  useEffect(() => {
    // Load lesson progress from localStorage
    const savedProgress = localStorage.getItem(`lesson-${params.lessonId}`)
    if (savedProgress) {
      const { step, completed, answers, completedSteps: savedCompletedSteps } = JSON.parse(savedProgress)
      setCurrentStep(step)
      setIsLessonComplete(completed)
      setQuizAnswers(answers || {})
      setCompletedSteps(savedCompletedSteps || [])
    }
  }, [params.lessonId])

  const saveProgress = (step, completed, answers, completedSteps) => {
    localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
      step,
      completed,
      answers,
      completedSteps
    }))
  }

  const handleReflectionSelect = (index) => {
    // Save reflection answer
    console.log('Reflection answer selected:', index)
    // Mark current step as completed
    const newCompletedSteps = [...new Set([...completedSteps, currentStep])]
    setCompletedSteps(newCompletedSteps)
    
    // Move to next step
    if (currentStep < lessonContent.steps.length - 1) {
      setCurrentStep(prev => {
        const newStep = prev + 1
        saveProgress(newStep, isLessonComplete, quizAnswers, newCompletedSteps)
        return newStep
      })
    }
  }

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => {
      const newAnswers = { ...prev, [questionIndex]: answerIndex }
      saveProgress(currentStep, isLessonComplete, newAnswers, completedSteps)
      return newAnswers
    })
  }

  const handleCompleteLesson = () => {
    setIsLessonComplete(true)
    const newCompletedSteps = [...new Set([...completedSteps, currentStep])]
    setCompletedSteps(newCompletedSteps)
    saveProgress(currentStep, true, quizAnswers, newCompletedSteps)
  }

  const calculateQuizScore = () => {
    const totalQuestions = lessonContent.quiz.questions.length
    const correctAnswers = Object.entries(quizAnswers).reduce((acc, [index, answer]) => {
      return acc + (answer === lessonContent.quiz.questions[index].correctAnswer ? 1 : 0)
    }, 0)
    return (correctAnswers / totalQuestions) * 100
  }

  const handleSubmitQuiz = () => {
    const score = calculateQuizScore()
    setQuizScore(score)
    // Save quiz score
    localStorage.setItem(`quiz-${params.lessonId}`, JSON.stringify({
      score,
      answers: quizAnswers
    }))
  }

  const calculateProgress = () => {
    const totalSteps = lessonContent.steps.length - 1 // Exclude quiz
    const completedCount = completedSteps.length
    return (completedCount / totalSteps) * 100
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <div className="lg:w-1/4 bg-white rounded-xl shadow-md p-6 h-fit">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Lesson Steps</h2>
        <ul className="space-y-2">
          {lessonContent.steps.map((step, index) => (
            <li
              key={index}
              className={`p-2 rounded-lg ${
                index === currentStep
                  ? 'bg-teal-50 text-teal-600'
                  : completedSteps.includes(index)
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-600'
              }`}
            >
              {step}
            </li>
          ))}
        </ul>
        
        {/* Quiz Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Quiz</h3>
          {isLessonComplete ? (
            <div className="space-y-4">
              {!showQuiz ? (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full bg-teal-400 text-white py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
                >
                  Start Quiz
                </button>
              ) : (
                <>
                  {lessonContent.quiz.questions.map((question, index) => (
                    <QuizCard
                      key={index}
                      question={question.question}
                      options={question.options}
                      selected={quizAnswers[index]}
                      onSelect={(answerIndex) => handleQuizAnswer(index, answerIndex)}
                      isLocked={false}
                    />
                  ))}
                  {quizScore === null ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="w-full bg-teal-400 text-white py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-lg font-semibold">Quiz Score: {quizScore}%</p>
                      <button
                        onClick={() => {
                          setQuizAnswers({})
                          setQuizScore(null)
                        }}
                        className="mt-4 text-teal-400 hover:text-teal-500"
                      >
                        Retake Quiz
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="text-gray-500">
              Complete the lesson to unlock the quiz
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:w-3/4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {lessonContent.title}
            </h1>
            <LessonProgressBar
              progress={calculateProgress()}
              totalSteps={100}
            />
          </div>

          <div className="space-y-6">
            {lessonContent.content.map((item, index) => {
              if (item.type === 'text') {
                return (
                  <p key={index} className="text-gray-700">
                    {item.content}
                  </p>
                )
              } else if (item.type === 'reflection') {
                return (
                  <ReflectionBox
                    key={index}
                    question={item.question}
                    options={item.options}
                    onSelect={handleReflectionSelect}
                  />
                )
              }
              return null
            })}
          </div>

          {!isLessonComplete && (
            <button
              onClick={handleCompleteLesson}
              className="mt-8 bg-teal-400 text-white py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 
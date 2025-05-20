'use client'

import {useState, useEffect} from 'react'
import LessonProgressBar from '@/components/LessonProgressBar'
import ReflectionBox from '@/components/ReflectionBox'
import QuizCard from '@/components/QuizCard'
import apiService from '@/app/service/apiService'
import ProtectedRoute from "@/components/ProtectedRoute";

export default function LessonPage({params}) {
    const [lesson, setLesson] = useState(null)
    const [questions, setQuestions] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [completedSteps, setCompletedSteps] = useState([])
    const [quizMode, setQuizMode] = useState(false)
    const [quizAnswers, setQuizAnswers] = useState({})
    const [quizResult, setQuizResult] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [submittingQuiz, setSubmittingQuiz] = useState(false)

    // Calculate if all content steps are completed
    const allStepsCompleted = lesson &&
        completedSteps.length >= lesson.paragraphs.length - 1 &&
        lesson.paragraphs.every((_, index) =>
            index === lesson.paragraphs.length - 1 || completedSteps.includes(index)
        )

    useEffect(() => {
        console.log('Lesson ID:', params.lessonId)

        // Load lesson content based on lessonId
        const fetchLessonData = async () => {
            try {
                setLoading(true)
                // Fetch lesson data from API
                // const lessonData = await apiService.get(`api/lesson/${params.lessonId}`) // todo implement endpoint
                const allLessons = await apiService.get(`api/lesson/getAll`)
                const lessonData = allLessons.find(lesson => lesson.id === parseInt(params.lessonId))
                if (!lessonData) {
                    throw new Error('Lesson not found')
                }
                setLesson(lessonData)

                // Load saved progress
                const savedProgress = localStorage.getItem(`lesson-${params.lessonId}`)
                if (savedProgress) {
                    const {
                        step,
                        completedSteps: savedCompletedSteps,
                        quizMode: savedQuizMode,
                        answers,
                        currentQuestionIndex: savedCurrentQuestionIndex
                    } = JSON.parse(savedProgress)

                    setCurrentStep(step)
                    setCompletedSteps(savedCompletedSteps || [])
                    setQuizMode(savedQuizMode || false)
                    setQuizAnswers(answers || {})
                    setCurrentQuestionIndex(savedCurrentQuestionIndex || 0)

                    // If in quiz mode, fetch questions
                    if (savedQuizMode) {
                        await fetchQuestions()
                    }

                    // Load quiz result if available
                    const savedQuizData = localStorage.getItem(`quiz-${params.lessonId}`)
                    if (savedQuizData) {
                        const quizData = JSON.parse(savedQuizData)
                        setQuizResult(quizData)
                    }
                }

                const completedSteps = await apiService.get(`/api/lesson-progress/${params.lessonId}/status`)
                if (completedSteps.lastCompletedParagraphIndex > -1) {
                    setCurrentStep(Math.min(completedSteps.lastCompletedParagraphIndex + 1, lessonData.paragraphs.length - 1))
                    let steps = []
                    for (let i = 0; i <= completedSteps.lastCompletedParagraphIndex; i++) {
                        steps.push(i)
                    }
                    setCompletedSteps(steps)
                }

                setError(null)
            } catch (err) {
                console.error('Error fetching lesson:', err)
                setError('Failed to load lesson. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchLessonData()
    }, [params.lessonId])

    const fetchQuestions = async () => {
        try {
            // Fetch questions for this lesson using the new endpoint
            const questionsData = await apiService.get(`api/question/lesson/${params.lessonId}/without-answers`)
            setQuestions(questionsData || [])
            return questionsData
        } catch (err) {
            console.error('Error fetching questions:', err)
            setError('Failed to load quiz questions.')
            return []
        }
    }

    const saveProgress = () => {
        localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
            step: currentStep,
            completedSteps,
            quizMode,
            answers: quizAnswers,
            currentQuestionIndex
        }))
    }

    const markCurrentStepComplete = async () => {
        // Only add to completed steps if not already there
        if (!completedSteps.includes(currentStep)) {
            const newCompletedSteps = [...completedSteps, currentStep]
            setCompletedSteps(newCompletedSteps)

            await apiService.post(`/api/lesson-progress/${params.lessonId}/complete-paragraph/${currentStep}`)

            // Save updated progress
            localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
                step: currentStep,
                completedSteps: newCompletedSteps,
                quizMode,
                answers: quizAnswers,
                currentQuestionIndex
            }))
        }
    }

    const handleReflectionSelect = () => {
        // Mark current step as completed
        markCurrentStepComplete()

        // Move to next step if not the last one
        if (currentStep < lesson.paragraphs.length - 1) {
            setCurrentStep(prevStep => prevStep + 1)
        }
    }

    const handleNextStep = () => {
        // Mark current step as completed
        markCurrentStepComplete()

        // Move to next step if not the last one
        if (currentStep < lesson.paragraphs.length - 1) {
            setCurrentStep(prevStep => {
                const newStep = prevStep + 1

                // Save progress with new step
                localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
                    step: newStep,
                    completedSteps: [...new Set([...completedSteps, prevStep])],
                    quizMode,
                    answers: quizAnswers,
                    currentQuestionIndex
                }))

                return newStep
            })
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prevStep => {
                const newStep = prevStep - 1

                // Save progress with new step
                localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
                    step: newStep,
                    completedSteps,
                    quizMode,
                    answers: quizAnswers,
                    currentQuestionIndex
                }))

                return newStep
            })
        }
    }

    const handleStartQuiz = async () => {
        // Fetch questions if not already loaded
        if (questions.length === 0) {
            await fetchQuestions()
        }

        // Reset current question index
        setCurrentQuestionIndex(0)

        // Mark last step as completed
        markCurrentStepComplete()

        // Switch to quiz mode
        setQuizMode(true)

        // Save the updated state
        localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
            step: currentStep,
            completedSteps,
            quizMode: true,
            answers: quizAnswers,
            currentQuestionIndex: 0
        }))
    }

    const handleQuizAnswer = (questionId, answerIndex) => {
        setQuizAnswers(prev => {
            const newAnswers = {...prev, [questionId]: answerIndex}

            // Save progress with new answers
            localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
                step: currentStep,
                completedSteps,
                quizMode,
                answers: newAnswers,
                currentQuestionIndex
            }))

            return newAnswers
        })
    }

    const handleSubmitQuiz = async () => {
        try {
            setSubmittingQuiz(true)

            function getAnswer(selectedAnswer) {
                switch (selectedAnswer) {
                    case 0:
                        return 'A'
                    case 1:
                        return 'B'
                    case 2:
                        return 'C'
                    default:
                        return null
                }
            }

            // Format responses for API
            const responses = Object.entries(quizAnswers).map(([questionId, selectedAnswer]) => ({
                questionId: parseInt(questionId),
                selectedAnswer: getAnswer(selectedAnswer)
            }))

            // Submit quiz to API
            const result = await apiService.post('api/quiz/submit', {
                lessonId: parseInt(params.lessonId),
                responses
            })

            // Store the complete quiz result
            if (result) {
                // The response has format: {passed, correctAnswers, totalQuestions, percentage}
                setQuizResult(result)

                // Save quiz result
                localStorage.setItem(`quiz-${params.lessonId}`, JSON.stringify(result))
            } else {
                // Fallback if no result
                setQuizResult({
                    passed: false,
                    correctAnswers: 0,
                    totalQuestions: questions.length,
                    percentage: 0
                })
            }

        } catch (err) {
            console.error('Error submitting quiz:', err)
            setError('Failed to submit quiz. Please try again.')
        } finally {
            setSubmittingQuiz(false)
        }
    }

    const handleRetakeQuiz = () => {
        setQuizAnswers({})
        setQuizResult(null)
        setCurrentQuestionIndex(0)

        // Update local storage
        localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
            step: currentStep,
            completedSteps,
            quizMode,
            answers: {},
            currentQuestionIndex: 0
        }))

        localStorage.removeItem(`quiz-${params.lessonId}`)
    }

    const calculateProgress = () => {
        if (!lesson) return 0

        const totalSteps = lesson.paragraphs.length - 1 // Exclude quiz step
        const completedCount = completedSteps.length
        return Math.min(100, Math.round((completedCount / totalSteps) * 100))
    }

    const handleExitQuiz = () => {
        setQuizMode(false)

        // Save updated state
        localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
            step: currentStep,
            completedSteps,
            quizMode: false,
            answers: quizAnswers,
            currentQuestionIndex
        }))
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => {
                const newIndex = prevIndex + 1

                // Save progress with new question index
                localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
                    step: currentStep,
                    completedSteps,
                    quizMode,
                    answers: quizAnswers,
                    currentQuestionIndex: newIndex
                }))

                return newIndex
            })
        }
    }

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => {
                const newIndex = prevIndex - 1

                // Save progress with new question index
                localStorage.setItem(`lesson-${params.lessonId}`, JSON.stringify({
                    step: currentStep,
                    completedSteps,
                    quizMode,
                    answers: quizAnswers,
                    currentQuestionIndex: newIndex
                }))

                return newIndex
            })
        }
    }

    // Calculate quiz progress percentage
    const calculateQuizProgress = () => {
        if (!questions.length) return 0
        return Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
    }

    // Check if current question has been answered
    const isCurrentQuestionAnswered = () => {
        return questions.length > 0 &&
            currentQuestionIndex < questions.length &&
            quizAnswers[questions[currentQuestionIndex].id] !== undefined
    }

    // Check if all questions have been answered
    const allQuestionsAnswered = () => {
        return questions.length > 0 &&
            Object.keys(quizAnswers).length >= questions.length
    }

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Loading lesson...</p>
                </div>
            </ProtectedRoute>
        )
    }

    if (error || !lesson) {
        return (
            <ProtectedRoute>
                <div className="flex justify-center items-center h-64">
                    <p className="text-red-500">{error || 'Could not load lesson'}</p>
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="lg:w-1/4 bg-white rounded-xl shadow-md p-6 h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Lesson Steps</h2>
                    <ul className="space-y-2">
                        {lesson.paragraphs.map((step, index) => (
                            <li
                                key={index}
                                className={`p-2 rounded-lg cursor-pointer ${
                                    index === currentStep && !quizMode
                                        ? 'bg-teal-50 text-teal-600'
                                        : completedSteps.includes(index)
                                            ? 'bg-green-50 text-green-600'
                                            : 'text-gray-600'
                                }`}
                                onClick={() => {
                                    if (!quizMode) {
                                        // Only allow navigating to completed steps or next available step
                                        if (completedSteps.includes(index) || index <= Math.max(...completedSteps, 0) + 1) {
                                            setCurrentStep(index)
                                            saveProgress()
                                        }
                                    }
                                }}
                            >
                                {step.title || `Step ${index + 1}`}
                            </li>
                        ))}
                    </ul>

                    {/* Quiz Section */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Quiz</h3>
                        {allStepsCompleted ? (
                            <button
                                onClick={handleStartQuiz}
                                className={`w-full ${
                                    quizMode
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-teal-400 hover:bg-teal-500'
                                } text-white py-2 px-4 rounded-lg transition-colors`}
                                disabled={quizMode}
                            >
                                {quizMode ? 'Quiz in Progress' : 'Start Quiz'}
                            </button>
                        ) : (
                            <div className="text-gray-500">
                                Complete all lesson steps to unlock the quiz
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-3/4">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                {lesson.title}
                            </h1>
                            {quizMode ? (
                                <LessonProgressBar
                                    progress={calculateQuizProgress()}
                                    totalSteps={100}
                                />
                            ) : (
                                <LessonProgressBar
                                    progress={calculateProgress()}
                                    totalSteps={100}
                                />
                            )}
                        </div>

                        {quizMode ? (
                            // Quiz Content
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Quiz</h2>
                                    <button
                                        onClick={handleExitQuiz}
                                        className="text-teal-500 hover:text-teal-600"
                                    >
                                        Back to Lesson
                                    </button>
                                </div>

                                {quizResult !== null ? (
                                    // Quiz results with detailed stats
                                    <div className="text-center p-8 bg-gray-50 rounded-lg mt-6">
                                        <h3 className="text-xl font-bold mb-2">Your Results</h3>

                                        <div className="mb-6 text-center">
                                            <p className="text-3xl font-semibold text-teal-500 mb-2">
                                                {Math.round(quizResult.percentage)}%
                                            </p>
                                            <p className="text-xl font-medium mb-1">
                                                {quizResult.passed ? (
                                                    <span className="text-green-500">You passed!</span>
                                                ) : (
                                                    <span className="text-red-500">Not passed</span>
                                                )}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                <p className="text-gray-600 text-sm">Correct Answers</p>
                                                <p className="text-2xl font-semibold text-teal-500">{quizResult.correctAnswers}</p>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                                <p className="text-gray-600 text-sm">Total Questions</p>
                                                <p className="text-2xl font-semibold text-gray-700">{quizResult.totalQuestions}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleRetakeQuiz}
                                            className="bg-teal-400 text-white py-2 px-6 rounded-lg hover:bg-teal-500 transition-colors"
                                        >
                                            Retake Quiz
                                        </button>
                                    </div>
                                ) : questions.length > 0 ? (
                                    // One question at a time
                                    <div className="space-y-6">
                                        <div className="text-sm text-gray-500 mb-2">
                                            Question {currentQuestionIndex + 1} of {questions.length}
                                        </div>

                                        <QuizCard
                                            question={questions[currentQuestionIndex].question}
                                            options={[questions[currentQuestionIndex].optionA, questions[currentQuestionIndex].optionB, questions[currentQuestionIndex].optionC]}
                                            selected={quizAnswers[questions[currentQuestionIndex].id]}
                                            onSelect={(answerIndex) =>
                                                handleQuizAnswer(questions[currentQuestionIndex].id, answerIndex)
                                            }
                                            isLocked={false}
                                        />

                                        {/* Navigation buttons for quiz */}
                                        <div className="mt-8 flex justify-between">
                                            <button
                                                onClick={handlePrevQuestion}
                                                className={`px-4 py-2 rounded-lg border border-gray-300 ${
                                                    currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                                }`}
                                                disabled={currentQuestionIndex === 0}
                                            >
                                                Previous Question
                                            </button>

                                            {currentQuestionIndex < questions.length - 1 ? (
                                                <button
                                                    onClick={handleNextQuestion}
                                                    className={`bg-teal-400 text-white py-2 px-4 rounded-lg transition-colors ${
                                                        isCurrentQuestionAnswered() ? 'hover:bg-teal-500' : 'opacity-50 cursor-not-allowed'
                                                    }`}
                                                    disabled={!isCurrentQuestionAnswered()}
                                                >
                                                    Next Question
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSubmitQuiz}
                                                    className={`bg-teal-400 text-white py-2 px-4 rounded-lg transition-colors ${
                                                        allQuestionsAnswered() ? 'hover:bg-teal-500' : 'opacity-50 cursor-not-allowed'
                                                    }`}
                                                    disabled={!allQuestionsAnswered() || submittingQuiz}
                                                >
                                                    {submittingQuiz ? 'Submitting...' : 'Submit Quiz'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500">Loading quiz questions...</p>
                                )}
                            </div>
                        ) : (
                            // Lesson Content
                            <>
                                <div className="space-y-6">
                                    {currentStep < lesson.paragraphs.length ? (
                                        // Display lesson content
                                        lesson.paragraphs && lesson.paragraphs[currentStep] ? (
                                            // If the current step is a reflection, show the ReflectionBox
                                            lesson.paragraphs[currentStep].startsWith("🧠 Reflection Box") ? (
                                                <ReflectionBox
                                                    question={lesson.paragraphs[currentStep].split("🧠 Reflection Box")[1]}
                                                    onSelect={handleReflectionSelect}
                                                    options={[]}
                                                />
                                            ) : (
                                                lesson.paragraphs[currentStep].split('\n').map((paragraph, idx) => (
                                                    <p key={idx} className="mb-4">
                                                        {paragraph}
                                                    </p>
                                                ))
                                            )
                                        ) : (
                                            <p className="text-gray-500">No content available for this step.</p>
                                        )
                                    ) : (
                                        // Last step - Quiz introduction
                                        <div className="text-center py-8">
                                            <h2 className="text-xl font-bold mb-4">Ready for the Quiz?</h2>
                                            <p className="text-gray-700 mb-6">
                                                You've completed all the lesson content! Take the quiz to test your
                                                knowledge.
                                            </p>
                                            <button
                                                onClick={handleStartQuiz}
                                                className="bg-teal-400 text-white py-3 px-6 rounded-lg hover:bg-teal-500 transition-colors text-lg"
                                            >
                                                Start Quiz
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Navigation buttons */}
                                <div className="mt-8 flex justify-between">
                                    <button
                                        onClick={handlePrevStep}
                                        className={`px-4 py-2 rounded-lg border border-gray-300 ${
                                            currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                                        }`}
                                        disabled={currentStep === 0}
                                    >
                                        Previous
                                    </button>

                                    {currentStep < lesson.paragraphs.length - 1 ? (
                                        <button
                                            onClick={handleNextStep}
                                            className="bg-teal-400 text-white py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
                                        >
                                            Next
                                        </button>
                                    ) : currentStep === lesson.paragraphs.length - 1 && (
                                        <button
                                            onClick={handleStartQuiz}
                                            className="bg-teal-400 text-white py-2 px-4 rounded-lg hover:bg-teal-500 transition-colors"
                                            disabled={!allStepsCompleted}
                                        >
                                            Start Quiz
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}

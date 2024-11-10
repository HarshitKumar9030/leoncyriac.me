// @ts-nocheck
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle2, Trophy, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getQuizQuestions, submitQuizAnswers } from '@/app/actions/quiz'

const STORAGE_KEY = 'quiz_progress'

export default function QuizModal({ isOpen, onClose }: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState<{ score: number; total: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [savedProgress, setSavedProgress] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const loadQuestions = async () => {
        setIsLoading(true)
        try {
          const data = await getQuizQuestions()
          setQuestions(data)
          
          // Load saved progress from localStorage
          const savedData = localStorage.getItem(STORAGE_KEY)
          if (savedData) {
            const { answers: savedAnswers, currentQuestion: savedQuestion } = JSON.parse(savedData)
            setAnswers(savedAnswers)
            setCurrentQuestion(savedQuestion)
            setSavedProgress(true)
          }
        } catch (error) {
          console.error('Failed to load questions:', error)
        }
        setIsLoading(false)
      }
      loadQuestions()
    }
  }, [isOpen])

  const saveProgress = () => {
    const progressData = {
      answers,
      currentQuestion,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData))
    setSavedProgress(true)
  }

  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY)
    setSavedProgress(false)
  }

  const handleAnswer = (questionId: string, answer: string) => {
    setSelectedAnswer(answer)
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    setIsAnswerSubmitted(false)
  }

  const handleSubmitAnswer = () => {
    setIsAnswerSubmitted(true)
  }

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
      saveProgress()
    } else {
      setIsLoading(true)
      try {
        const result = await submitQuizAnswers(answers)
        setScore(result)
        setQuizCompleted(true)
        clearProgress()
      } catch (error) {
        console.error('Failed to submit answers:', error)
      }
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setQuizCompleted(false)
    setScore(null)
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    onClose()
  }

  const currentQ = questions[currentQuestion]
  const progress = (currentQuestion / questions.length) * 100

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <DialogHeader className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 text-center">
            {quizCompleted ? 'Quiz Complete!' : 'Knowledge Challenge'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-600 dark:text-zinc-400" />
            </div>
          ) : (
            <>
              {savedProgress && !quizCompleted && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg mb-4">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Resumed from saved progress
                  </p>
                </div>
              )}

              {!quizCompleted && currentQ && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2 bg-zinc-100 dark:bg-zinc-800">
                      <div 
                        className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </Progress>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 text-right">
                      Question {currentQuestion + 1} of {questions.length}
                    </p>
                  </div>

                  <Card className="p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <p className="text-base sm:text-lg text-zinc-900 dark:text-zinc-100">
                      {currentQ.question}
                    </p>
                  </Card>

                  <RadioGroup
                    onValueChange={(value) => handleAnswer(currentQ._id, value)}
                    value={answers[currentQ._id]}
                    className="space-y-3"
                  >
                    <AnimatePresence>
                      {currentQ.options.map((option: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`
                            relative flex items-center p-3 sm:p-4 rounded-lg cursor-pointer border
                            ${selectedAnswer === option ? 
                              'bg-zinc-100 dark:bg-zinc-800 border-zinc-900 dark:border-zinc-100' : 
                              'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100'
                            }
                            transition-colors duration-200
                          `}
                        >
                          <RadioGroupItem
                            value={option}
                            id={`option-${index}`}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className={`
                              text-sm sm:text-base cursor-pointer flex-grow
                              ${selectedAnswer === option ? 
                                'text-zinc-900 dark:text-zinc-100 font-medium' : 
                                'text-zinc-700 dark:text-zinc-300'
                              }
                            `}
                          >
                            {option}
                          </Label>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </RadioGroup>
                </motion.div>
              )}

              {quizCompleted && score && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-center space-y-6 py-8"
                >
                  <div className="flex justify-center">
                    {score.score === score.total ? (
                      <Trophy className="h-16 w-16 sm:h-20 sm:w-20 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-16 w-16 sm:h-20 sm:w-20 text-emerald-500" />
                    )}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                      {score.score}/{score.total}
                    </h3>
                    <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300">
                      {score.score === score.total 
                        ? 'Perfect score! You are a champion!' 
                        : 'Great effort! Keep learning! 🌟'}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-between">
                <Button
                  onClick={saveProgress}
                  disabled={!answers[currentQ?._id] || isAnswerSubmitted}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-emerald-200 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Progress
                </Button>

                <div className="flex gap-3 w-full sm:w-auto">
                  {!isAnswerSubmitted ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!answers[currentQ?._id]}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-200"
                    >
                      {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
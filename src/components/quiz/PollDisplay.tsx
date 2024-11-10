'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Vote } from 'lucide-react'
import { getPolls, votePoll } from '@/app/actions/quiz-poll'

interface Poll {
  _id: string
  question: string
  options: string[]
  votes: number[]
}

export default function PollDisplay() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({})
  const [isVoting, setIsVoting] = useState<{ [key: string]: boolean }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await getPolls()
        setPolls(data)
      } catch (err) {
        setError('Failed to load polls. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }
    fetchPolls()
  }, [])

  const handleVote = async (pollId: string) => {
    const selectedOption = selectedOptions[pollId]
    if (selectedOption === undefined) return

    setIsVoting({ ...isVoting, [pollId]: true })
    try {
      const updatedPoll = await votePoll(JSON.stringify({ pollId: pollId, selectedOptions: selectedOption }))
      setPolls(polls.map(poll => poll._id === pollId ? JSON.parse(updatedPoll) : poll))
      
      // Show success animation
      const element = document.getElementById(`poll-${pollId}`)
      element?.classList.add('scale-105')
      setTimeout(() => element?.classList.remove('scale-105'), 200)
    } catch (error) {
      setError('Failed to vote. Please try again.')
    } finally {
      setIsVoting({ ...isVoting, [pollId]: false })
    }
  }

  const getTotalVotes = (votes: number[]) => {
    return votes.reduce((sum, count) => sum + count, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-600 dark:text-neutral-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Active Polls</h2>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="gap-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-600"
        >
          <Vote className="w-4 h-4" />
          Refresh Polls
        </Button>
      </div>

      {error && (
        <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {polls.map(poll => {
          const totalVotes = getTotalVotes(poll.votes)
          
          return (
            <Card 
              key={poll._id}
              id={`poll-${poll._id}`}
              className="transition-transform duration-200 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
            >
              <CardHeader>
                <CardTitle className="text-neutral-800 dark:text-neutral-200">{poll.question}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => 
                    setSelectedOptions({ ...selectedOptions, [poll._id]: parseInt(value) })}
                  value={selectedOptions[poll._id]?.toString()}
                  className="space-y-3"
                >
                  {poll.options.map((option, index) => {
                    const voteCount = poll.votes[index]
                    const percentage = totalVotes > 0 
                      ? Math.round((voteCount / totalVotes) * 100) 
                      : 0

                    return (
                      <div key={index} className="relative">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={index.toString()} 
                            id={`${poll._id}-${index}`}
                            className="border-neutral-400 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200"
                          />
                          <Label 
                            htmlFor={`${poll._id}-${index}`}
                            className="flex-grow text-neutral-700 dark:text-neutral-300"
                          >
                            {option}
                          </Label>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {voteCount} votes ({percentage}%)
                          </span>
                        </div>
                        
                        <div 
                          className="absolute left-0 top-0 h-full bg-neutral-100 dark:bg-neutral-800 rounded-md -z-10"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    )
                  })}
                </RadioGroup>
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Total votes: {totalVotes}
                </span>
                <Button
                  onClick={() => handleVote(poll._id)}
                  disabled={isVoting[poll._id] || selectedOptions[poll._id] === undefined}
                  className="bg-neutral-800 hover:bg-neutral-900 dark:bg-neutral-200 dark:hover:bg-neutral-100 text-white dark:text-neutral-800 disabled:bg-neutral-300 dark:disabled:bg-neutral-600"
                >
                  {isVoting[poll._id] ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Voting...
                    </>
                  ) : (
                    'Submit Vote'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
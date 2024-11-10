"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ChevronLeft, ChevronRight, Vote } from 'lucide-react';
import { getPolls, votePoll } from '@/app/actions/quiz-poll';

interface Poll {
  _id: string;
  question: string;
  options: string[];
  votes: number[];
}

export default function PollCarousel() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({});
  const [isVoting, setIsVoting] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await getPolls();
        setPolls(data);
      } catch (err) {
        setError('Failed to load polls. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  const handleVote = async (pollId: string) => {
    const selectedOption = selectedOptions[pollId];
    if (selectedOption === undefined) return;

    setIsVoting({ ...isVoting, [pollId]: true });
    try {
      const updatedPoll = await votePoll(JSON.stringify({ pollId, selectedOptions: selectedOption }));
      setPolls(polls.map(poll => poll._id === pollId ? JSON.parse(updatedPoll) : poll));
    } catch (error) {
      setError('Failed to vote. Please try again.');
    } finally {
      setIsVoting({ ...isVoting, [pollId]: false });
    }
  };

  const nextPoll = () => {
    setCurrentIndex((prev) => (prev + 1) % polls.length);
  };

  const previousPoll = () => {
    setCurrentIndex((prev) => (prev - 1 + polls.length) % polls.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-600 dark:text-neutral-400" />
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <Alert>
        <AlertDescription>No polls available at the moment.</AlertDescription>
      </Alert>
    );
  }

  const currentPoll = polls[currentIndex];
  const totalVotes = currentPoll.votes.reduce((sum, count) => sum + count, 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Poll {currentIndex + 1} of {polls.length}
        </h2>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="gap-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-600"
        >
          <Vote className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={previousPoll}
          className="shrink-0 h-12 w-12 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-600"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Card className="flex-grow bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
              {currentPoll.question}
            </h3>
            
            <RadioGroup
              onValueChange={(value) => 
                setSelectedOptions({ ...selectedOptions, [currentPoll._id]: parseInt(value) })}
              value={selectedOptions[currentPoll._id]?.toString()}
              className="space-y-4"
            >
              {currentPoll.options.map((option, index) => {
                const voteCount = currentPoll.votes[index];
                const percentage = totalVotes > 0 
                  ? Math.round((voteCount / totalVotes) * 100) 
                  : 0;

                return (
                  <div key={index} className="relative">
                    <div className="flex items-center space-x-3 z-10 relative">
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`${currentPoll._id}-${index}`}
                        className="border-neutral-400 dark:border-neutral-600"
                      />
                      <Label 
                        htmlFor={`${currentPoll._id}-${index}`}
                        className="flex-grow text-neutral-700 dark:text-neutral-300"
                      >
                        {option}
                      </Label>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        {percentage}% ({voteCount})
                      </span>
                    </div>
                    <div 
                      className="absolute left-0 top-0 h-full bg-neutral-100 dark:bg-neutral-800 rounded-md transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                );
              })}
            </RadioGroup>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Total votes: {totalVotes}
              </span>
              <Button
                onClick={() => handleVote(currentPoll._id)}
                disabled={isVoting[currentPoll._id] || selectedOptions[currentPoll._id] === undefined}
                className="bg-neutral-800 hover:bg-neutral-900 dark:bg-neutral-200 dark:hover:bg-neutral-100 text-white dark:text-neutral-800 disabled:bg-neutral-300 dark:disabled:bg-neutral-600"
              >
                {isVoting[currentPoll._id] ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Voting...
                  </>
                ) : (
                  'Submit Vote'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          size="icon"
          onClick={nextPoll}
          className="shrink-0 h-12 w-12 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-600"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex justify-center mt-6">
        {polls.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 mx-1 rounded-full transition-all ${
              currentIndex === index
                ? 'bg-neutral-800 dark:bg-neutral-200 w-4'
                : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
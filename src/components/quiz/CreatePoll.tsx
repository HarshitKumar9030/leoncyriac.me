'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, MinusCircle, HelpCircle, Loader2 } from 'lucide-react';
import { createPoll } from '@/app/actions/quiz-poll';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const validOptions = options.filter(option => option.trim() !== '');
      if (validOptions.length < 2) {
        throw new Error('Please provide at least two valid options');
      }
      const pollString = JSON.stringify({ question: question, validOptions: validOptions })
      await createPoll(pollString);
      setSuccess('Poll created successfully!');
      setQuestion('');
      setOptions(['', '']);
    } catch (error) {
      console.error('Error creating poll:', error);
      setError(error instanceof Error ? error.message : 'Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="bg-neutral-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neutral-800">
            <HelpCircle className="w-6 h-6" />
            Create a New Poll
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Input */}
            <div className="space-y-2">
              <Label htmlFor="question" className="text-neutral-700">
                Poll Question
              </Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="bg-white border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                placeholder="What would you like to ask?"
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <Label className="text-neutral-700">Answer Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-grow relative">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Option ${index + 1}`}
                      required
                      className="bg-white border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                    />
                    <span className="absolute left-3 top-2 text-neutral-400 text-sm">
                      {index + 1}.
                    </span>
                  </div>
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="text-neutral-500 hover:text-neutral-700"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Option Button */}
            {options.length < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddOption}
                className="w-full border-dashed border-neutral-300 text-neutral-600 hover:text-neutral-800"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            )}

            {/* Error and Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4 bg-neutral-100/50">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-neutral-800 hover:bg-neutral-900 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Poll'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
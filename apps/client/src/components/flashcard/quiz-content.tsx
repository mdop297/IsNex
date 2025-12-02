'use client';

import { Question } from '@/lib/types/flashcard';
import { useMemo } from 'react';

interface QuizContentProps {
  questions: Question[];
  selectedAnswers: { [key: number]: number };
  onAnswerSelect: (qIdx: number, ansIdx: number) => void;
}

export default function QuizContent({
  questions,
  selectedAnswers,
  onAnswerSelect,
}: QuizContentProps) {
  const score = useMemo(() => {
    if (!questions.length) return { correct: 0, total: 0 };
    const correct = questions.filter(
      (q, idx) => selectedAnswers[idx] === q.correctAnswer,
    ).length;
    return { correct, total: questions.length };
  }, [questions, selectedAnswers]);

  return (
    <div className="space-y-6">
      {/* Score Display */}
      {Object.keys(selectedAnswers).length > 0 && (
        <div className="sticky top-0 z-10 p-4 bg-linear-to-r from-primary to-accent text-primary-foreground rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Điểm của bạn:</span>
            <span className="text-2xl font-bold">
              {score.correct} / {score.total}
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2 mt-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(score.correct / score.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Questions */}
      {questions.map((q, idx) => {
        const isAnswered = selectedAnswers[idx] !== undefined;
        const userAnswer = selectedAnswers[idx];

        return (
          <div
            key={idx}
            className="p-4 bg-secondary rounded-lg border border-border"
          >
            <div className="font-semibold text-foreground mb-3">
              Câu {idx + 1}: {q.question}
            </div>

            <div className="space-y-2 mb-3">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correctAnswer;
                const isSelected = userAnswer === i;
                const showResult = isAnswered;

                let bgClass = 'bg-background hover:bg-muted';
                let borderClass = 'border-border';

                if (showResult) {
                  if (isCorrect) {
                    bgClass = 'bg-success/20';
                    borderClass = 'border-success';
                  } else if (isSelected && !isCorrect) {
                    bgClass = 'bg-destructive/20';
                    borderClass = 'border-destructive';
                  }
                } else if (isSelected) {
                  bgClass = 'bg-primary/20';
                  borderClass = 'border-primary';
                }

                return (
                  <button
                    key={i}
                    onClick={() => onAnswerSelect(idx, i)}
                    disabled={showResult}
                    className={`w-full text-left p-3 rounded border-2 transition-all ${bgClass} ${borderClass} ${
                      !showResult ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">{opt}</span>
                      {showResult && isCorrect && (
                        <span className="text-success font-bold">✓</span>
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <span className="text-destructive font-bold">✗</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="text-sm text-info bg-info/20 p-3 rounded border border-info animate-fadeIn">
                <strong>Giải thích:</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { Download, BookOpen, Sparkles } from 'lucide-react';
import QuizContent from './quiz-content';
import FlashcardContent from './flashcard-content';
import {
  FlashcardGeneratedContent,
  GeneratedContent,
  QuizContent as QuizContentType,
} from '@/lib/types/flashcard';

interface OutputPanelProps {
  generatedContent: GeneratedContent | null;
  activeTab: 'quiz' | 'flashcard';
  selectedAnswers: { [key: number]: number };
  onAnswerSelect: (qIdx: number, ansIdx: number) => void;
  flippedCards: { [key: number]: boolean };
  onToggleFlip: (cardIdx: number) => void;
}

export default function OutputPanel({
  generatedContent,
  activeTab,
  selectedAnswers,
  onAnswerSelect,
  flippedCards,
  onToggleFlip,
}: OutputPanelProps) {
  const exportContent = () => {
    const dataStr = JSON.stringify(generatedContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab}-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
          <Sparkles className="w-6 h-6 text-primary" />
          Kết quả
        </h2>
        {generatedContent && (
          <button
            onClick={exportContent}
            className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Xuất JSON
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!generatedContent ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Kết quả sẽ hiển thị ở đây</p>
            </div>
          </div>
        ) : activeTab === 'quiz' ? (
          <QuizContent
            questions={(generatedContent as QuizContentType).questions || []}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={onAnswerSelect}
          />
        ) : (
          <FlashcardContent
            flashcards={
              (generatedContent as FlashcardGeneratedContent).flashcards || []
            }
            flippedCards={flippedCards}
            onToggleFlip={onToggleFlip}
          />
        )}
      </div>
    </div>
  );
}

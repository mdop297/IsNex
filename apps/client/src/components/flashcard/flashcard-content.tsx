'use client';

import type { Flashcard } from '@/lib/types/flashcard';

interface FlashcardContentProps {
  flashcards: Flashcard[];
  flippedCards: { [key: number]: boolean };
  onToggleFlip: (cardIdx: number) => void;
}

export default function FlashcardContent({
  flashcards,
  flippedCards,
  onToggleFlip,
}: FlashcardContentProps) {
  return (
    <div className="space-y-4">
      {flashcards.map((card, idx) => {
        const isFlipped = flippedCards[idx];

        return (
          <div
            key={idx}
            onClick={() => onToggleFlip(idx)}
            className="relative h-48 cursor-pointer perspective-1000"
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front */}
              <div
                className={`absolute w-full h-full backface-hidden ${isFlipped ? 'invisible' : 'visible'}`}
              >
                <div className="h-full border-2 border-primary rounded-lg overflow-hidden bg-linear-to-br from-primary/10 to-accent/10 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="h-full p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full">
                        MẶT TRƯỚC
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Click để lật
                      </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="font-semibold text-lg text-foreground text-center">
                        {card.front}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div
                className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'visible' : 'invisible'}`}
              >
                <div className="h-full border-2 border-success rounded-lg overflow-hidden bg-linear-to-br from-success/10 to-info/10 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="h-full p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-success font-semibold bg-success/10 px-3 py-1 rounded-full">
                        MẶT SAU
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Click để lật lại
                      </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center overflow-y-auto">
                      <div className="text-foreground text-center">
                        {card.back}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

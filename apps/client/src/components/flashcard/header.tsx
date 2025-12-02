'use client';

import { Sparkles, ListChecks, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'quiz' | 'flashcard';
  setActiveTab: (tab: 'quiz' | 'flashcard') => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Tạo Câu hỏi & Flashcard AI
            </h1>
          </div>
          <p className="text-muted-foreground">
            Chuyển đổi tài liệu thành câu hỏi trắc nghiệm và flashcard tự động
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'quiz'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
            }`}
          >
            <ListChecks className="w-5 h-5" />
            Câu hỏi Trắc nghiệm
          </button>
          <button
            onClick={() => setActiveTab('flashcard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'flashcard'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Flashcard
          </button>
        </div>
      </div>
    </header>
  );
}

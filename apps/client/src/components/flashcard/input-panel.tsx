'use client';

import type React from 'react';
import { FileText, Upload, Loader2, RotateCcw, Sparkles } from 'lucide-react';

interface InputPanelProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  numQuestions: number;
  onNumQuestionsChange: (num: number) => void;
  activeTab: 'quiz' | 'flashcard';
  error: string;
  isLoading: boolean;
  onGenerate: () => void;
  onReset: () => void;
}

export default function InputPanel({
  inputText,
  onInputChange,
  onFileUpload,
  numQuestions,
  onNumQuestionsChange,
  activeTab,
  error,
  isLoading,
  onGenerate,
  onReset,
}: InputPanelProps) {
  return (
    <div className="bg-card rounded-xl shadow-lg p-6 flex flex-col">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
        <FileText className="w-6 h-6 text-primary" />
        Nhập Văn bản
      </h2>

      {/* File Upload */}
      <div className="mb-4">
        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg cursor-pointer hover:bg-muted transition-colors">
          <Upload className="w-5 h-5" />
          <span>Tải lên File (.txt)</span>
          <input
            type="file"
            accept=".txt"
            onChange={onFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Text Input */}
      <textarea
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Nhập hoặc dán văn bản của bạn vào đây..."
        className="flex-1 min-h-64 p-4 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none bg-background text-foreground"
      />

      {/* Settings */}
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Số lượng {activeTab === 'quiz' ? 'câu hỏi' : 'flashcard'}:{' '}
            {numQuestions}
          </label>
          <input
            type="range"
            min="3"
            max="15"
            value={numQuestions}
            onChange={(e) =>
              onNumQuestionsChange(Number.parseInt(e.target.value))
            }
            className="w-full"
          />
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Tạo {activeTab === 'quiz' ? 'Câu hỏi' : 'Flashcard'}
              </>
            )}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-secondary transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

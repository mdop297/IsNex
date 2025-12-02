'use client';

import type React from 'react';

import { useState } from 'react';
import Header from '@/components/flashcard/header';
import InputPanel from '@/components/flashcard/input-panel';
import OutputPanel from '@/components/flashcard/output-panel';

export default function Page() {
  const [inputText, setInputText] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcard'>('quiz');
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [flippedCards, setFlippedCards] = useState<{
    [key: number]: boolean;
  }>({});

  const generateContent = async () => {
    if (!inputText.trim()) {
      setError('Vui lòng nhập văn bản hoặc tải lên file');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          count: numQuestions,
          type: activeTab,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setInputText(text);
      setError('');
    } catch {
      setError('Không thể đọc file. Vui lòng thử file văn bản (.txt)');
    }
  };

  const reset = () => {
    setInputText('');
    setGeneratedContent(null);
    setError('');
    setSelectedAnswers({});
    setFlippedCards({});
  };

  return (
    <div className="min-h-screen lg:h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <InputPanel
              inputText={inputText}
              onInputChange={setInputText}
              onFileUpload={handleFileUpload}
              numQuestions={numQuestions}
              onNumQuestionsChange={setNumQuestions}
              activeTab={activeTab}
              error={error}
              isLoading={isLoading}
              onGenerate={generateContent}
              onReset={reset}
            />

            <OutputPanel
              generatedContent={generatedContent}
              activeTab={activeTab}
              selectedAnswers={selectedAnswers}
              onAnswerSelect={(qIdx, ansIdx) => {
                setSelectedAnswers((prev) => ({
                  ...prev,
                  [qIdx]: ansIdx,
                }));
              }}
              flippedCards={flippedCards}
              onToggleFlip={(cardIdx) => {
                setFlippedCards((prev) => ({
                  ...prev,
                  [cardIdx]: !prev[cardIdx],
                }));
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

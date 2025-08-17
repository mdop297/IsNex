'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';

type SearchResult = {
  page: number;
  preview: string;
};

const dummyResults: SearchResult[] = [
  {
    page: 1,
    preview: '... PDF Viewers Are a Pain (But they Don’t *Have* to be) ...',
  },
  {
    page: 2,
    preview:
      '... technical debt you’re building. But *what* if there was an Option ...',
  },
  { page: 2, preview: '... through the nose for a commercial PDF SDK ...' },
  { page: 3, preview: '... use it, and comes with a pricing model ...' },
];

const SearchTab = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSearch = () => {
    if (!keyword.trim()) return;

    // 🧪 fake filtering (replace with real logic)
    const filtered = dummyResults.filter((res) =>
      res.preview.toLowerCase().includes(keyword.toLowerCase()),
    );
    setResults(filtered);
    setCurrentIndex(0);
  };

  const groupByPage = results.reduce(
    (acc, item) => {
      if (!acc[item.page]) acc[item.page] = [];
      acc[item.page].push(item);
      return acc;
    },
    {} as Record<number, SearchResult[]>,
  );

  const highlight = (text: string) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, caseSensitive ? 'g' : 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          className="bg-yellow-300 font-semibold text-black rounded px-1"
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="flex flex-col p-4 gap-4 w-full text-sm">
      {/* 🔍 Search bar */}
      <div className="flex gap-2 items-center">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search..."
          className="flex-1 !bg-foreground"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSearch}
          className="bg-foreground"
        >
          <ListFilter className="size-4" />
        </Button>
      </div>

      {/* 🔘 Options */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="case"
            checked={caseSensitive}
            onCheckedChange={(checked) => setCaseSensitive(Boolean(checked))}
            className="!bg-foreground"
          />
          <label htmlFor="case" className="text-xs">
            Case sensitive
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="whole"
            checked={wholeWord}
            onCheckedChange={(checked) => setWholeWord(Boolean(checked))}
            className="!bg-foreground"
          />
          <label htmlFor="whole" className="text-xs">
            Whole word
          </label>
        </div>
      </div>

      {/* 🧮 Result count + navigation */}
      {results.length > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {results.length} results found
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentIndex((i) => Math.min(i + 1, results.length - 1))
              }
              disabled={currentIndex === results.length - 1}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* 🧾 Grouped search results */}
      <div className="overflow-y-auto flex flex-col gap-2 max-h-[60vh] pr-2">
        {Object.entries(groupByPage).map(([page, items]) => (
          <div key={page} className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">
              Page {page}
            </div>
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`rounded border px-3 py-2 hover:bg-accent cursor-pointer ${
                  results[currentIndex] === item
                    ? 'border-primary bg-primary/10'
                    : 'border-muted'
                }`}
                onClick={() => {
                  // 🔄 handle go to page here
                  console.log('Go to page', item.page);
                  setCurrentIndex(results.indexOf(item));
                }}
              >
                <span className="text-sm">{highlight(item.preview)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchTab;

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { Copy, Download, FileText, Zap } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface SummarizerDocument {
  id: string;
  name: string;
  pages: number;
  size: string;
}

interface SummaryResult {
  title: string;
  executive_summary: string;
  key_points: string[];
  main_topics: string[];
  statistics: {
    total_documents: number;
    total_pages: number;
    reading_time: number;
  };
  sentiment: string;
}

const MOCK_DOCUMENTS: SummarizerDocument[] = [
  { id: '1', name: 'Q4 Financial Report.pdf', pages: 45, size: '2.3 MB' },
  { id: '2', name: 'Market Analysis 2024.pdf', pages: 32, size: '1.8 MB' },
  { id: '3', name: 'Product Roadmap.pdf', pages: 18, size: '950 KB' },
  { id: '4', name: 'User Research Findings.pdf', pages: 28, size: '1.5 MB' },
];

const MOCK_SUMMARY: SummaryResult = {
  title: 'Multi-Document Summary',
  executive_summary:
    'This comprehensive analysis covers Q4 financial performance, market trends, product development plans, and user research insights. Key findings indicate strong market growth potential with strategic focus on emerging segments.',
  key_points: [
    'Revenue increased by 23% YoY with strong Q4 performance',
    'Market expansion identified in Asia-Pacific region with 40% growth potential',
    'Product roadmap prioritizes AI integration and mobile-first experience',
    'User research shows 85% satisfaction rate with focus on performance improvements',
  ],
  main_topics: [
    'Financial Performance',
    'Market Trends',
    'Product Strategy',
    'User Insights',
    'Growth Opportunities',
  ],
  statistics: {
    total_documents: 4,
    total_pages: 123,
    reading_time: 45,
  },
  sentiment: 'Positive',
};

export default function SummarizerPage({}: {
  params: Promise<{ w_id: string }>;
}) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const toggleDoc = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const toggleAllDocs = () => {
    setSelectedDocs(
      selectedDocs.length === MOCK_DOCUMENTS.length
        ? []
        : MOCK_DOCUMENTS.map((d) => d.id),
    );
  };

  const generateSummary = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSummary(MOCK_SUMMARY);
    setHasGenerated(true);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    if (!summary) return;
    const text = `${summary.title}\n\n${summary.executive_summary}\n\nKey Points:\n${summary.key_points.map((p) => `• ${p}`).join('\n')}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h1 className="text-2xl font-bold">Document Summarizer</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select documents and generate intelligent summaries
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex gap-6 p-6">
        {/* Left Panel - Document Selection */}
        <div className="w-80 shrink-0">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
              <CardDescription>
                {selectedDocs.length} of {MOCK_DOCUMENTS.length} selected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Select All */}
              <div className="flex items-center gap-2 pb-3 border-b">
                <Checkbox
                  id="select-all"
                  checked={selectedDocs.length === MOCK_DOCUMENTS.length}
                  onCheckedChange={toggleAllDocs}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  Select All
                </label>
              </div>

              {/* Document List */}
              <div className="space-y-2">
                {MOCK_DOCUMENTS.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleDoc(doc.id)}
                  >
                    <Checkbox
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={() => toggleDoc(doc.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.pages} pages • {doc.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateSummary}
                disabled={selectedDocs.length === 0 || isLoading}
                className="w-full mt-4 gap-2"
              >
                {isLoading ? (
                  <>
                    <Spinner className="size-4" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="size-4" />
                    Generate Summary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Summary Results */}
        <div className="flex-1 min-w-0">
          {!hasGenerated ? (
            <Card className="h-full flex flex-col items-center justify-center border-dashed">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">No summary generated yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select documents and click &quot;Generate Summary&quot; to
                    begin
                  </p>
                </div>
              </div>
            </Card>
          ) : summary ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{summary.title}</h2>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{summary.sentiment}</Badge>
                    <Badge variant="secondary">
                      {summary.statistics.total_documents} documents
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="key-points">Key Points</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                {/* Summary Tab */}
                <TabsContent value="summary" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Executive Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {summary.executive_summary}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Main Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {summary.main_topics.map((topic) => (
                          <Badge key={topic} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Key Points Tab */}
                <TabsContent value="key-points">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Key Points</CardTitle>
                      <CardDescription>
                        Essential takeaways from selected documents
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {summary.key_points.map((point, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-sm font-semibold text-primary shrink-0">
                              {idx + 1}.
                            </span>
                            <span className="text-sm leading-relaxed">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Insights Tab */}
                <TabsContent value="insights">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Document Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Total Documents
                          </p>
                          <p className="text-2xl font-bold">
                            {summary.statistics.total_documents}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Total Pages
                          </p>
                          <p className="text-2xl font-bold">
                            {summary.statistics.total_pages}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Reading Time
                          </p>
                          <p className="text-2xl font-bold">
                            {summary.statistics.reading_time} min
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

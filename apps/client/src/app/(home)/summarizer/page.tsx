'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import DocumentViewerPanel from '@/components/summarizer/DocumentViewerPanel';
import SummarizerNotePanel from '@/components/summarizer/SummarizerNotePanel';

interface Document {
  id: string;
  name: string;
  url: string;
  pages: number;
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'Q4 Financial Report.pdf',
    url: 'https://example.com/doc1.pdf',
    pages: 45,
  },
  {
    id: '2',
    name: 'Market Analysis 2024.pdf',
    url: 'https://example.com/doc2.pdf',
    pages: 32,
  },
  {
    id: '3',
    name: 'Product Roadmap.pdf',
    url: 'https://example.com/doc3.pdf',
    pages: 18,
  },
];

export default function SummarizerPage(
  {
    // params,
  }: {
    params: Promise<{ w_id: string }>;
  },
) {
  // const { w_id } = use(params);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(
    MOCK_DOCUMENTS[0],
  );
  const [noteTitle, setNoteTitle] = useState('');
  const [summaryType, setSummaryType] = useState('brief');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSummary = async () => {
    if (!selectedDoc) return;

    setIsLoading(true);
    // Simulate API call to AI service
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockSummary = `This document provides a comprehensive overview of ${selectedDoc.name}. Key findings include:
    
    • Strategic insights and recommendations for business growth
    • Market analysis and competitive positioning
    • Financial projections and performance metrics
    • Implementation roadmap and timeline
    • Risk assessment and mitigation strategies

    The content emphasizes data-driven decision-making and identifies key opportunities for optimization.`;

    setSummary(mockSummary);
    setIsLoading(false);
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !summary.trim()) return;

    console.log('[v0] Saving note:', {
      noteTitle,
      summary,
      documentId: selectedDoc?.id,
    });
    // TODO: Replace with actual API call to save note
    alert('Note saved successfully!');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h1 className="text-2xl font-bold">Document Summarizer</h1>
      </div>

      {/* Main Content - Resizable Panels */}
      <div className="flex-1 overflow-hidden px-4 py-4">
        <ResizablePanelGroup direction="horizontal" className="gap-4">
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="flex flex-col h-full gap-3">
              <div>
                <Select
                  value={selectedDoc?.id || ''}
                  onValueChange={(id) => {
                    const doc = MOCK_DOCUMENTS.find((d) => d.id === id);
                    setSelectedDoc(doc || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a document" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_DOCUMENTS.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDoc ? (
                <DocumentViewerPanel document={selectedDoc} />
              ) : (
                <Card className="flex-1 flex items-center justify-center border-dashed">
                  <div className="text-center">
                    <FileText className="size-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Select a document to view
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border" />

          <ResizablePanel defaultSize={50} minSize={20}>
            <SummarizerNotePanel
              noteTitle={noteTitle}
              setNoteTitle={setNoteTitle}
              summary={summary}
              setSummary={setSummary}
              summaryType={summaryType}
              setSummaryType={setSummaryType}
              isLoading={isLoading}
              onGenerateSummary={handleGenerateSummary}
              onSaveNote={handleSaveNote}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

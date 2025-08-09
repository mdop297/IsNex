'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import CommentForm from './CommentForm';
import ContextMenu, { type ContextMenuProps } from './ContextMenu';
import ExpandableTip from './ExpandableTip';
import HighlightContainer from './HighlightContainer';
import Toolbar from './Toolbar/Toolbar';
import {
  PdfLoader,
  PdfHighlighter,
  type GhostHighlight,
  type PdfHighlighterUtils,
  type PdfScaleValue,
  type Tip,
  type ViewportHighlight,
} from './react-pdf-highlighter';

import './style/App.css';
import type { CommentedHighlight } from './types';
import Sidebar from './Sidebar/Sidebar';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer.mjs';
// import { testHighlights as _testHighlights } from './utils/test-highlights';

// const TEST_HIGHLIGHTS = _testHighlights;
export const PRIMARY_PDF_URL = 'https://arxiv.org/pdf/2203.11115';
export const SECONDARY_PDF_URL = '/temp/428.pdf';

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
  return document.location.hash.slice('#highlight-'.length);
};

const resetHash = () => {
  document.location.hash = '';
};
interface PdfViewerProps {
  fileUrl: string;
}

const PdfViewer = ({ fileUrl }: PdfViewerProps) => {
  const [highlights, setHighlights] = useState<Array<CommentedHighlight>>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);
  const [pdfScaleValue, setPdfScaleValue] = useState<PdfScaleValue | undefined>(
    1,
  );
  const [highlightPen, setHighlightPen] = useState<boolean>(false);
  // Refs for PdfHighlighter utilities
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>(null);
  const pdfDocumentRef = useRef<PDFDocumentProxy>(null);
  const viewerRef = useRef<PDFViewer>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchTabOpen, setSearchTabOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleSearchBar = () => {
    setSearchTabOpen((prev) => !prev);
  };

  // Click listeners for context menu
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [contextMenu]);

  const handleContextMenu = (
    event: MouseEvent<HTMLDivElement>,
    highlight: ViewportHighlight<CommentedHighlight>,
  ) => {
    event.preventDefault();

    setContextMenu({
      xPos: event.clientX,
      yPos: event.clientY,
      deleteHighlight: () => deleteHighlight(highlight),
      editComment: () => editComment(highlight),
    });
  };

  const addHighlight = (highlight: GhostHighlight, comment: string) => {
    console.log('Saving highlight', highlight);
    setHighlights([{ ...highlight, comment, id: getNextId() }, ...highlights]);
  };

  const deleteHighlight = (highlight: ViewportHighlight | Highlight) => {
    console.log('Deleting highlight', highlight);
    if ('id' in highlight) {
      setHighlights(
        highlights.filter((h) => 'id' in h && h.id !== highlight.id),
      );
    }
  };

  const editHighlight = (
    idToUpdate: string,
    edit: Partial<CommentedHighlight>,
  ) => {
    console.log(`Editing highlight ${idToUpdate} with `, edit);
    setHighlights(
      highlights.map((highlight) =>
        highlight.id === idToUpdate ? { ...highlight, ...edit } : highlight,
      ),
    );
  };

  const resetHighlights = () => {
    setHighlights([]);
  };

  // Open comment tip and update highlight with new user input
  const editComment = (highlight: ViewportHighlight<CommentedHighlight>) => {
    if (!highlighterUtilsRef.current) return;

    const editCommentTip: Tip = {
      position: highlight.position,
      content: (
        <CommentForm
          placeHolder={highlight.comment}
          onSubmit={(input) => {
            editHighlight(highlight.id, { comment: input });
            highlighterUtilsRef.current!.setTip(null);
            highlighterUtilsRef.current!.toggleEditInProgress(false);
          }}
        ></CommentForm>
      ),
    };

    highlighterUtilsRef.current.setTip(editCommentTip);
    highlighterUtilsRef.current.toggleEditInProgress(true);
  };

  const handleNavigation = (pageNumber: number) => {
    if (highlighterUtilsRef.current) {
      const viewer = highlighterUtilsRef.current.getViewer();
      if (viewer) {
        viewer.scrollPageIntoView({ pageNumber });
      }
    }
  };

  const getHighlightById = useCallback(
    (id: string) => {
      return highlights.find((highlight) => highlight.id === id);
    },
    [highlights],
  );

  // Hash listeners for autoscrolling to highlights
  useEffect(() => {
    const scrollToHighlightFromHash = () => {
      const highlight = getHighlightById(parseIdFromHash());

      if (highlight && highlighterUtilsRef.current) {
        highlighterUtilsRef.current.scrollToHighlight(highlight);
      }
    };

    window.addEventListener('hashchange', scrollToHighlightFromHash);

    return () => {
      window.removeEventListener('hashchange', scrollToHighlightFromHash);
    };
  }, [getHighlightById]);

  return (
    <div className="App flex flex-col h-full">
      <PdfLoader document={fileUrl}>
        {(pdfDocument) => {
          pdfDocumentRef.current = pdfDocument;

          return (
            <>
              <Toolbar
                currentPage={currentPage}
                totalPages={pdfDocumentRef.current?.numPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  handleNavigation(page);
                }}
                isSidebarOpen={isSidebarOpen}
                searchTabOpen={searchTabOpen}
                toggleSearchBar={toggleSearchBar}
                toggleSidebar={toggleSidebar}
                setPdfScaleValue={(value) => setPdfScaleValue(value)}
                toggleHighlightPen={() => setHighlightPen(!highlightPen)}
              />
              <div className="flex overflow-hidden h-full">
                {isSidebarOpen && (
                  <Sidebar
                    pdfDocument={pdfDocumentRef.current}
                    viewerRef={viewerRef}
                    currentPage={currentPage}
                    highlights={highlights}
                    searchTabOpen={searchTabOpen}
                    resetHighlights={resetHighlights}
                    onNavigation={handleNavigation}
                  />
                )}

                <div className=" flex-1 relative ">
                  <PdfHighlighter
                    enableAreaSelection={(event) => event.altKey}
                    pdfDocument={pdfDocument}
                    onScrollAway={resetHash}
                    utilsRef={(_pdfHighlighterUtils) => {
                      highlighterUtilsRef.current = _pdfHighlighterUtils;
                      viewerRef.current =
                        highlighterUtilsRef.current.getViewer();
                    }}
                    pdfScaleValue={pdfScaleValue}
                    textSelectionColor={
                      highlightPen ? 'rgba(255, 226, 143, 1)' : undefined
                    }
                    onSelection={
                      highlightPen
                        ? (selection) =>
                            addHighlight(selection.makeGhostHighlight(), '')
                        : undefined
                    }
                    selectionTip={
                      highlightPen ? undefined : (
                        <ExpandableTip addHighlight={addHighlight} />
                      )
                    }
                    highlights={highlights}
                    setCurrentPage={setCurrentPage}
                  >
                    <HighlightContainer
                      editHighlight={editHighlight}
                      onContextMenu={handleContextMenu}
                    />
                  </PdfHighlighter>
                </div>
              </div>
            </>
          );
        }}
      </PdfLoader>
      {contextMenu && <ContextMenu {...contextMenu} />}
    </div>
  );
};

export default PdfViewer;

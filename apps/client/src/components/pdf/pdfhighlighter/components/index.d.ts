import type * as PDFJSLib from 'pdfjs-dist';

// Global augmentation
declare global {
  namespace globalThis {
    // eslint-disable-next-line no-var
    var pdfjsLib: typeof PDFJSLib | undefined;
  }
}

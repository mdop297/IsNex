import { Page } from '../types';

export const getDocument = (elm: HTMLElement | null): Document =>
  (elm || {}).ownerDocument || document;

export const getWindow = (elm: HTMLElement | Window | null): typeof window =>
  (getDocument(elm as HTMLElement) || {}).defaultView || window;

export const isHTMLElement = (elm: unknown): elm is HTMLElement =>
  elm instanceof HTMLElement ||
  elm instanceof getWindow(elm as HTMLElement).HTMLElement;

export const isHTMLCanvasElement = (elm: unknown): elm is HTMLCanvasElement =>
  elm instanceof HTMLCanvasElement ||
  elm instanceof getWindow(elm as HTMLElement).HTMLCanvasElement;

export const asElement = (x: unknown): HTMLElement => x as HTMLElement;

export const getPageFromElement = (target: HTMLElement): Page | null => {
  const node = asElement(target.closest('.page'));

  if (!node || !isHTMLElement(node)) {
    return null;
  }

  const number = Number(asElement(node).dataset.pageNumber);

  return { node, number } as Page;
};

export const getPagesFromRange = (range: Range): Page[] => {
  const startParentElement = range.startContainer.parentElement;
  const endParentElement = range.endContainer.parentElement;

  if (!isHTMLElement(startParentElement) || !isHTMLElement(endParentElement)) {
    return [];
  }

  const startPage = getPageFromElement(asElement(startParentElement));
  const endPage = getPageFromElement(asElement(endParentElement));

  if (!startPage?.number || !endPage?.number) {
    return [];
  }

  if (startPage.number === endPage.number) {
    return [startPage];
  }

  if (startPage.number === endPage.number - 1) {
    return [startPage, endPage];
  }

  const pages: Page[] = [];

  let currentPageNumber = startPage.number;

  const document = startPage.node.ownerDocument;

  while (currentPageNumber <= endPage.number) {
    const currentPage = getPageFromElement(
      document.querySelector(
        `[data-page-number='${currentPageNumber}']`,
      ) as HTMLElement,
    );
    if (currentPage) {
      pages.push(currentPage);
    }
    currentPageNumber++;
  }

  return pages;
};

export const findOrCreateContainerLayer = (
  container: HTMLElement,
  className: string,
) => {
  const doc = getDocument(container);
  let layer = container.querySelector(`.${className}`);

  // To ensure predictable zIndexing, wait until the pdfjs element has children.
  if (!layer && container.children.length) {
    layer = doc.createElement('div');
    layer.className = className;
    container.appendChild(layer);
  }

  return layer;
};

import { Page } from './types';

export class PageService {
  private constructor(
    private pages: Map<string, Page>,
    private childrenMap: Map<string, Page[]>,
  ) {}

  static async createFromPath(datapath: string): Promise<PageService> {
    // Fetch data từ path
    const response = await fetch(datapath);
    const jsonData = await response.json();

    // Tạo Map từ data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedPages = Object.values(jsonData.pages).map((page: any) => ({
      id: page.id,
      title: page.title,
      parentId: page.parentId,
      isExpanded: page.isExpanded,
      icon: page.emoji,
      position: page.position,
      hasChildren: page.hasChildren,
    }));

    // Tạo Map từ transformed data (dùng id làm key)
    const pages = new Map<string, Page>(
      transformedPages.map((page) => [page.id, page]),
    );
    const childrenMap = PageService.buildChildrenMap(pages);

    return new PageService(pages, childrenMap);
  }

  private static buildChildrenMap(
    pages: Map<string, Page>,
  ): Map<string, Page[]> {
    const childrenMap = new Map<string, Page[]>();

    for (const page of pages.values()) {
      const parentId = page.parentId || 'root';

      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }

      childrenMap.get(parentId)!.push(page);
    }

    // Sort children theo position
    for (const children of childrenMap.values()) {
      children.sort((a, b) => a.position - b.position);
    }

    return childrenMap;
  }

  getPagesByParentId(parentId = 'root') {
    return this.childrenMap.get(parentId) || [];
  }
}

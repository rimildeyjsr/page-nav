export interface Page {
  id: string;
  name: string;
}

export interface PageNavigationState {
  pages: Page[];
  activePageId: string | null;
  focusedPageId: string | null;
  hoveredPageId: string | null;
  dragState: {
    isDragging: boolean;
    draggedPageId: string | null;
    overId: string | null;
  };
  contextMenu: {
    isOpen: boolean;
    pageId: string | null;
    position: { x: number; y: number };
  };
  editingPageId: string | null;
  hoverState: {
    hoveredGap: number | null;
  };
}

export const PAGE_NAVIGATION_ACTIONS = {
  SELECT_PAGE: "SELECT_PAGE",
  ADD_PAGE: "ADD_PAGE",
  RENAME_PAGE: "RENAME_PAGE",
  REORDER_PAGES: "REORDER_PAGES",
  START_DRAG: "START_DRAG",
  END_DRAG: "END_DRAG",
  OPEN_CONTEXT_MENU: "OPEN_CONTEXT_MENU",
  CLOSE_CONTEXT_MENU: "CLOSE_CONTEXT_MENU",
  START_EDITING: "START_EDITING",
  STOP_EDITING: "STOP_EDITING",
  SET_HOVER_GAP: "SET_HOVER_GAP",
  SET_FOCUSED_PAGE: "SET_FOCUSED_PAGE",
  SET_HOVERED_PAGE: "SET_HOVERED_PAGE",
} as const;

export type PageNavigationAction =
  | { type: typeof PAGE_NAVIGATION_ACTIONS.SELECT_PAGE; pageId: string }
  | {
      type: typeof PAGE_NAVIGATION_ACTIONS.ADD_PAGE;
      afterIndex: number;
      page?: Partial<Page>;
    }
  | {
      type: typeof PAGE_NAVIGATION_ACTIONS.RENAME_PAGE;
      pageId: string;
      name: string;
    }
  | {
      type: typeof PAGE_NAVIGATION_ACTIONS.REORDER_PAGES;
      fromIndex: number;
      toIndex: number;
    }
  | { type: typeof PAGE_NAVIGATION_ACTIONS.START_DRAG; pageId: string }
  | { type: typeof PAGE_NAVIGATION_ACTIONS.END_DRAG }
  | {
      type: typeof PAGE_NAVIGATION_ACTIONS.OPEN_CONTEXT_MENU;
      pageId: string;
      position: { x: number; y: number };
    }
  | { type: typeof PAGE_NAVIGATION_ACTIONS.CLOSE_CONTEXT_MENU }
  | { type: typeof PAGE_NAVIGATION_ACTIONS.START_EDITING; pageId: string }
  | { type: typeof PAGE_NAVIGATION_ACTIONS.STOP_EDITING }
  | {
      type: typeof PAGE_NAVIGATION_ACTIONS.SET_HOVER_GAP;
      gapIndex: number | null;
    }
  | {
      type: typeof PAGE_NAVIGATION_ACTIONS.SET_FOCUSED_PAGE;
      pageId: string | null;
    }
  | {
      type: typeof PAGE_NAVIGATION_ACTIONS.SET_HOVERED_PAGE;
      pageId: string | null;
    };

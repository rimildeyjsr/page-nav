import {
  PageNavigationState,
  PageNavigationAction,
  Page,
  PAGE_NAVIGATION_ACTIONS,
} from "./types";

export const pageNavigationReducer = (
  state: PageNavigationState,
  action: PageNavigationAction,
): PageNavigationState => {
  switch (action.type) {
    case PAGE_NAVIGATION_ACTIONS.SELECT_PAGE:
      return {
        ...state,
        activePageId: action.pageId,
      };

    case PAGE_NAVIGATION_ACTIONS.ADD_PAGE: {
      const newPage: Page = {
        id: `page-${Date.now()}`,
        name: action.page?.name || "New Page",
      };
      const newPages = [...state.pages];
      newPages.splice(action.afterIndex + 1, 0, newPage);

      return {
        ...state,
        pages: newPages,
        activePageId: newPage.id,
        editingPageId: newPage.id, // Start editing immediately
      };
    }

    case PAGE_NAVIGATION_ACTIONS.RENAME_PAGE:
      return {
        ...state,
        pages: state.pages.map((page) =>
          page.id === action.pageId ? { ...page, name: action.name } : page,
        ),
        editingPageId: null,
      };

    case PAGE_NAVIGATION_ACTIONS.REORDER_PAGES: {
      const newPages = [...state.pages];
      const [movedPage] = newPages.splice(action.fromIndex, 1);
      newPages.splice(action.toIndex, 0, movedPage);

      return {
        ...state,
        pages: newPages,
      };
    }

    case PAGE_NAVIGATION_ACTIONS.SET_FOCUSED_PAGE:
      return {
        ...state,
        focusedPageId: action.pageId,
      };

    case PAGE_NAVIGATION_ACTIONS.SET_HOVERED_PAGE:
      return {
        ...state,
        hoveredPageId: action.pageId,
      };

    case PAGE_NAVIGATION_ACTIONS.OPEN_CONTEXT_MENU:
      return {
        ...state,
        contextMenu: {
          isOpen: true,
          pageId: action.pageId,
          position: action.position,
        },
      };

    case PAGE_NAVIGATION_ACTIONS.CLOSE_CONTEXT_MENU:
      return {
        ...state,
        contextMenu: {
          isOpen: false,
          pageId: null,
          position: { x: 0, y: 0 },
        },
      };

    case PAGE_NAVIGATION_ACTIONS.START_EDITING:
      return {
        ...state,
        editingPageId: action.pageId,
      };

    case PAGE_NAVIGATION_ACTIONS.STOP_EDITING:
      return {
        ...state,
        editingPageId: null,
      };

    case PAGE_NAVIGATION_ACTIONS.SET_HOVER_GAP:
      return {
        ...state,
        hoverState: {
          hoveredGap: action.gapIndex,
        },
      };

    case PAGE_NAVIGATION_ACTIONS.START_DRAG:
      return {
        ...state,
        dragState: {
          isDragging: true,
          draggedPageId: action.pageId,
          overId: null,
        },
      };

    case PAGE_NAVIGATION_ACTIONS.END_DRAG:
      return {
        ...state,
        dragState: {
          isDragging: false,
          draggedPageId: null,
          overId: null,
        },
      };

    default:
      return state;
  }
};

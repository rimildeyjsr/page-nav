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

export type PageNavigationAction =
  | { type: "SELECT_PAGE"; pageId: string }
  | { type: "ADD_PAGE"; afterIndex: number }
  | { type: "RENAME_PAGE"; pageId: string; name: string }
  | { type: "REORDER_PAGES"; fromIndex: number; toIndex: number }
  | { type: "START_DRAG"; pageId: string }
  | { type: "END_DRAG" }
  | {
      type: "OPEN_CONTEXT_MENU";
      pageId: string;
      position: { x: number; y: number };
    }
  | { type: "CLOSE_CONTEXT_MENU" }
  | { type: "START_EDITING"; pageId: string }
  | { type: "STOP_EDITING" }
  | { type: "SET_HOVER_GAP"; gapIndex: number | null }
  | { type: "SET_FOCUSED_PAGE"; pageId: string | null }
  | { type: "SET_HOVERED_PAGE"; pageId: string | null };

export interface PageTabProps {
  page: Page;
  isActive: boolean;
  isFocused: boolean;
  isHovered: boolean;
  showThreeDots: boolean;
  onSelect: (pageId: string) => void;
  onContextMenu: (pageId: string, position: { x: number; y: number }) => void;
  onFocus: (pageId: string | null) => void;
  onHover: (pageId: string | null) => void;
}

export interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

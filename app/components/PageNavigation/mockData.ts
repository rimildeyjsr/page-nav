import { Page } from "./types";

export const mockPages: Page[] = [
  { id: "1", name: "Info" },
  { id: "2", name: "Details" },
  { id: "3", name: "Other" },
  { id: "4", name: "Ending" },
];

export const mockInitialState = {
  pages: mockPages,
  activePageId: "1",
  focusedPageId: null,
  hoveredPageId: null,
  dragState: {
    isDragging: false,
    draggedPageId: null,
    overId: null,
  },
  contextMenu: {
    isOpen: false,
    pageId: null,
    position: { x: 0, y: 0 },
  },
  editingPageId: null,
  hoverState: {
    hoveredGap: null,
  },
};

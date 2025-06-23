"use client";

import {
  useReducer,
  Fragment,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { PageTab } from "@/components/PageNavigation/PageTab";
import { Divider } from "@/components/PageNavigation/Divider";
import { AddPageButton } from "@/components/PageNavigation/AddPageButton";
import { ContextMenu } from "@/components/PageNavigation/ContextMenu";
import { DragOverlay } from "@/components/PageNavigation/DragOverlay";
import { pageNavigationReducer } from "@/components/PageNavigation/pageNavigationReducer";
import { mockInitialState } from "@/components/PageNavigation/mockData";
import { PAGE_NAVIGATION_ACTIONS } from "@/components/PageNavigation/types";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay as DndDragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

export const PageNavigationContainer = () => {
  const [state, dispatch] = useReducer(pageNavigationReducer, mockInitialState);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  });

  const keyboardSensor = useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  });

  const sensors = useSensors(pointerSensor, keyboardSensor);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleArrowNavigation = useCallback(
    (direction: "left" | "right") => {
      const currentIndex = state.focusedPageId
        ? state.pages.findIndex((page) => page.id === state.focusedPageId)
        : state.pages.findIndex((page) => page.id === state.activePageId);

      let newIndex: number;

      if (direction === "left") {
        newIndex = currentIndex > 0 ? currentIndex - 1 : state.pages.length - 1;
      } else {
        newIndex = currentIndex < state.pages.length - 1 ? currentIndex + 1 : 0;
      }

      const newPageId = state.pages[newIndex]?.id;
      if (newPageId) {
        dispatch({
          type: PAGE_NAVIGATION_ACTIONS.SET_FOCUSED_PAGE,
          pageId: newPageId,
        });
      }
    },
    [state.activePageId, state.focusedPageId, state.pages],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) {
        return;
      }

      if (state.dragState.isDragging && !["Escape"].includes(event.key)) {
        return;
      }

      if (state.editingPageId && event.key !== "Escape") {
        return;
      }

      if (state.contextMenu.isOpen && event.key !== "Escape") {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handleArrowNavigation("left");
          break;

        case "ArrowRight":
          event.preventDefault();
          handleArrowNavigation("right");
          break;

        case "Enter":
          event.preventDefault();
          if (state.focusedPageId && !state.editingPageId) {
            if (event.metaKey || event.ctrlKey) {
              dispatch({
                type: PAGE_NAVIGATION_ACTIONS.START_EDITING,
                pageId: state.focusedPageId,
              });
            } else {
              handleSelectPage(state.focusedPageId);
            }
          }
          break;

        case " ":
          event.preventDefault();
          if (state.focusedPageId && !state.editingPageId) {
            handleSelectPage(state.focusedPageId);
          }
          break;

        case "F2":
          event.preventDefault();
          if (state.focusedPageId && !state.editingPageId) {
            dispatch({
              type: PAGE_NAVIGATION_ACTIONS.START_EDITING,
              pageId: state.focusedPageId,
            });
          }
          break;

        case "Escape":
          event.preventDefault();
          if (state.editingPageId) {
            handleCancelEdit();
          } else if (state.contextMenu.isOpen) {
            handleCloseContextMenu();
          } else if (state.dragState.isDragging) {
            dispatch({ type: PAGE_NAVIGATION_ACTIONS.END_DRAG });
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    state.focusedPageId,
    state.editingPageId,
    state.contextMenu.isOpen,
    state.dragState.isDragging,
    handleArrowNavigation,
  ]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    dispatch({
      type: PAGE_NAVIGATION_ACTIONS.START_DRAG,
      pageId: active.id as string,
    });

    if (state.contextMenu.isOpen) {
      handleCloseContextMenu();
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    dispatch({ type: PAGE_NAVIGATION_ACTIONS.END_DRAG });

    if (over && active.id !== over.id) {
      const fromIndex = state.pages.findIndex((page) => page.id === active.id);
      const toIndex = state.pages.findIndex((page) => page.id === over.id);

      if (fromIndex !== -1 && toIndex !== -1) {
        dispatch({
          type: PAGE_NAVIGATION_ACTIONS.REORDER_PAGES,
          fromIndex,
          toIndex,
        });
      }
    }
  };

  const handleSelectPage = (pageId: string) => {
    dispatch({ type: PAGE_NAVIGATION_ACTIONS.SELECT_PAGE, pageId });
  };

  const handleContextMenu = (
    pageId: string,
    position: { x: number; y: number },
  ) => {
    dispatch({
      type: PAGE_NAVIGATION_ACTIONS.OPEN_CONTEXT_MENU,
      pageId,
      position,
    });
  };

  const handleFocus = (pageId: string | null) => {
    dispatch({ type: PAGE_NAVIGATION_ACTIONS.SET_FOCUSED_PAGE, pageId });
  };

  const handleHover = (pageId: string | null) => {
    dispatch({ type: PAGE_NAVIGATION_ACTIONS.SET_HOVERED_PAGE, pageId });
  };

  const handleAddPage = () => {
    dispatch({
      type: PAGE_NAVIGATION_ACTIONS.ADD_PAGE,
      afterIndex: state.pages.length - 1,
    });
  };

  const handleSave = (pageId: string, name: string) => {
    dispatch({
      type: PAGE_NAVIGATION_ACTIONS.RENAME_PAGE,
      pageId,
      name,
    });
  };

  const handleCancelEdit = () => {
    dispatch({ type: PAGE_NAVIGATION_ACTIONS.STOP_EDITING });
  };

  const handleCloseContextMenu = () => {
    dispatch({ type: PAGE_NAVIGATION_ACTIONS.CLOSE_CONTEXT_MENU });
  };

  const handleRename = () => {
    if (state.contextMenu.pageId) {
      dispatch({
        type: PAGE_NAVIGATION_ACTIONS.START_EDITING,
        pageId: state.contextMenu.pageId,
      });
      handleCloseContextMenu();
    }
    console.log("Rename clicked for page:", state.contextMenu.pageId);
  };

  const handleDuplicate = () => {
    if (state.contextMenu.pageId) {
      const pageIndex = state.pages.findIndex(
        (p) => p.id === state.contextMenu.pageId,
      );
      if (pageIndex !== -1) {
        const originalPage = state.pages[pageIndex];
        dispatch({
          type: PAGE_NAVIGATION_ACTIONS.ADD_PAGE,
          afterIndex: pageIndex,
          page: { name: `${originalPage.name} Copy` },
        });
      }
      handleCloseContextMenu();
    }
    console.log("Duplicate clicked for page:", state.contextMenu.pageId);
  };

  const handleDelete = () => {
    handleCloseContextMenu();
    console.log("Delete clicked for page:", state.contextMenu.pageId);
  };

  const handleStartEdit = (pageId: string) => {
    dispatch({ type: PAGE_NAVIGATION_ACTIONS.START_EDITING, pageId });
  };

  const handleHoverGap = (gapIndex: number | null) => {
    dispatch({ type: PAGE_NAVIGATION_ACTIONS.SET_HOVER_GAP, gapIndex });
  };

  const handleAddPageAtGap = (afterIndex: number) => {
    dispatch({
      type: PAGE_NAVIGATION_ACTIONS.ADD_PAGE,
      afterIndex,
    });
  };

  const draggedPage = state.dragState.draggedPageId
    ? state.pages.find((p) => p.id === state.dragState.draggedPageId)
    : null;

  const renderContent = () => (
    <div
      className="grid items-center gap-0"
      style={{
        gridTemplateColumns: `repeat(${state.pages.length}, max-content 40px) max-content`,
      }}
    >
      {state.pages.map((page, index) => (
        <Fragment key={page.id}>
          <PageTab
            page={page}
            isActive={state.activePageId === page.id}
            isFocused={state.focusedPageId === page.id}
            isHovered={state.hoveredPageId === page.id}
            showThreeDots={state.activePageId === page.id}
            isEditing={state.editingPageId === page.id}
            isDragging={isClient && state.dragState.draggedPageId === page.id}
            onSelect={handleSelectPage}
            onContextMenu={handleContextMenu}
            onFocus={handleFocus}
            onHover={handleHover}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            onStartEdit={handleStartEdit}
          />

          <Divider
            gapIndex={index}
            isHovered={state.hoverState.hoveredGap === index}
            onHoverChange={handleHoverGap}
            onAddPage={handleAddPageAtGap}
            showHoverButton={index < state.pages.length - 1}
          />
        </Fragment>
      ))}

      <AddPageButton onClick={handleAddPage} />
    </div>
  );

  if (!isClient) {
    return (
      <div
        ref={containerRef}
        className="flex items-center p-4"
        tabIndex={-1}
        role="tablist"
        aria-label="Page navigation"
      >
        {renderContent()}

        <ContextMenu
          isOpen={state.contextMenu.isOpen}
          position={state.contextMenu.position}
          onCloseAction={handleCloseContextMenu}
          onRenameAction={handleRename}
          onDuplicateAction={handleDuplicate}
          onDeleteAction={handleDelete}
        />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={containerRef}
        className="flex items-center p-4"
        tabIndex={-1}
        role="tablist"
        aria-label="Page navigation"
      >
        <SortableContext
          items={state.pages.map((p) => p.id)}
          strategy={horizontalListSortingStrategy}
        >
          {renderContent()}
        </SortableContext>

        <DndDragOverlay>
          {draggedPage && <DragOverlay page={draggedPage} />}
        </DndDragOverlay>

        <ContextMenu
          isOpen={state.contextMenu.isOpen}
          position={state.contextMenu.position}
          onCloseAction={handleCloseContextMenu}
          onRenameAction={handleRename}
          onDuplicateAction={handleDuplicate}
          onDeleteAction={handleDelete}
        />
      </div>
    </DndContext>
  );
};

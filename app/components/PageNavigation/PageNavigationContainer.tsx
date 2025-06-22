"use client";

import { useReducer, Fragment } from "react";
import { PageTab } from "@/components/PageNavigation/PageTab";
import { Divider } from "@/components/PageNavigation/Divider";
import { AddPageButton } from "@/components/PageNavigation/AddPageButton";
import { ContextMenu } from "@/components/PageNavigation/ContextMenu";
import { pageNavigationReducer } from "@/components/PageNavigation/pageNavigationReducer";
import { mockInitialState } from "@/components/PageNavigation/mockData";
import { PAGE_NAVIGATION_ACTIONS } from "@/components/PageNavigation/types";

export const PageNavigationContainer = () => {
  const [state, dispatch] = useReducer(pageNavigationReducer, mockInitialState);

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
    console.log("Rename clicked for page:", state.contextMenu.pageId);
  };

  const handleDuplicate = () => {
    console.log("Duplicate clicked for page:", state.contextMenu.pageId);
  };

  const handleDelete = () => {
    console.log("Delete clicked for page:", state.contextMenu.pageId);
  };

  return (
    <div className="flex items-center p-4">
      <div
        className="grid items-center gap-0"
        style={{
          gridTemplateColumns: `repeat(${state.pages.length}, max-content 40px) max-content`,
        }}
      >
        {state.pages.map((page) => (
          <Fragment key={page.id}>
            <PageTab
              page={page}
              isActive={state.activePageId === page.id}
              isFocused={state.focusedPageId === page.id}
              isHovered={state.hoveredPageId === page.id}
              showThreeDots={state.activePageId === page.id}
              isEditing={state.editingPageId === page.id}
              onSelect={handleSelectPage}
              onContextMenu={handleContextMenu}
              onFocus={handleFocus}
              onHover={handleHover}
              onSave={handleSave}
              onCancel={handleCancelEdit}
            />

            <Divider />
          </Fragment>
        ))}

        <AddPageButton onClick={handleAddPage} />
      </div>

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
};

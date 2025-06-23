import { Page } from "@/components/PageNavigation/types";
import { DocumentIcon } from "@/components/PageNavigation/icons/DocumentIcon";
import { ThreeDotsIcon } from "@/components/PageNavigation/icons/ThreeDots";
import { EditablePageName } from "@/components/PageNavigation/EditablePageName";
import { useEffect, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface PageTabProps {
  page: Page;
  isActive: boolean;
  isFocused: boolean;
  isHovered: boolean;
  showThreeDots: boolean;
  isEditing: boolean;
  isDragging?: boolean;
  onSelect: (pageId: string) => void;
  onContextMenu: (pageId: string, position: { x: number; y: number }) => void;
  onFocus: (pageId: string | null) => void;
  onHover: (pageId: string | null) => void;
  onSave: (pageId: string, name: string) => void;
  onCancel: () => void;
  onStartEdit: (pageId: string) => void;
}

export const PageTab = ({
  page,
  isActive,
  isFocused,
  isHovered,
  showThreeDots,
  isEditing,
  onSelect,
  onContextMenu,
  onFocus,
  onHover,
  onSave,
  onCancel,
  onStartEdit,
}: PageTabProps) => {
  const tabRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: page.id,
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (isFocused && tabRef.current && !isEditing) {
      tabRef.current.focus();
    }
  }, [isFocused, isEditing]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    onContextMenu(page.id, { x: rect.left, y: rect.top - 16 });
  };

  const handleRightClick = (e: React.MouseEvent) => {
    if (e.button === 2) {
      e.preventDefault();

      const rect = e.currentTarget.getBoundingClientRect();
      onContextMenu(page.id, { x: rect.left, y: rect.top });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      (e.key === "F2" || (e.key === "Enter" && (e.metaKey || e.ctrlKey))) &&
      isFocused &&
      !isEditing
    ) {
      e.preventDefault();
      onStartEdit(page.id);
      return;
    }

    if (
      e.key === "ContextMenu" ||
      (e.key === "F10" && e.shiftKey) ||
      (e.key === " " && e.ctrlKey)
    ) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      onContextMenu(page.id, {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height,
      });
      return;
    }
  };

  const handleClick = () => {
    if (!isEditing) {
      onSelect(page.id);
      onFocus(page.id);
    }
  };

  const handleThreeDotsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleContextMenu(e);
  };

  const handleThreeDotsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      onContextMenu(page.id, { x: rect.left, y: rect.top - 16 });
    }
  };

  const combinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    if (node) {
      tabRef.current = node;
    }
  };

  const getTabStyles = () => {
    if (isActive) {
      return "bg-white text-[#1A1A1A] border-[#e1e1e1]";
    }
    if (isHovered) {
      return "bg-[#9DA4B2]/35 text-[#677289] border-[#9DA4B2]/35";
    }
    return "bg-[#9DA4B2]/15 text-[#677289] border-[#9DA4B2]/15";
  };

  const combinedAttributes = isEditing
    ? {
        role: "tab",
        "aria-selected": isActive,
        "aria-label": `Page: ${page.name}`,
        tabIndex: isFocused ? 0 : -1,
      }
    : {
        ...attributes,
        role: "tab",
        "aria-selected": isActive,
        "aria-label": `Page: ${page.name}`,
        tabIndex: isFocused ? 0 : -1,
      };

  const combinedListeners = isEditing ? {} : listeners;

  return (
    <div
      ref={combinedRef}
      style={style}
      className={`
        flex items-center w-fit h-[32px] px-[10px] py-[4px] rounded-md cursor-pointer border
        transition-all duration-200 ease-in-out
        ${getTabStyles()}
        ${isFocused ? "ring-2 ring-[#2F72E2] ring-opacity-50" : ""}
        ${isSortableDragging ? "shadow-lg rotate-3 scale-105" : ""}
        focus:outline-none focus:ring-2 focus:ring-[#2F72E2] focus:ring-opacity-50
      `}
      {...combinedAttributes}
      {...combinedListeners}
      onClick={handleClick}
      onMouseDown={handleRightClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onFocus={() => onFocus(page.id)}
      onBlur={() => onFocus(null)}
      onMouseEnter={() => onHover(page.id)}
      onMouseLeave={() => onHover(null)}
    >
      <DocumentIcon
        isActive={isActive}
        className={`flex-shrink-0 w-[19px] h-[19px] ${isActive ? "text-[#F59D0E]" : ""}`}
      />

      {isEditing ? (
        <EditablePageName
          initialName={page.name}
          onSaveAction={(name) => onSave(page.id, name)}
          onCancelAction={onCancel}
          className="ml-[6px]"
        />
      ) : (
        <span className="ml-[6px] text-sm font-medium whitespace-nowrap select-none">
          {page.name}
        </span>
      )}

      {showThreeDots && !isEditing && (
        <button
          className="ml-[8px] w-[16px] h-[16px] flex items-center justify-center hover:bg-gray-200 hover:bg-opacity-20 rounded transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-[#2F72E2]"
          onClick={handleThreeDotsClick}
          onKeyDown={handleThreeDotsKeyDown}
          aria-label={`More options for ${page.name}`}
          tabIndex={-1}
        >
          <ThreeDotsIcon className="w-[16px] h-[16px] flex-shrink-0" />
        </button>
      )}
    </div>
  );
};

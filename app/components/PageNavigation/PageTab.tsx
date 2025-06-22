import { Page } from "@/components/PageNavigation/types";
import { DocumentIcon } from "@/components/PageNavigation/icons/DocumentIcon";
import { ThreeDotsIcon } from "@/components/PageNavigation/icons/ThreeDots";
import { EditablePageName } from "@/components/PageNavigation/EditablePageName";

export interface PageTabProps {
  page: Page;
  isActive: boolean;
  isFocused: boolean;
  isHovered: boolean;
  showThreeDots: boolean;
  isEditing: boolean;
  onSelect: (pageId: string) => void;
  onContextMenu: (pageId: string, position: { x: number; y: number }) => void;
  onFocus: (pageId: string | null) => void;
  onHover: (pageId: string | null) => void;
  onSave: (pageId: string, name: string) => void;
  onCancel: () => void;
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
}: PageTabProps) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    console.log("** right click");
    e.preventDefault();

    // Get the tab element's position
    const rect = e.currentTarget.getBoundingClientRect();
    onContextMenu(page.id, { x: rect.left, y: rect.top - 16 });
  };

  const handleRightClick = (e: React.MouseEvent) => {
    if (e.button === 2) {
      e.preventDefault();

      const rect = e.currentTarget.getBoundingClientRect();

      onContextMenu(page.id, {
        x: rect.left,
        y: rect.top,
      });
    }
  };

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer border border-gray-200
        transition-all duration-200 ease-in-out
        ${
          isActive
            ? "bg-white text-black"
            : isHovered
              ? "bg-gray-400 text-gray-700"
              : "bg-gray-100 text-gray-600"
        }
        ${isFocused ? "ring-2 ring-blue-500 ring-opacity-50" : ""}
      `}
      onClick={() => !isEditing && onSelect(page.id)}
      onMouseDown={handleRightClick}
      onContextMenu={handleContextMenu}
      onFocus={() => onFocus(page.id)}
      onBlur={() => onFocus(null)}
      onMouseEnter={() => onHover(page.id)}
      onMouseLeave={() => onHover(null)}
      tabIndex={0}
    >
      <DocumentIcon isActive={isActive} className="w-4 h-4 flex-shrink-0" />

      {isEditing ? (
        <EditablePageName
          initialName={page.name}
          onSaveAction={(name) => onSave(page.id, name)}
          onCancelAction={onCancel}
        />
      ) : (
        <span className="text-sm font-medium whitespace-nowrap">
          {page.name}
        </span>
      )}

      {showThreeDots && !isEditing && (
        <button
          className="ml-1 p-0.5 rounded transition-colors duration-150"
          onClick={(e) => {
            e.stopPropagation();
            handleContextMenu(e);
          }}
        >
          <ThreeDotsIcon className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

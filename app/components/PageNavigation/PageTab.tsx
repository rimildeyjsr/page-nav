import { PageTabProps } from "@/components/PageNavigation/types";
import { DocumentIcon } from "@/components/PageNavigation/icons/DocumentIcon";
import { ThreeDotsIcon } from "@/components/PageNavigation/icons/ThreeDots";

export const PageTab = ({
  page,
  isActive,
  isFocused,
  showThreeDots,
  onSelect,
  onContextMenu,
  onFocus,
  onHover,
}: PageTabProps) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(page.id, { x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-10 rounded-lg cursor-pointer
        transition-colors duration-200
        ${isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"}
        ${isFocused ? "ring-2 ring-blue-500 ring-opacity-50" : ""}
      `}
      onClick={() => onSelect(page.id)}
      onContextMenu={handleContextMenu}
      onFocus={() => onFocus(page.id)}
      onBlur={() => onFocus(null)}
      onMouseEnter={() => onHover(page.id)}
      onMouseLeave={() => onHover(null)}
      tabIndex={0}
    >
      <DocumentIcon isActive={isActive} />
      <span
        className={`text-sm ${isActive ? "text-blue-900" : "text-gray-700"}`}
      >
        {page.name}
      </span>
      {showThreeDots && (
        <button
          className="ml-2 p-1 hover:bg-gray-200 rounded"
          onClick={(e) => {
            e.stopPropagation();
            handleContextMenu(e);
          }}
        >
          <ThreeDotsIcon />
        </button>
      )}
    </div>
  );
};

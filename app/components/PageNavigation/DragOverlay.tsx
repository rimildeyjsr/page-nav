import { Page } from "@/components/PageNavigation/types";
import { DocumentIcon } from "@/components/PageNavigation/icons/DocumentIcon";

interface DragOverlayProps {
  page: Page;
}

export const DragOverlay = ({ page }: DragOverlayProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-white text-black shadow-lg opacity-95 transform rotate-3 scale-105">
      <DocumentIcon isActive={true} className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium whitespace-nowrap">{page.name}</span>
    </div>
  );
};

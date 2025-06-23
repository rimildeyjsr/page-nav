"use client";

import { useEffect, useRef } from "react";
import { RenameIcon } from "@/components/PageNavigation/icons/RenameIcon";
import { DuplicateIcon } from "@/components/PageNavigation/icons/DuplicateIcon";
import { DeleteIcon } from "@/components/PageNavigation/icons/DeleteIcon";

export interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onCloseAction: () => void;
  onRenameAction: () => void;
  onDuplicateAction: () => void;
  onDeleteAction: () => void;
}

export const ContextMenu = ({
  isOpen,
  position,
  onCloseAction,
  onRenameAction,
  onDuplicateAction,
  onDeleteAction,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onCloseAction();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onCloseAction]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseAction();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onCloseAction]);

  if (!isOpen) return null;

  const handleRename = () => {
    onRenameAction();
    onCloseAction();
  };

  const handleDuplicate = () => {
    onDuplicateAction();
    onCloseAction();
  };

  const handleDelete = () => {
    onDeleteAction();
    onCloseAction();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-[#e1e1e1] rounded-lg shadow-lg overflow-hidden min-w-48"
      style={{
        left: position.x,
        top: position.y - 8,
        transform: "translateY(-100%)",
      }}
    >
      <div className="px-[12px] py-[12px] bg-[#fafbfc] rounded-t-lg">
        <h3 className="text-[16px] font-medium text-[#1a1a1a]">Settings</h3>
      </div>

      <div className="px-[12px] pt-[14px] pb-[14px]">
        <button
          onClick={handleRename}
          className="w-full flex items-center px-0 py-0 text-[14px] text-[#1a1a1a] hover:bg-gray-50 transition-colors"
          style={{ gap: "6px" }}
        >
          <RenameIcon className="w-[16px] h-[16px] text-gray-600" />
          Rename
        </button>

        <div style={{ height: "14px" }} />

        <button
          onClick={handleDuplicate}
          className="w-full flex items-center px-0 py-0 text-[14px] text-[#1a1a1a] hover:bg-gray-50 transition-colors"
          style={{ gap: "6px" }}
        >
          <DuplicateIcon className="w-[16px] h-[16px] text-gray-600" />
          Duplicate
        </button>

        <div
          className="border-t border-[#e1e1e1]"
          style={{ margin: "14px 0" }}
        />

        <button
          onClick={handleDelete}
          className="w-full flex items-center px-0 py-0 text-[14px] text-[#EF494F] hover:bg-red-50 transition-colors"
          style={{ gap: "6px" }}
        >
          <DeleteIcon className="w-[16px] h-[16px] text-[#EF494F]" />
          Delete
        </button>
      </div>
    </div>
  );
};

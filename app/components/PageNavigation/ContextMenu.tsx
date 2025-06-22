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

  // Close on outside click
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

  // Close on Escape key
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
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-48"
      style={{
        left: position.x,
        top: position.y - 8,
        transform: "translateY(-100%)",
      }}
    >
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-black">Settings</h3>
      </div>

      <button
        onClick={handleRename}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
      >
        <RenameIcon className="w-4 h-4 text-gray-600" />
        Rename
      </button>

      <button
        onClick={handleDuplicate}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
      >
        <DuplicateIcon className="w-4 h-4 text-gray-600" />
        Duplicate
      </button>

      <div className="border-t border-gray-200 my-1" />

      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <DeleteIcon className="w-4 h-4 text-red-600" />
        Delete
      </button>
    </div>
  );
};

"use client";

import { useState, useEffect, useRef } from "react";

interface EditablePageNameProps {
  initialName: string;
  onSaveAction: (name: string) => void;
  onCancelAction: () => void;
}

export const EditablePageName = ({
  initialName,
  onSaveAction,
  onCancelAction,
}: EditablePageNameProps) => {
  const [value, setValue] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancelAction();
    }
  };

  const handleSave = () => {
    const trimmedValue = value.trim();
    if (trimmedValue && trimmedValue !== initialName) {
      onSaveAction(trimmedValue);
    } else if (!trimmedValue) {
      onSaveAction(initialName);
    } else {
      onCancelAction();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="text-sm bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
      style={{ minWidth: "60px", width: `${Math.max(value.length * 8, 60)}px` }}
    />
  );
};

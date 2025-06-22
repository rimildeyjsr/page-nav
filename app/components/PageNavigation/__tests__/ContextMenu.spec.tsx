import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ContextMenu } from "@/components/PageNavigation/ContextMenu";

const mockProps = {
  isOpen: true,
  position: { x: 100, y: 200 },
  onCloseAction: vi.fn(),
  onRenameAction: vi.fn(),
  onDuplicateAction: vi.fn(),
  onDeleteAction: vi.fn(),
};

describe("ContextMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should not render when isOpen is false", () => {
      render(<ContextMenu {...mockProps} isOpen={false} />);
      expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
      render(<ContextMenu {...mockProps} />);
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Rename")).toBeInTheDocument();
      expect(screen.getByText("Duplicate")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("should render with correct positioning classes", () => {
      const { container } = render(<ContextMenu {...mockProps} />);

      const menu = container.querySelector(".fixed");

      expect(menu).toHaveClass(
        "fixed",
        "z-50",
        "bg-white",
        "border",
        "rounded-lg",
      );
      expect(menu).toBeInTheDocument();

      const styleAttr = menu?.getAttribute("style");
      expect(styleAttr).toContain("left: 100px");
      expect(styleAttr).toContain("top: 192px");
    });

    it("should apply correct styling to delete button", () => {
      render(<ContextMenu {...mockProps} />);
      const deleteButton = screen.getByText("Delete").closest("button");
      expect(deleteButton).toHaveClass("text-red-600", "hover:bg-red-50");
    });
  });

  describe("Interactions", () => {
    it("should call onRenameAction and onCloseAction when rename is clicked", () => {
      render(<ContextMenu {...mockProps} />);
      fireEvent.click(screen.getByText("Rename"));

      expect(mockProps.onRenameAction).toHaveBeenCalledTimes(1);
      expect(mockProps.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it("should call onDuplicateAction and onCloseAction when duplicate is clicked", () => {
      render(<ContextMenu {...mockProps} />);
      fireEvent.click(screen.getByText("Duplicate"));

      expect(mockProps.onDuplicateAction).toHaveBeenCalledTimes(1);
      expect(mockProps.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it("should call onDeleteAction and onCloseAction when delete is clicked", () => {
      render(<ContextMenu {...mockProps} />);
      fireEvent.click(screen.getByText("Delete"));

      expect(mockProps.onDeleteAction).toHaveBeenCalledTimes(1);
      expect(mockProps.onCloseAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard Navigation", () => {
    it("should close menu when Escape key is pressed", () => {
      render(<ContextMenu {...mockProps} />);
      fireEvent.keyDown(document, { key: "Escape" });

      expect(mockProps.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it("should not close menu on other key presses", () => {
      render(<ContextMenu {...mockProps} />);
      fireEvent.keyDown(document, { key: "Enter" });
      fireEvent.keyDown(document, { key: "Space" });

      expect(mockProps.onCloseAction).not.toHaveBeenCalled();
    });
  });

  describe("Outside Click", () => {
    it("should close menu when clicking outside", () => {
      render(<ContextMenu {...mockProps} />);

      fireEvent.mouseDown(document.body);

      expect(mockProps.onCloseAction).toHaveBeenCalledTimes(1);
    });

    it("should not close menu when clicking inside", () => {
      render(<ContextMenu {...mockProps} />);

      const menu = screen.getByText("Settings").closest("div");
      fireEvent.mouseDown(menu!);

      expect(mockProps.onCloseAction).not.toHaveBeenCalled();
    });
  });

  describe("Event Cleanup", () => {
    it("should add and remove event listeners based on isOpen prop", () => {
      const addEventListenerSpy = vi.spyOn(document, "addEventListener");
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      const { rerender } = render(<ContextMenu {...mockProps} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );

      rerender(<ContextMenu {...mockProps} isOpen={false} />);

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { PageTab } from "@/components/PageNavigation/PageTab";
import { Page } from "@/components/PageNavigation/types";

const mockPage: Page = {
  id: "1",
  name: "Test Page",
};

const mockProps = {
  page: mockPage,
  isActive: false,
  isFocused: false,
  isHovered: false,
  showThreeDots: false,
  isEditing: false,
  onSelect: vi.fn(),
  onContextMenu: vi.fn(),
  onFocus: vi.fn(),
  onHover: vi.fn(),
  onSave: vi.fn(),
  onCancel: vi.fn(),
};

Object.defineProperty(Element.prototype, "getBoundingClientRect", {
  configurable: true,
  value: vi.fn(() => ({
    width: 120,
    height: 40,
    top: 100,
    left: 50,
    bottom: 140,
    right: 170,
  })),
});

describe("PageTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Context Menu Interactions", () => {
    it("should call onContextMenu on right-click", () => {
      render(<PageTab {...mockProps} />);
      const tab = screen.getByText("Test Page").closest("div");

      fireEvent.contextMenu(tab!);

      expect(mockProps.onContextMenu).toHaveBeenCalledWith("1", {
        x: 50,
        y: 84, // top - 16
      });
    });

    it("should call onContextMenu on right-click (button 2)", () => {
      render(<PageTab {...mockProps} />);
      const tab = screen.getByText("Test Page").closest("div");

      fireEvent.mouseDown(tab!, { button: 2 });

      expect(mockProps.onContextMenu).toHaveBeenCalledWith("1", {
        x: 50,
        y: 100,
      });
    });

    it("should call onContextMenu on actual right-click (button 2)", () => {
      render(<PageTab {...mockProps} />);
      const tab = screen.getByText("Test Page").closest("div");

      fireEvent.mouseDown(tab!, { button: 2 });

      expect(mockProps.onContextMenu).toHaveBeenCalledWith("1", {
        x: 50,
        y: 100,
      });
    });

    it("should not call onContextMenu on regular left-click", () => {
      render(<PageTab {...mockProps} />);
      const tab = screen.getByText("Test Page").closest("div");

      fireEvent.mouseDown(tab!, { button: 0, ctrlKey: false });

      expect(mockProps.onContextMenu).not.toHaveBeenCalled();
    });

    it("should call onContextMenu when three-dots button is clicked", () => {
      render(<PageTab {...mockProps} showThreeDots={true} />);
      const threeDotsButton = screen.getByRole("button");

      fireEvent.click(threeDotsButton);

      expect(mockProps.onContextMenu).toHaveBeenCalledWith("1", {
        x: 50,
        y: 84, // top - 16
      });
    });

    it("should prevent event propagation when three-dots is clicked", () => {
      render(<PageTab {...mockProps} showThreeDots={true} />);
      const threeDotsButton = screen.getByRole("button");

      fireEvent.click(threeDotsButton);

      expect(mockProps.onSelect).not.toHaveBeenCalled();
      expect(mockProps.onContextMenu).toHaveBeenCalled();
    });
  });

  describe("Three Dots Button", () => {
    it("should show three-dots button when showThreeDots is true and not editing", () => {
      render(<PageTab {...mockProps} showThreeDots={true} isEditing={false} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should hide three-dots button when showThreeDots is false", () => {
      render(<PageTab {...mockProps} showThreeDots={false} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should hide three-dots button when editing", () => {
      render(<PageTab {...mockProps} showThreeDots={true} isEditing={true} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Existing Functionality", () => {
    it("should call onSelect when clicked and not editing", () => {
      render(<PageTab {...mockProps} />);
      const tab = screen.getByText("Test Page").closest("div");

      fireEvent.click(tab!);

      expect(mockProps.onSelect).toHaveBeenCalledWith("1");
    });

    it("should not call onSelect when editing", () => {
      render(<PageTab {...mockProps} isEditing={true} />);

      const tab = screen.getByDisplayValue("Test Page").closest("div");

      fireEvent.click(tab!);

      expect(mockProps.onSelect).not.toHaveBeenCalled();
    });

    it("should apply active styles when isActive is true", () => {
      render(<PageTab {...mockProps} isActive={true} />);
      const tab = screen.getByText("Test Page").closest("div");

      expect(tab).toHaveClass("bg-white", "text-black");
    });

    it("should apply focused styles when isFocused is true", () => {
      render(<PageTab {...mockProps} isFocused={true} />);
      const tab = screen.getByText("Test Page").closest("div");

      expect(tab).toHaveClass("ring-2", "ring-blue-500", "ring-opacity-50");
    });

    it("should call onFocus and onHover handlers", () => {
      render(<PageTab {...mockProps} />);
      const tab = screen.getByText("Test Page").closest("div");

      fireEvent.focus(tab!);
      expect(mockProps.onFocus).toHaveBeenCalledWith("1");

      fireEvent.blur(tab!);
      expect(mockProps.onFocus).toHaveBeenCalledWith(null);

      fireEvent.mouseEnter(tab!);
      expect(mockProps.onHover).toHaveBeenCalledWith("1");

      fireEvent.mouseLeave(tab!);
      expect(mockProps.onHover).toHaveBeenCalledWith(null);
    });

    it("should render EditablePageName when editing", () => {
      render(<PageTab {...mockProps} isEditing={true} />);

      expect(screen.getByDisplayValue("Test Page")).toBeInTheDocument();
    });
  });
});

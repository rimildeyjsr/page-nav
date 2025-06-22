import { render, screen } from "@testing-library/react";
import { HoverAddButton } from "@/components/PageNavigation/HoverAddButton";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

const defaultProps = {
  gapIndex: 1,
  isVisible: true,
  onAdd: vi.fn(),
};

describe("HoverAddButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders when isVisible is true", () => {
      render(<HoverAddButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-label", "Add page after position 1");
    });

    it("does not render when isVisible is false", () => {
      render(<HoverAddButton {...defaultProps} isVisible={false} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders with correct size (16px)", () => {
      render(<HoverAddButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-4", "h-4");
    });

    it("has correct styling (white background, gray text)", () => {
      render(<HoverAddButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "bg-white",
        "hover:bg-gray-50",
        "text-gray-600",
        "hover:text-gray-800",
        "border",
        "border-gray-200",
        "rounded-full",
      );
    });

    it("is positioned absolutely and centered", () => {
      render(<HoverAddButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "absolute",
        "left-1/2",
        "top-1/2",
        "-translate-x-1/2",
        "-translate-y-1/2",
      );
    });

    it("has proper z-index for layering", () => {
      render(<HoverAddButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("z-10");
    });
  });

  describe("Interactions", () => {
    it("calls onAdd with correct gapIndex when clicked", async () => {
      const user = userEvent.setup();
      render(<HoverAddButton {...defaultProps} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(defaultProps.onAdd).toHaveBeenCalledTimes(1);
      expect(defaultProps.onAdd).toHaveBeenCalledWith(1);
    });

    it("calls onAdd with different gapIndex", async () => {
      const user = userEvent.setup();
      render(<HoverAddButton {...defaultProps} gapIndex={3} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(defaultProps.onAdd).toHaveBeenCalledWith(3);
    });

    it("stops event propagation when clicked", async () => {
      const user = userEvent.setup();
      const onContainerClick = vi.fn();

      render(
        <div onClick={onContainerClick}>
          <HoverAddButton {...defaultProps} />
        </div>,
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(defaultProps.onAdd).toHaveBeenCalledTimes(1);
      expect(onContainerClick).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has proper button role", () => {
      render(<HoverAddButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("has descriptive aria-label with gapIndex", () => {
      render(<HoverAddButton {...defaultProps} gapIndex={2} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Add page after position 2");
    });

    it("has focus styles", () => {
      render(<HoverAddButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-blue-500",
        "focus:ring-opacity-50",
      );
    });
  });

  describe("Icon", () => {
    it("renders plus icon", () => {
      render(<HoverAddButton {...defaultProps} />);

      const icon = screen.getByRole("button").querySelector("svg");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("w-2.5", "h-2.5");
    });

    it("plus icon has correct path", () => {
      render(<HoverAddButton {...defaultProps} />);

      const path = screen.getByRole("button").querySelector("svg path");
      expect(path).toHaveAttribute("d", "M12 6v6m0 0v6m0-6h6m-6 0H6");
    });
  });

  describe("Animations", () => {
    it("has transition classes", () => {
      render(<HoverAddButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "transition-all",
        "duration-200",
        "ease-in-out",
        "transform",
        "hover:scale-110",
      );
    });

    it("has shadow transition", () => {
      render(<HoverAddButton {...defaultProps} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("shadow-md", "hover:shadow-lg");
    });
  });
});

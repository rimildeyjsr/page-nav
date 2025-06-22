import { render, screen, fireEvent } from "@testing-library/react";
import { Divider } from "@/components/PageNavigation/Divider";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

const defaultProps = {
  gapIndex: 1,
  isHovered: false,
  onHoverChange: vi.fn(),
  onAddPage: vi.fn(),
};

describe("Divider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with correct container structure", () => {
      const { container } = render(<Divider {...defaultProps} />);

      const divider = container.firstChild as HTMLElement;
      expect(divider).toHaveClass(
        "relative",
        "flex",
        "items-center",
        "justify-center",
        "w-10",
        "h-full",
      );
    });

    it("renders dotted line with correct styling", () => {
      const { container } = render(<Divider {...defaultProps} />);

      const dottedLine = container.querySelector(
        "div[style*='repeating-linear-gradient']",
      );
      expect(dottedLine).toBeInTheDocument();

      const style = dottedLine?.getAttribute("style");
      expect(style).toContain("width: 100%");
      expect(style).toContain("height: 2px");
      expect(style).toContain("repeating-linear-gradient");
      expect(style).toContain("#d1d5db");
    });
  });

  describe("Hover Button Functionality (showHoverButton=true, default)", () => {
    it("calls onHoverChange with gapIndex on mouse enter", () => {
      const { container } = render(<Divider {...defaultProps} />);

      const divider = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(divider);

      expect(defaultProps.onHoverChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onHoverChange).toHaveBeenCalledWith(1);
    });

    it("calls onHoverChange with null on mouse leave", () => {
      const { container } = render(<Divider {...defaultProps} />);

      const divider = container.firstChild as HTMLElement;
      fireEvent.mouseLeave(divider);

      expect(defaultProps.onHoverChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onHoverChange).toHaveBeenCalledWith(null);
    });

    it("calls onHoverChange with different gapIndex", () => {
      const { container } = render(<Divider {...defaultProps} gapIndex={3} />);

      const divider = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(divider);

      expect(defaultProps.onHoverChange).toHaveBeenCalledWith(3);
    });

    it("shows HoverAddButton when isHovered is true", () => {
      render(<Divider {...defaultProps} isHovered={true} />);

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Add page after position 1"),
      ).toBeInTheDocument();
    });

    it("hides HoverAddButton when isHovered is false", () => {
      render(<Divider {...defaultProps} isHovered={false} />);

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("passes correct props to HoverAddButton", async () => {
      const user = userEvent.setup();
      render(<Divider {...defaultProps} isHovered={true} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(defaultProps.onAddPage).toHaveBeenCalledTimes(1);
      expect(defaultProps.onAddPage).toHaveBeenCalledWith(1);
    });

    it("HoverAddButton receives correct gapIndex", async () => {
      const user = userEvent.setup();
      render(<Divider {...defaultProps} gapIndex={2} isHovered={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Add page after position 2");

      await user.click(button);
      expect(defaultProps.onAddPage).toHaveBeenCalledWith(2);
    });
  });

  describe("No Hover Button Functionality (showHoverButton=false)", () => {
    it("does not call onHoverChange on mouse enter when showHoverButton=false", () => {
      const { container } = render(
        <Divider {...defaultProps} showHoverButton={false} />,
      );

      const divider = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(divider);

      expect(defaultProps.onHoverChange).not.toHaveBeenCalled();
    });

    it("does not call onHoverChange on mouse leave when showHoverButton=false", () => {
      const { container } = render(
        <Divider {...defaultProps} showHoverButton={false} />,
      );

      const divider = container.firstChild as HTMLElement;
      fireEvent.mouseLeave(divider);

      expect(defaultProps.onHoverChange).not.toHaveBeenCalled();
    });

    it("never shows HoverAddButton even when isHovered=true and showHoverButton=false", () => {
      render(
        <Divider {...defaultProps} isHovered={true} showHoverButton={false} />,
      );

      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("still renders the dotted line when showHoverButton=false", () => {
      const { container } = render(
        <Divider {...defaultProps} showHoverButton={false} />,
      );

      const dottedLine = container.querySelector(
        "div[style*='repeating-linear-gradient']",
      );
      expect(dottedLine).toBeInTheDocument();
    });
  });

  describe("Props Variations", () => {
    it("handles different gapIndex values", () => {
      const { container } = render(<Divider {...defaultProps} gapIndex={5} />);

      const divider = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(divider);

      expect(defaultProps.onHoverChange).toHaveBeenCalledWith(5);
    });

    it("showHoverButton prop defaults to true", () => {
      const { container } = render(<Divider {...defaultProps} />);

      const divider = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(divider);

      expect(defaultProps.onHoverChange).toHaveBeenCalled();
    });

    it("explicitly setting showHoverButton=true works", () => {
      const { container } = render(
        <Divider {...defaultProps} showHoverButton={true} />,
      );

      const divider = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(divider);

      expect(defaultProps.onHoverChange).toHaveBeenCalled();
    });
  });

  describe("Event Handling", () => {
    it("handles rapid mouse enter/leave events", () => {
      const { container } = render(<Divider {...defaultProps} />);

      const divider = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(divider);
      fireEvent.mouseLeave(divider);
      fireEvent.mouseEnter(divider);

      expect(defaultProps.onHoverChange).toHaveBeenCalledTimes(3);
      expect(defaultProps.onHoverChange).toHaveBeenNthCalledWith(1, 1);
      expect(defaultProps.onHoverChange).toHaveBeenNthCalledWith(2, null);
      expect(defaultProps.onHoverChange).toHaveBeenNthCalledWith(3, 1);
    });

    it("does not call handlers when showHoverButton=false during rapid events", () => {
      const { container } = render(
        <Divider {...defaultProps} showHoverButton={false} />,
      );

      const divider = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(divider);
      fireEvent.mouseLeave(divider);
      fireEvent.mouseEnter(divider);

      expect(defaultProps.onHoverChange).not.toHaveBeenCalled();
    });
  });
});

import { render, screen } from "@testing-library/react";
import { AddPageButton } from "@/components/PageNavigation/AddPageButton";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

const defaultProps = {
  onClick: vi.fn(),
};

describe("AddPageButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct text and icon", () => {
    render(<AddPageButton {...defaultProps} />);

    expect(screen.getByText("Add page")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has correct styling (white background, black text)", () => {
    render(<AddPageButton {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-white", "text-black", "border-gray-200");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    render(<AddPageButton {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("is accessible with proper button role", () => {
    render(<AddPageButton {...defaultProps} />);

    const button = screen.getByRole("button", { name: /add page/i });
    expect(button).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { PageTab } from "@/components/PageNavigation/PageTab";
import { mockPages } from "@/components/PageNavigation/mockData";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/PageNavigation/icons/DocumentIcon", () => ({
  DocumentIcon: ({ isActive }: { isActive: boolean }) => (
    <div data-testid="document-icon" data-active={isActive}>
      Icon
    </div>
  ),
}));

vi.mock("@/components/PageNavigation/icons/ThreeDots", () => ({
  ThreeDotsIcon: () => <div data-testid="three-dots-icon">⋮</div>,
}));

const mockPage = mockPages[0];

const defaultProps = {
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

describe("PageTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page name correctly", () => {
    render(<PageTab {...defaultProps} />);

    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByTestId("document-icon")).toBeInTheDocument();
  });

  it("shows three-dots menu only when showThreeDots is true", () => {
    const { rerender } = render(<PageTab {...defaultProps} />);

    expect(screen.queryByTestId("three-dots-icon")).not.toBeInTheDocument();

    rerender(<PageTab {...defaultProps} showThreeDots={true} />);
    expect(screen.getByTestId("three-dots-icon")).toBeInTheDocument();
  });

  it("applies active styling when isActive is true", () => {
    render(<PageTab {...defaultProps} isActive={true} />);

    const tab = screen.getByText("Info").closest("div");
    expect(tab).toHaveClass("bg-white", "text-black");

    expect(screen.getByTestId("document-icon")).toHaveAttribute(
      "data-active",
      "true",
    );
  });

  it("calls onSelect when clicked", async () => {
    const user = userEvent.setup();
    render(<PageTab {...defaultProps} />);

    await user.click(screen.getByText("Info"));
    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockPage.id);
  });

  it("calls onContextMenu on right click", async () => {
    const user = userEvent.setup();
    render(<PageTab {...defaultProps} />);

    await user.pointer({
      keys: "[MouseRight]",
      target: screen.getByText("Info"),
    });
    expect(defaultProps.onContextMenu).toHaveBeenCalled();
  });
});

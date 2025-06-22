import { render, screen } from "@testing-library/react";
import { PageNavigationContainer } from "@/components/PageNavigation/PageNavigationContainer";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Page } from "@/components/PageNavigation/types";

vi.mock("@/components/PageNavigation/PageTab", () => ({
  PageTab: ({
    page,
    isActive,
    onSelect,
  }: {
    page: Page;
    isActive: boolean;
    onSelect: (pageId: string) => void;
  }) => (
    <div
      data-testid={`page-tab-${page.id}`}
      data-active={isActive}
      onClick={() => onSelect(page.id)}
    >
      {page.name}
      {isActive && <span data-testid="active-indicator">ACTIVE</span>}
    </div>
  ),
}));

vi.mock("@/components/PageNavigation/Divider", () => ({
  Divider: () => <div data-testid="divider">---</div>,
}));

vi.mock("@/components/PageNavigation/AddPageButton", () => ({
  AddPageButton: ({ onClick }: { onClick: () => void }) => (
    <button data-testid="add-page-button" onClick={onClick}>
      Add page
    </button>
  ),
}));

describe("PageNavigationContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Render", () => {
    it("renders all mock pages", () => {
      render(<PageNavigationContainer />);

      expect(screen.getByTestId("page-tab-1")).toBeInTheDocument();
      expect(screen.getByTestId("page-tab-2")).toBeInTheDocument();
      expect(screen.getByTestId("page-tab-3")).toBeInTheDocument();
      expect(screen.getByTestId("page-tab-4")).toBeInTheDocument();
    });

    it("renders dividers between tabs", () => {
      render(<PageNavigationContainer />);

      const dividers = screen.getAllByTestId("divider");
      expect(dividers).toHaveLength(4);
    });

    it("renders add page button", () => {
      render(<PageNavigationContainer />);

      expect(screen.getByTestId("add-page-button")).toBeInTheDocument();
    });

    it("has first page (Info) active by default", () => {
      render(<PageNavigationContainer />);

      expect(screen.getByTestId("page-tab-1")).toHaveAttribute(
        "data-active",
        "true",
      );
      expect(screen.getByTestId("active-indicator")).toBeInTheDocument();
    });
  });

  describe("Page Selection", () => {
    it("switches active page when clicked", async () => {
      const user = userEvent.setup();
      render(<PageNavigationContainer />);

      await user.click(screen.getByTestId("page-tab-2"));

      expect(screen.getByTestId("page-tab-2")).toHaveAttribute(
        "data-active",
        "true",
      );
      expect(screen.getByTestId("page-tab-1")).toHaveAttribute(
        "data-active",
        "false",
      );
    });
  });

  describe("Add Page Functionality", () => {
    it("adds new page when add button is clicked", async () => {
      const user = userEvent.setup();
      render(<PageNavigationContainer />);

      expect(screen.getAllByTestId(/page-tab-/)).toHaveLength(4);

      await user.click(screen.getByTestId("add-page-button"));

      expect(screen.getAllByTestId(/page-tab-/)).toHaveLength(5);
    });

    it("makes new page active after adding", async () => {
      const user = userEvent.setup();
      render(<PageNavigationContainer />);

      await user.click(screen.getByTestId("add-page-button"));

      const newPageTab = screen.getAllByTestId(/page-tab-/)[4];
      expect(newPageTab).toHaveAttribute("data-active", "true");
    });
  });

  describe("CSS Grid Layout", () => {
    it("applies correct grid template columns", () => {
      render(<PageNavigationContainer />);

      const gridContainer = screen.getByTestId("page-tab-1").parentElement;
      expect(gridContainer).toHaveStyle({
        gridTemplateColumns: "repeat(4, max-content 40px) max-content",
      });
    });
  });
});

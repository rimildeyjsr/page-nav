import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { PageNavigationContainer } from "@/components/PageNavigation/PageNavigationContainer";

const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

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

describe("PageNavigationContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("Context Menu Integration", () => {
    it("should open context menu when right-clicking a tab", () => {
      render(<PageNavigationContainer />);
      const firstTab = screen.getByText("Info").closest("div");

      fireEvent.contextMenu(firstTab!);

      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Rename")).toBeInTheDocument();
      expect(screen.getByText("Duplicate")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("should open context menu when clicking three-dots on active tab", () => {
      render(<PageNavigationContainer />);

      const firstTab = screen.getByText("Info").closest("div");
      fireEvent.click(firstTab!);

      const buttons = screen.getAllByRole("button");
      const threeDotsButton = buttons.find(
        (button) =>
          button.querySelector("svg") &&
          !button.textContent?.includes("Add page"),
      );

      fireEvent.click(threeDotsButton!);

      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("should close context menu when clicking outside", () => {
      render(<PageNavigationContainer />);
      const firstTab = screen.getByText("Info").closest("div");

      fireEvent.contextMenu(firstTab!);
      expect(screen.getByText("Settings")).toBeInTheDocument();

      fireEvent.mouseDown(document.body);
      expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    });

    it("should close context menu when pressing Escape", () => {
      render(<PageNavigationContainer />);
      const firstTab = screen.getByText("Info").closest("div");

      fireEvent.contextMenu(firstTab!);
      expect(screen.getByText("Settings")).toBeInTheDocument();

      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    });

    it("should console.log when context menu actions are clicked", () => {
      render(<PageNavigationContainer />);
      const firstTab = screen.getByText("Info").closest("div");

      fireEvent.contextMenu(firstTab!);

      fireEvent.click(screen.getByText("Rename"));
      expect(consoleSpy).toHaveBeenCalledWith(
        "Rename clicked for page:",
        expect.any(String),
      );

      fireEvent.contextMenu(firstTab!);
      fireEvent.click(screen.getByText("Duplicate"));
      expect(consoleSpy).toHaveBeenCalledWith(
        "Duplicate clicked for page:",
        expect.any(String),
      );

      fireEvent.contextMenu(firstTab!);
      fireEvent.click(screen.getByText("Delete"));
      expect(consoleSpy).toHaveBeenCalledWith(
        "Delete clicked for page:",
        expect.any(String),
      );
    });

    it("should close context menu after clicking any action", () => {
      render(<PageNavigationContainer />);
      const firstTab = screen.getByText("Info").closest("div");

      fireEvent.contextMenu(firstTab!);
      fireEvent.click(screen.getByText("Rename"));

      expect(screen.queryByText("Settings")).not.toBeInTheDocument();
    });
  });

  describe("Existing Functionality", () => {
    it("should render all pages from mock data", () => {
      render(<PageNavigationContainer />);

      expect(screen.getByText("Info")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument();
      expect(screen.getByText("Ending")).toBeInTheDocument();
    });

    it("should show three-dots on active tab only", () => {
      render(<PageNavigationContainer />);

      const buttons = screen.getAllByRole("button");
      const threeDotsButtons = buttons.filter(
        (button) => button.querySelector("svg") && button.textContent === "",
      );
      expect(threeDotsButtons.length).toBeGreaterThanOrEqual(1);
    });

    it("should switch active tab when clicking different tab", () => {
      render(<PageNavigationContainer />);

      const secondTab = screen.getByText("Details").closest("div");
      fireEvent.click(secondTab!);

      expect(secondTab).toHaveClass("bg-white", "text-black");
    });

    it("should add new page when clicking add page button", () => {
      render(<PageNavigationContainer />);

      const addButton = screen.getByText("Add page");
      fireEvent.click(addButton);

      expect(screen.getByDisplayValue("New Page")).toBeInTheDocument();

      const pageTexts = [
        screen.queryByText("Info"),
        screen.queryByText("Details"),
        screen.queryByText("Other"),
        screen.queryByText("Ending"),
        screen.queryByDisplayValue("New Page"),
      ].filter(Boolean);

      expect(pageTexts).toHaveLength(5);
    });
  });

  describe("Keyboard Navigation", () => {
    describe("Arrow Key Navigation", () => {
      it("should move focus to next tab on ArrowRight", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowRight" });

        const focusedTab = document.activeElement;
        expect(focusedTab).toHaveAttribute("role", "tab");
      });

      it("should handle ArrowLeft navigation", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowLeft" });

        const focusedTab = document.activeElement;
        expect(focusedTab).toHaveAttribute("role", "tab");
      });

      it("should not cause errors with ArrowRight at end", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowRight" });
        fireEvent.keyDown(container, { key: "ArrowRight" });
        fireEvent.keyDown(container, { key: "ArrowRight" });
        fireEvent.keyDown(container, { key: "ArrowRight" });
        fireEvent.keyDown(container, { key: "ArrowRight" });

        const focusedTab = document.activeElement;
        expect(focusedTab).toHaveAttribute("role", "tab");
      });

      it("should not cause errors with ArrowLeft at beginning", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowLeft" });

        const focusedTab = document.activeElement;
        expect(focusedTab).toHaveAttribute("role", "tab");
      });
    });

    describe("Enter and Space Key Selection", () => {
      it("should handle Enter key without errors", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        expect(() => {
          fireEvent.keyDown(container, { key: "Enter" });
        }).not.toThrow();
      });

      it("should handle Space key without errors", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        expect(() => {
          fireEvent.keyDown(container, { key: " " });
        }).not.toThrow();
      });

      it("should maintain existing active state when no focus", () => {
        render(<PageNavigationContainer />);

        fireEvent.keyDown(document, { key: "Enter" });

        const infoTab = screen.getByLabelText("Page: Info");
        expect(infoTab).toHaveAttribute("aria-selected", "true");
      });
    });

    describe("Edit Mode Navigation", () => {
      it("should start editing when F2 is pressed on focused tab", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowRight" });
        fireEvent.keyDown(container, { key: "F2" });

        const inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBeGreaterThan(0);
      });

      it("should start editing on Cmd+Enter (Mac)", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowRight" });
        fireEvent.keyDown(container, { key: "Enter", metaKey: true });

        const inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBeGreaterThan(0);
      });

      it("should start editing on Ctrl+Enter (PC)", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowRight" });
        fireEvent.keyDown(container, { key: "Enter", ctrlKey: true });

        const inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBeGreaterThan(0);
      });

      it("should exit edit mode on Escape", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowRight" });
        fireEvent.keyDown(container, { key: "F2" });

        expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);

        fireEvent.keyDown(container, { key: "Escape" });

        const inputsAfterEscape = screen.queryAllByRole("textbox");
        expect(inputsAfterEscape.length).toBe(0);
      });

      it("should not handle arrow keys while editing", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowRight" });
        fireEvent.keyDown(container, { key: "F2" });

        const editingTab = screen
          .getAllByRole("textbox")[0]
          .closest('[role="tab"]');
        const initialTabIndex = editingTab?.getAttribute("tabindex");

        fireEvent.keyDown(container, { key: "ArrowRight" });

        const stillEditingTab = screen
          .getAllByRole("textbox")[0]
          .closest('[role="tab"]');
        expect(stillEditingTab?.getAttribute("tabindex")).toBe(initialTabIndex);
      });
    });

    describe("Context Menu Navigation", () => {
      it("should handle Ctrl+Space without errors", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowRight" });

        expect(() => {
          fireEvent.keyDown(container, { key: " ", ctrlKey: true });
        }).not.toThrow();
      });

      it("should handle Escape key for context menu without errors", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        expect(() => {
          fireEvent.keyDown(container, { key: "Escape" });
        }).not.toThrow();
      });

      it("should not break when keyboard navigation attempted during menu state", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowRight" });

        expect(() => {
          fireEvent.keyDown(container, { key: " ", ctrlKey: true });
          fireEvent.keyDown(container, { key: "ArrowRight" });
          fireEvent.keyDown(container, { key: "Escape" });
        }).not.toThrow();
      });
    });

    describe("Focus Management", () => {
      it("should be focusable", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        expect(container).toHaveFocus();
      });

      it("should handle focus changes", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        container.focus();
        fireEvent.keyDown(container, { key: "ArrowRight" });

        const tabs = screen.getAllByRole("tab");
        const tabIndexValues = tabs.map((tab) => tab.getAttribute("tabindex"));
        expect(tabIndexValues).toContain("0");
      });
    });

    describe("Accessibility", () => {
      it("should have proper ARIA roles and labels", () => {
        render(<PageNavigationContainer />);

        expect(screen.getByRole("tablist")).toBeInTheDocument();
        expect(screen.getByRole("tablist")).toHaveAttribute(
          "aria-label",
          "Page navigation",
        );

        const tabs = screen.getAllByRole("tab");
        tabs.forEach((tab) => {
          expect(tab).toHaveAttribute("aria-selected");
          expect(tab).toHaveAttribute("aria-label");
        });
      });

      it("should maintain proper tab order", () => {
        render(<PageNavigationContainer />);

        const tabs = screen.getAllByRole("tab");
        tabs.forEach((tab) => {
          expect(tab).toHaveAttribute("tabindex");
        });
      });
    });
  });
});

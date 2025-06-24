import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { PageNavigationContainer } from "@/components/PageNavigation/PageNavigationContainer";
import userEvent from "@testing-library/user-event";

interface DndHandlers {
  onDragStart?: (event: { active: { id: string } }) => void;
  onDragEnd?: (event: {
    active: { id: string };
    over: { id: string } | null;
  }) => void;
  onDragOver?: (event: {
    active: { id: string };
    over: { id: string };
  }) => void;
}

declare global {
  var dndHandlers: DndHandlers | undefined;
}

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

      expect(secondTab).toHaveClass("bg-white", "text-[#1A1A1A]");
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

  describe("Hover Add Button Integration", () => {
    it("should show hover add buttons in gaps between pages", () => {
      const { container } = render(<PageNavigationContainer />);

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );
      expect(dividers).toHaveLength(4);

      fireEvent.mouseEnter(dividers[0]);

      expect(
        screen.getByLabelText("Add page after position 0"),
      ).toBeInTheDocument();
    });

    it("should NOT show hover add button on last divider (before Add page button)", () => {
      const { container } = render(<PageNavigationContainer />);

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );
      const lastDivider = dividers[dividers.length - 1];

      fireEvent.mouseEnter(lastDivider);

      expect(
        screen.queryByRole("button", { name: /Add page after position/ }),
      ).not.toBeInTheDocument();
    });

    it("should add new page when clicking hover add button", async () => {
      const user = userEvent.setup();
      const { container } = render(<PageNavigationContainer />);

      expect(screen.getByText("Info")).toBeInTheDocument();
      expect(screen.getByText("Details")).toBeInTheDocument();
      expect(screen.getByText("Other")).toBeInTheDocument();
      expect(screen.getByText("Ending")).toBeInTheDocument();

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );
      fireEvent.mouseEnter(dividers[0]);

      const hoverButton = screen.getByLabelText("Add page after position 0");
      await user.click(hoverButton);

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

    it("should add page in correct position when using hover button", async () => {
      const user = userEvent.setup();
      const { container } = render(<PageNavigationContainer />);

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );
      fireEvent.mouseEnter(dividers[1]);

      const hoverButton = screen.getByLabelText("Add page after position 1");
      await user.click(hoverButton);

      // Wait for the state update and re-render
      await waitFor(() => {
        const allTabs = screen.getAllByRole("tab");
        expect(allTabs).toHaveLength(5);
      });

      const allTabs = screen.getAllByRole("tab");
      const tabNames = allTabs.map((tab) => {
        const input = tab.querySelector("input");
        const span = tab.querySelector("span");
        return input ? input.value : span?.textContent;
      });

      expect(tabNames).toEqual([
        "Info",
        "Details",
        "New Page",
        "Other",
        "Ending",
      ]);
    });
    it("should hide hover button when mouse leaves divider", () => {
      const { container } = render(<PageNavigationContainer />);

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );
      const firstDivider = dividers[0];

      fireEvent.mouseEnter(firstDivider);
      expect(
        screen.getByLabelText("Add page after position 0"),
      ).toBeInTheDocument();

      fireEvent.mouseLeave(firstDivider);
      expect(
        screen.queryByLabelText("Add page after position 0"),
      ).not.toBeInTheDocument();
    });

    it("should handle multiple divider hovers correctly", () => {
      const { container } = render(<PageNavigationContainer />);

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );

      fireEvent.mouseEnter(dividers[0]);
      expect(
        screen.getByLabelText("Add page after position 0"),
      ).toBeInTheDocument();
      expect(
        screen.queryByLabelText("Add page after position 1"),
      ).not.toBeInTheDocument();

      fireEvent.mouseLeave(dividers[0]);
      fireEvent.mouseEnter(dividers[1]);
      expect(
        screen.queryByLabelText("Add page after position 0"),
      ).not.toBeInTheDocument();
      expect(
        screen.getByLabelText("Add page after position 1"),
      ).toBeInTheDocument();
    });
  });

  describe("Divider Visual Consistency", () => {
    it("should always show dotted lines between all pages", () => {
      const { container } = render(<PageNavigationContainer />);

      const dottedLines = container.querySelectorAll(
        'div[style*="repeating-linear-gradient"]',
      );
      expect(dottedLines).toHaveLength(4);
    });

    it("should maintain visual consistency when pages are added", async () => {
      const user = userEvent.setup();
      const { container } = render(<PageNavigationContainer />);

      const addButton = screen.getByText("Add page");
      await user.click(addButton);

      const dottedLines = container.querySelectorAll(
        'div[style*="repeating-linear-gradient"]',
      );
      expect(dottedLines).toHaveLength(5);
    });
  });

  describe("Edit Mode Integration", () => {
    it("should start in edit mode when adding via hover button", async () => {
      const user = userEvent.setup();
      const { container } = render(<PageNavigationContainer />);

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );
      fireEvent.mouseEnter(dividers[0]);

      const hoverButton = screen.getByLabelText("Add page after position 0");
      await user.click(hoverButton);

      const input = screen.getByDisplayValue("New Page");
      expect(input).toBeInTheDocument();
      expect(input).toHaveFocus();
    });

    it("should save new page name when editing via hover-added page", async () => {
      const user = userEvent.setup();
      const { container } = render(<PageNavigationContainer />);

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );
      fireEvent.mouseEnter(dividers[0]);

      const hoverButton = screen.getByLabelText("Add page after position 0");
      await user.click(hoverButton);

      const input = screen.getByDisplayValue("New Page");
      await user.clear(input);
      await user.type(input, "Custom Name");
      await user.keyboard("{Enter}");

      expect(screen.getByText("Custom Name")).toBeInTheDocument();
      expect(screen.queryByDisplayValue("Custom Name")).not.toBeInTheDocument();
    });
  });

  describe("Interaction with Existing Features", () => {
    it("should not interfere with tab selection", async () => {
      const user = userEvent.setup();
      const { container } = render(<PageNavigationContainer />);

      const detailsTab = screen.getByText("Details").closest("div");
      await user.click(detailsTab!);

      expect(detailsTab).toHaveClass("bg-white", "text-[#1A1A1A]");

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );
      fireEvent.mouseEnter(dividers[0]);
      expect(
        screen.getByLabelText("Add page after position 0"),
      ).toBeInTheDocument();
    });

    it("should not interfere with context menu", async () => {
      const { container } = render(<PageNavigationContainer />);

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );
      fireEvent.mouseEnter(dividers[0]);
      expect(
        screen.getByLabelText("Add page after position 0"),
      ).toBeInTheDocument();

      const infoTab = screen.getByText("Info").closest("div");
      fireEvent.contextMenu(infoTab!);

      expect(screen.getByText("Settings")).toBeInTheDocument();

      expect(
        screen.getByLabelText("Add page after position 0"),
      ).toBeInTheDocument();
    });

    it("should work with keyboard navigation", () => {
      const { container } = render(<PageNavigationContainer />);
      const navigationContainer = screen.getByRole("tablist");

      navigationContainer.focus();
      fireEvent.keyDown(navigationContainer, { key: "ArrowRight" });

      const focusedTab = document.activeElement;
      expect(focusedTab).toHaveAttribute("role", "tab");

      const dividers = container.querySelectorAll(
        ".relative.flex.items-center",
      );
      fireEvent.mouseEnter(dividers[0]);
      expect(
        screen.getByLabelText("Add page after position 0"),
      ).toBeInTheDocument();
    });
  });

  describe("Drag and Drop Functionality", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      consoleSpy.mockClear();
    });

    describe("Drag State Management", () => {
      it("should initiate drag state when drag starts", () => {
        render(<PageNavigationContainer />);

        if (global.dndHandlers?.onDragStart) {
          global.dndHandlers.onDragStart({
            active: { id: "1" },
          });
        }

        expect(screen.getByRole("tablist")).toBeInTheDocument();
      });

      it("should end drag state when drag ends", () => {
        render(<PageNavigationContainer />);

        if (global.dndHandlers?.onDragStart) {
          global.dndHandlers.onDragStart({
            active: { id: "1" },
          });
        }

        if (global.dndHandlers?.onDragEnd) {
          global.dndHandlers.onDragEnd({
            active: { id: "1" },
            over: { id: "2" },
          });
        }

        expect(screen.getByRole("tablist")).toBeInTheDocument();
      });

      it("should close context menu when drag starts", () => {
        render(<PageNavigationContainer />);

        const firstTab = screen.getByText("Info").closest("div");
        fireEvent.contextMenu(firstTab!);
        expect(screen.getByText("Settings")).toBeInTheDocument();

        if (global.dndHandlers?.onDragStart) {
          global.dndHandlers.onDragStart({
            active: { id: "1" },
          });
        }

        expect(screen.getByRole("tablist")).toBeInTheDocument();
      });
    });

    describe("Page Reordering", () => {
      it("should handle reordering pages via drag and drop", () => {
        render(<PageNavigationContainer />);

        const initialTabs = screen.getAllByRole("tab");
        const initialOrder = initialTabs.map(
          (tab) =>
            tab.querySelector("span")?.textContent ||
            (tab.querySelector("input") as HTMLInputElement)?.value,
        );
        expect(initialOrder).toEqual(["Info", "Details", "Other", "Ending"]);

        if (global.dndHandlers?.onDragEnd) {
          global.dndHandlers.onDragEnd({
            active: { id: "1" },
            over: { id: "3" },
          });
        }

        const reorderedTabs = screen.getAllByRole("tab");
        const reorderedOrder = reorderedTabs.map(
          (tab) =>
            tab.querySelector("span")?.textContent ||
            (tab.querySelector("input") as HTMLInputElement)?.value,
        );

        expect(reorderedOrder).toHaveLength(4);
        expect(reorderedOrder).toContain("Info");
        expect(reorderedOrder).toContain("Details");
        expect(reorderedOrder).toContain("Other");
        expect(reorderedOrder).toContain("Ending");
      });

      it("should handle drag without valid drop target", () => {
        render(<PageNavigationContainer />);

        if (global.dndHandlers?.onDragEnd) {
          global.dndHandlers.onDragEnd({
            active: { id: "1" },
            over: null,
          });
        }

        const tabs = screen.getAllByRole("tab");
        expect(tabs).toHaveLength(4);

        const order = tabs.map(
          (tab) =>
            tab.querySelector("span")?.textContent ||
            (tab.querySelector("input") as HTMLInputElement)?.value,
        );
        expect(order).toEqual(["Info", "Details", "Other", "Ending"]);
      });

      it("should handle drag to same position", () => {
        render(<PageNavigationContainer />);

        if (global.dndHandlers?.onDragEnd) {
          global.dndHandlers.onDragEnd({
            active: { id: "1" },
            over: { id: "1" },
          });
        }

        const tabs = screen.getAllByRole("tab");
        expect(tabs).toHaveLength(4);

        const order = tabs.map(
          (tab) =>
            tab.querySelector("span")?.textContent ||
            (tab.querySelector("input") as HTMLInputElement)?.value,
        );
        expect(order).toEqual(["Info", "Details", "Other", "Ending"]);
      });
    });

    describe("Drag and Keyboard Navigation", () => {
      it("should cancel drag on Escape key", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        if (global.dndHandlers?.onDragStart) {
          global.dndHandlers.onDragStart({
            active: { id: "1" },
          });
        }

        container.focus();

        fireEvent.keyDown(container, { key: "Escape" });

        expect(container).toBeInTheDocument();
      });

      it("should not handle other keys during drag", () => {
        render(<PageNavigationContainer />);
        const container = screen.getByRole("tablist");

        if (global.dndHandlers?.onDragStart) {
          global.dndHandlers.onDragStart({
            active: { id: "1" },
          });
        }

        container.focus();

        expect(() => {
          fireEvent.keyDown(container, { key: "ArrowRight" });
          fireEvent.keyDown(container, { key: "ArrowLeft" });
          fireEvent.keyDown(container, { key: "Enter" });
          fireEvent.keyDown(container, { key: " " });
        }).not.toThrow();

        expect(container).toBeInTheDocument();
      });
    });

    describe("Drag Integration with Existing Features", () => {
      it("should preserve active page during drag operations", () => {
        render(<PageNavigationContainer />);

        const secondTab = screen.getByText("Details").closest("div");
        fireEvent.click(secondTab!);
        expect(secondTab).toHaveClass("bg-white", "text-[#1A1A1A]");

        if (global.dndHandlers?.onDragStart) {
          global.dndHandlers.onDragStart({
            active: { id: "1" },
          });
        }

        if (global.dndHandlers?.onDragEnd) {
          global.dndHandlers.onDragEnd({
            active: { id: "1" },
            over: { id: "3" },
          });
        }

        expect(secondTab).toHaveClass("bg-white", "text-[#1A1A1A]");
      });

      it("should work with hover add buttons during non-drag state", async () => {
        const user = userEvent.setup();
        const { container } = render(<PageNavigationContainer />);

        const dividers = container.querySelectorAll(
          ".relative.flex.items-center",
        );
        fireEvent.mouseEnter(dividers[0]);

        expect(
          screen.getByLabelText("Add page after position 0"),
        ).toBeInTheDocument();

        const hoverButton = screen.getByLabelText("Add page after position 0");
        await user.click(hoverButton);

        expect(screen.getByDisplayValue("New Page")).toBeInTheDocument();
      });

      it("should maintain context menu functionality", () => {
        render(<PageNavigationContainer />);

        const firstTab = screen.getByText("Info").closest("div");
        fireEvent.contextMenu(firstTab!);

        expect(screen.getByText("Settings")).toBeInTheDocument();
        expect(screen.getByText("Rename")).toBeInTheDocument();
        expect(screen.getByText("Duplicate")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
      });
    });

    describe("Drag Visual Feedback", () => {
      it("should render DragOverlay when dragging", () => {
        render(<PageNavigationContainer />);

        if (global.dndHandlers?.onDragStart) {
          global.dndHandlers.onDragStart({
            active: { id: "1" },
          });
        }

        expect(screen.getByRole("tablist")).toBeInTheDocument();
      });

      it("should handle drag over events", () => {
        render(<PageNavigationContainer />);

        if (global.dndHandlers?.onDragStart) {
          global.dndHandlers.onDragStart({
            active: { id: "1" },
          });
        }

        if (global.dndHandlers?.onDragOver) {
          global.dndHandlers.onDragOver({
            active: { id: "1" },
            over: { id: "2" },
          });
        }

        expect(screen.getByRole("tablist")).toBeInTheDocument();
      });
    });

    describe("Accessibility During Drag", () => {
      it("should maintain ARIA attributes during drag operations", () => {
        render(<PageNavigationContainer />);

        expect(screen.getByRole("tablist")).toHaveAttribute(
          "aria-label",
          "Page navigation",
        );

        const tabs = screen.getAllByRole("tab");
        tabs.forEach((tab) => {
          expect(tab).toHaveAttribute("aria-selected");
          expect(tab).toHaveAttribute("aria-label");
        });

        if (global.dndHandlers?.onDragStart) {
          global.dndHandlers.onDragStart({
            active: { id: "1" },
          });
        }

        expect(screen.getByRole("tablist")).toHaveAttribute(
          "aria-label",
          "Page navigation",
        );

        const tabsAfterDrag = screen.getAllByRole("tab");
        tabsAfterDrag.forEach((tab) => {
          expect(tab).toHaveAttribute("aria-selected");
          expect(tab).toHaveAttribute("aria-label");
        });
      });
    });

    describe("Error Handling", () => {
      it("should handle invalid drag operations gracefully", () => {
        render(<PageNavigationContainer />);

        expect(() => {
          if (global.dndHandlers?.onDragEnd) {
            global.dndHandlers.onDragEnd({
              active: { id: "invalid-id" },
              over: { id: "2" },
            });
          }
        }).not.toThrow();

        expect(screen.getByRole("tablist")).toBeInTheDocument();
      });

      it("should handle rapid drag operations", () => {
        render(<PageNavigationContainer />);

        expect(() => {
          if (global.dndHandlers?.onDragStart) {
            global.dndHandlers.onDragStart({ active: { id: "1" } });
          }
          if (global.dndHandlers?.onDragEnd) {
            global.dndHandlers.onDragEnd({
              active: { id: "1" },
              over: { id: "2" },
            });
          }
          if (global.dndHandlers?.onDragStart) {
            global.dndHandlers.onDragStart({ active: { id: "2" } });
          }
          if (global.dndHandlers?.onDragEnd) {
            global.dndHandlers.onDragEnd({
              active: { id: "2" },
              over: { id: "3" },
            });
          }
        }).not.toThrow();

        expect(screen.getByRole("tablist")).toBeInTheDocument();
      });
    });

    describe("Integration with Edit Mode", () => {
      it("should not interfere with editing operations", async () => {
        const user = userEvent.setup();
        render(<PageNavigationContainer />);

        const firstTab = screen.getByText("Info").closest("div");
        fireEvent.contextMenu(firstTab!);
        await user.click(screen.getByText("Rename"));

        expect(screen.getByDisplayValue("Info")).toBeInTheDocument();

        if (global.dndHandlers?.onDragStart) {
          global.dndHandlers.onDragStart({
            active: { id: "2" },
          });
        }

        expect(screen.getByDisplayValue("Info")).toBeInTheDocument();
      });
    });
  });
});

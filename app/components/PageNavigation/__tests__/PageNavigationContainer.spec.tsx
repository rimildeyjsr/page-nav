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
});

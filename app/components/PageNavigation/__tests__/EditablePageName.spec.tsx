import { render, screen } from "@testing-library/react";
import { EditablePageName } from "@/components/PageNavigation/EditablePageName";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

const defaultProps = {
  initialName: "Test Page",
  onSaveAction: vi.fn(),
  onCancelAction: vi.fn(),
};

describe("EditablePageName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with initial name and auto-focuses", () => {
    render(<EditablePageName {...defaultProps} />);

    const input = screen.getByDisplayValue("Test Page");
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it("saves on Enter key", async () => {
    const user = userEvent.setup();
    render(<EditablePageName {...defaultProps} />);

    const input = screen.getByDisplayValue("Test Page");
    await user.clear(input);
    await user.type(input, "New Name");
    await user.keyboard("{Enter}");

    expect(defaultProps.onSaveAction).toHaveBeenCalledWith("New Name");
  });

  it("cancels on Escape key", async () => {
    const user = userEvent.setup();
    render(<EditablePageName {...defaultProps} />);

    await user.keyboard("{Escape}");
    expect(defaultProps.onCancelAction).toHaveBeenCalled();
  });

  it("saves on blur", async () => {
    const user = userEvent.setup();
    render(<EditablePageName {...defaultProps} />);

    const input = screen.getByDisplayValue("Test Page");
    await user.clear(input);
    await user.type(input, "Blur Save");
    await user.tab(); // Triggers blur

    expect(defaultProps.onSaveAction).toHaveBeenCalledWith("Blur Save");
  });
});

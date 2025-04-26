import { render, screen, fireEvent, act } from "@testing-library/react";
import { CopyButton } from "../CopyButton";

describe("CopyButton", () => {
  const mockData = { test: "data" };
  const mockClipboard = {
    writeText: jest.fn(),
  };

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders copy icon by default", () => {
    render(<CopyButton data={mockData} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("copies data and shows check icon temporarily when clicked", async () => {
    jest.useFakeTimers();
    render(<CopyButton data={mockData} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify(mockData, null, 2)
    );

    expect(screen.getByTestId("check-icon")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();

    jest.useRealTimers();
  });
});

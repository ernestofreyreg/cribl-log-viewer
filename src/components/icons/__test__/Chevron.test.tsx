import { render, screen } from "@testing-library/react";
import { Chevron } from "../Chevron";

describe("Chevron", () => {
  it("renders with default props", () => {
    render(<Chevron />);
    const chevron = screen.getByTestId("chevron-icon");
    expect(chevron).toBeInTheDocument();
  });

  it("renders with different directions", () => {
    const { rerender } = render(<Chevron rotated />);
    let chevron = screen.getByTestId("chevron-icon");
    expect(chevron).toHaveStyle("transform: rotate(90deg)");

    rerender(<Chevron />);
    chevron = screen.getByTestId("chevron-icon");
    expect(chevron).toHaveStyle("transform: rotate(0deg)");
  });
});

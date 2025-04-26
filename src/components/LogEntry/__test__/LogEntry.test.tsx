import { render, screen } from "@testing-library/react";
import { LogEntry } from "../LogEntry";

describe("LogEntry", () => {
  it("renders a simple object with different value types", () => {
    const logData = {
      string: "test",
      number: 42,
      boolean: true,
    };

    render(<LogEntry logData={logData} />);

    expect(screen.getByTestId("log-entry-container")).toBeInTheDocument();

    expect(screen.getByText(/string/)).toBeInTheDocument();
    expect(screen.getByText(/test/)).toBeInTheDocument();
    expect(screen.getByText(/number/)).toBeInTheDocument();
    expect(screen.getByText(/42/)).toBeInTheDocument();
    expect(screen.getByText(/boolean/)).toBeInTheDocument();
    expect(screen.getByText(/true/)).toBeInTheDocument();
  });

  it("renders nested objects correctly", () => {
    const logData = {
      nested: {
        key: "value",
        number: 123,
      },
    };

    render(<LogEntry logData={logData} />);

    expect(screen.getByText(/nested/)).toBeInTheDocument();

    expect(screen.getByText(/key/)).toBeInTheDocument();
    expect(screen.getByText(/value/)).toBeInTheDocument();
    expect(screen.getByText(/number/)).toBeInTheDocument();
    expect(screen.getByText(/123/)).toBeInTheDocument();
  });

  it("renders arrays correctly", () => {
    const logData = {
      array: [1, "two", true, null],
    };

    render(<LogEntry logData={logData} />);

    expect(screen.getByText(/array/)).toBeInTheDocument();
    expect(screen.getByText(/\[/)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
    expect(screen.getByText(/"two"/)).toBeInTheDocument();
    expect(screen.getByText(/true/)).toBeInTheDocument();
    expect(screen.getByText(/null/)).toBeInTheDocument();
    expect(screen.getByText(/\]/)).toBeInTheDocument();
  });
});

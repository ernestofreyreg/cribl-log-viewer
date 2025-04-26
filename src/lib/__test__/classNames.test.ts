import { classNames } from "../classNames";

describe("classNames", () => {
  it("joins multiple class names with spaces", () => {
    expect(classNames("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("filters out falsy values", () => {
    expect(classNames("foo", "", "bar", undefined, "baz", null)).toBe(
      "foo bar baz"
    );
  });

  it("returns empty string when no classes provided", () => {
    expect(classNames()).toBe("");
  });

  it("returns single class name unchanged", () => {
    expect(classNames("foo")).toBe("foo");
  });
});

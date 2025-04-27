import { getFormattedTimestamp } from "../getFormattedTimestamp";

describe("getFormattedTimestamp", () => {
  it("formats timestamp correctly", () => {
    const minute = 28738726; // (2024-08-22, 06:46:00) / (60 * 1000)
    const timeResolution = 1;

    const result = getFormattedTimestamp(minute, timeResolution);

    expect(result).toBe("2024-08-22, 06:46:00");
  });

  it("handles different time resolutions", () => {
    const minute = 28738726 / 5;
    const timeResolution = 5; // 5 minute resolution

    const result = getFormattedTimestamp(minute, timeResolution);

    expect(result).toBe("2024-08-22, 06:46:00");
  });
});

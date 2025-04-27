import { useState, useEffect, useCallback } from "react";

export const useNDJSONTimelineCounter = (
  url: string,
  minutesResolution: number
) => {
  const [hits, setHits] = useState<{ minute: number; count: number }[]>([]);
  const [maxCount, setMaxCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadAndProcessData = useCallback(async () => {
    if (!url) {
      setError(new Error("No URL provided"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let calculatedMaxCount = 0;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const text = await response.text();

      const minuteCountList: { minute: number; count: number }[] = [];

      const lines = text.trim().split("\n");

      lines.forEach((line) => {
        if (!line.trim()) return;

        try {
          const json = JSON.parse(line);

          if (json && typeof json._time === "number") {
            const minute = Math.floor(json._time / (minutesResolution * 60000));

            if (minuteCountList.length === 0) {
              minuteCountList.push({ minute, count: 1 });
              calculatedMaxCount = 1;
            } else {
              if (
                minuteCountList[minuteCountList.length - 1].minute === minute
              ) {
                minuteCountList[minuteCountList.length - 1].count += 1;
                if (
                  minuteCountList[minuteCountList.length - 1].count >
                  calculatedMaxCount
                ) {
                  calculatedMaxCount =
                    minuteCountList[minuteCountList.length - 1].count;
                }
              } else {
                minuteCountList.push({ minute, count: 1 });
              }
            }
          }
        } catch (parseError) {
          console.error("Error parsing JSON line:", parseError, line);
        }
      });

      setHits(minuteCountList);
      setMaxCount(calculatedMaxCount);
    } catch (fetchError) {
      setError(fetchError as Error);
    } finally {
      setLoading(false);
    }
  }, [url, minutesResolution]);

  useEffect(() => {
    if (url) {
      loadAndProcessData();
    }
  }, [url, loadAndProcessData, minutesResolution]);

  return { hits, loading, error, maxCount };
};

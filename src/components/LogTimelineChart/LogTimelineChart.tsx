import { useMemo } from "react";
import styles from "./LogTimelineChart.module.css";
import { getFormattedTimestamp } from "../../lib/getFormattedTimestamp";
import { classNames } from "../../lib/classNames";

type LogTimelineChartProps = {
  hits: { minute: number; count: number }[];
  maxCount: number;
  timeResolution: number;
  onResolutionChange: (resolution: number) => void;
  loading?: boolean;
};

const resolutionValues = ["6hour", "12hour", "1day"] as const;
type Resolution = (typeof resolutionValues)[number];

const resolutions: Record<Resolution, { label: string; value: number }> = {
  "6hour": { label: "6 hours", value: 6 * 60 },
  "12hour": { label: "12 hours", value: 12 * 60 },
  "1day": { label: "1 day", value: 24 * 60 },
};

export function LogTimelineChart({
  hits,
  maxCount,
  timeResolution,
  onResolutionChange,
  loading,
}: LogTimelineChartProps) {
  const numberLines = useMemo(() => {
    if (maxCount === 0) {
      return [];
    }

    return [
      ...Array.from({ length: 4 }, (_, index) =>
        Math.floor((maxCount / 4) * (4 - index))
      ),
      0,
    ];
  }, [maxCount]);

  const handleChangeResolution = (resolution: Resolution) => () => {
    onResolutionChange(resolutions[resolution].value);
  };

  return (
    <div className={styles.logTimelineChart}>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          <div className={styles.resolutions}>
            {resolutionValues.map((resolution) => (
              <button
                className={classNames(
                  styles.resolution,
                  resolutions[resolution].value === timeResolution &&
                    styles.activeResolution
                )}
                type="button"
                onClick={handleChangeResolution(resolution)}
                key={resolution}
              >
                {resolutions[resolution].label}
              </button>
            ))}
          </div>

          <div className={styles.chartContainer}>
            <div className={styles.chartNumberLineContainer}>
              <div className={styles.chartNumberLine} />
              <div className={styles.chartNumberLine} />
              <div className={styles.chartNumberLine} />
              <div className={styles.chartNumberLine} />
              <div className={styles.chartNumberLine} />
            </div>

            <div className={styles.chartLegend}>
              <div className={styles.chartLegendTop}>
                {numberLines.map((numberLine, index) => (
                  <div className={styles.chartLegendNumber} key={index}>
                    {numberLine}
                  </div>
                ))}
              </div>
              <div className={styles.chartLegendBottom}></div>
            </div>

            <div className={styles.chartContent}>
              <div className={styles.chartContentInner}>
                <div className={styles.chartBars}>
                  {hits.map((hit, index) => (
                    <div
                      key={hit.minute}
                      className={styles.bar}
                      style={{ height: `${(hit.count / maxCount) * 100}%` }}
                    >
                      {hit.count}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.chartContentBottom}>
                {hits.map((hit, index) => (
                  <div key={hit.minute} className={styles.chartBarLabel}>
                    <div className={styles.chartBarLabelNotch} />
                    {(index - 1) % 3 === 0 && (
                      <div className={styles.chartBarLabelText}>
                        {getFormattedTimestamp(hit.minute, timeResolution)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

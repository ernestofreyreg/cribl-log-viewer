import { CSSProperties, SVGProps, useMemo } from "react";

interface ChevronProps extends SVGProps<SVGSVGElement> {
  rotated?: boolean;
}

export function Chevron(props: ChevronProps) {
  const { rotated = false, ...restProps } = props;
  const combinedStyle = useMemo<CSSProperties>(() => {
    return {
      transform: rotated ? "rotate(90deg)" : "rotate(0deg)",
      transition: "transform 0.15s ease",
    };
  }, [rotated]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="lucide lucide-chevron-right-icon lucide-chevron-right"
      {...restProps}
      style={combinedStyle}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

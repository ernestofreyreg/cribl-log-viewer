import { SVGProps } from "react";

export function Check(props: SVGProps<SVGSVGElement>) {
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
      data-testid="check-icon"
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

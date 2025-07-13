// Example: src/components/icons/HomeIcon.tsx

import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  secondaryColor?: string;
}

const HomeIcon: React.FC<IconProps> = ({ size = 24, color = "#1A1625", secondaryColor = "#E5E5E5", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path
      d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 20.5523 15 20V16C15 15.4477 14.5523 15 14 15H10C9.44772 15 9 15.4477 9 16V20C9 20.5523 8.55228 21 8 21H4C3.44772 21 3 20.5523 3 20V10Z"
      fill={secondaryColor}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export default HomeIcon;

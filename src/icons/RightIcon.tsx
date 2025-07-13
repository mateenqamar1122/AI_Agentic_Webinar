import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  secondaryColor?: string;
}

const RightIcon: React.FC<IconProps> = ({ size = 24, color = "#1A1625", secondaryColor = "#E5E5E5", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" {...props}>
    <circle cx="12" cy="12" r="10" fill={secondaryColor} stroke={color} strokeWidth="1.5" />
    <path d="M10 8L14 12L10 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default RightIcon;

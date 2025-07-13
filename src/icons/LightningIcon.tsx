import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  secondaryColor?: string;
}

const LightningIcon: React.FC<IconProps> = ({ size = 24, color = "#1A1625", secondaryColor = "#E5E5E5", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" {...props}>
    <path d="M13 2L6 14H12L11 22L18 10H12L13 2Z" fill={secondaryColor} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export default LightningIcon;

import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  secondaryColor?: string;
}

const PipelineIcon: React.FC<IconProps> = ({ size = 24, color = "#1A1625", secondaryColor = "#E5E5E5", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" {...props}>
    <rect x="3" y="10" width="18" height="4" rx="2" fill={secondaryColor} stroke={color} strokeWidth="1.5" />
    <path d="M7 10V6M17 14V18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default PipelineIcon;

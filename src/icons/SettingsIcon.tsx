import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  secondaryColor?: string;
}

const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = "#1A1625", secondaryColor = "#E5E5E5", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" {...props}>
    <circle cx="12" cy="12" r="3" fill={color} />
    <path d="M19.4 15A1.65 1.65 0 0 0 20 13.6 1.65 1.65 0 0 0 18.4 12a1.65 1.65 0 0 0 .6-1.4A1.65 1.65 0 0 0 17 9.4L15 8a1.65 1.65 0 0 0-1.4-.6A1.65 1.65 0 0 0 12 6.6 1.65 1.65 0 0 0 10.6 8a1.65 1.65 0 0 0-1.4.6L7 9.4a1.65 1.65 0 0 0-.6 1.4A1.65 1.65 0 0 0 5.6 12 1.65 1.65 0 0 0 7 13.6a1.65 1.65 0 0 0 .6 1.4l2 1.4a1.65 1.65 0 0 0 1.4.6 1.65 1.65 0 0 0 1.4-.6l2-1.4a1.65 1.65 0 0 0 .6-1.4z" fill={secondaryColor} stroke={color} strokeWidth="1.5" />
  </svg>
);

export default SettingsIcon;

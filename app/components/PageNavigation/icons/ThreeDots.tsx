interface ThreeDotsIconProps {
  className?: string;
}

export const ThreeDotsIcon = ({ className }: ThreeDotsIconProps) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={`text-gray-500 ${className || ""}`}
  >
    <circle cx="8" cy="3" r="2" fill="currentColor" />
    <circle cx="8" cy="8" r="2" fill="currentColor" />
    <circle cx="8" cy="13" r="2" fill="currentColor" />
  </svg>
);

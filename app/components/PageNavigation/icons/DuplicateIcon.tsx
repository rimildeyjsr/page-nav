interface DuplicateIconProps {
  className?: string;
}

export const DuplicateIcon = ({ className }: DuplicateIconProps) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <rect
      x="6"
      y="6"
      width="8"
      height="8"
      stroke="currentColor"
      strokeWidth="1.5"
      rx="1"
    />
    <rect
      x="2"
      y="2"
      width="8"
      height="8"
      stroke="currentColor"
      strokeWidth="1.5"
      rx="1"
    />
  </svg>
);

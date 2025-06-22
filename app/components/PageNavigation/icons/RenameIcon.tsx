interface RenameIconProps {
  className?: string;
}

export const RenameIcon = ({ className }: RenameIconProps) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M11.5 2L14 4.5L5 13.5L2.5 14L3 11.5L11.5 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

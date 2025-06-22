interface DeleteIconProps {
  className?: string;
}

export const DeleteIcon = ({ className }: DeleteIconProps) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M6 2V1C6 0.5 6.5 0 7 0H9C9.5 0 10 0.5 10 1V2H13C13.5 2 14 2.5 14 3C14 3.5 13.5 4 13 4H12V13C12 14.5 10.5 16 9 16H7C5.5 16 4 14.5 4 13V4H3C2.5 4 2 3.5 2 3C2 2.5 2.5 2 3 2H6Z"
      fill="currentColor"
    />
    <path d="M6.5 6V12" stroke="white" strokeWidth="1" strokeLinecap="round" />
    <path d="M9.5 6V12" stroke="white" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

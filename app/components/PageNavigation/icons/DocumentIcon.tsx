export const DocumentIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={`${isActive ? "text-orange-500" : "text-gray-500"}`}
  >
    <path
      d="M3 2a1 1 0 0 1 1-1h5.586a1 1 0 0 1 .707.293l2.414 2.414A1 1 0 0 1 13 4.414V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2z"
      fill="currentColor"
    />
  </svg>
);

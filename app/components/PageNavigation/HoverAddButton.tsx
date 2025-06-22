interface HoverAddButtonProps {
  gapIndex: number;
  isVisible: boolean;
  onAdd: (afterIndex: number) => void;
}

export const HoverAddButton = ({
  gapIndex,
  isVisible,
  onAdd,
}: HoverAddButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(gapIndex);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className="absolute z-10 flex items-center justify-center w-4 h-4 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 rounded-full shadow-md hover:shadow-lg border border-gray-200 transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-label={`Add page after position ${gapIndex}`}
    >
      <svg
        className="w-2.5 h-2.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>
  );
};

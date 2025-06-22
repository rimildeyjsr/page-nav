interface AddPageButtonProps {
  onClick: () => void;
}

export const AddPageButton = ({ onClick }: AddPageButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-gray-200 text-black hover:bg-white transition-colors duration-200 text-sm font-medium"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      Add page
    </button>
  );
};

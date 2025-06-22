import { HoverAddButton } from "./HoverAddButton";

interface DividerProps {
  gapIndex: number;
  isHovered: boolean;
  onHoverChange: (gapIndex: number | null) => void;
  onAddPage: (afterIndex: number) => void;
  showHoverButton?: boolean;
}

export const Divider = ({
  gapIndex,
  isHovered,
  onHoverChange,
  onAddPage,
  showHoverButton = true,
}: DividerProps) => {
  const handleMouseEnter = () => {
    if (showHoverButton) {
      onHoverChange(gapIndex);
    }
  };

  const handleMouseLeave = () => {
    if (showHoverButton) {
      onHoverChange(null);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center w-10 h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          width: "100%",
          height: "2px",
          backgroundImage:
            "repeating-linear-gradient(to right, #d1d5db 0, #d1d5db 3px, transparent 3px, transparent 6px)",
        }}
      />
      {showHoverButton && (
        <HoverAddButton
          gapIndex={gapIndex}
          isVisible={isHovered}
          onAdd={onAddPage}
        />
      )}
    </div>
  );
};

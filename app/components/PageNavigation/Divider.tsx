export const Divider = () => {
  return (
    <div className="flex items-center justify-center w-10 h-full">
      <div
        style={{
          width: "100%",
          height: "2px",
          backgroundImage:
            "repeating-linear-gradient(to right, #d1d5db 0, #d1d5db 3px, transparent 3px, transparent 6px)",
        }}
      />
    </div>
  );
};

import React from "react";

interface SplitPageProps {
  leftSide: React.ReactNode;
  rightSide: React.ReactNode;
  error?: React.ReactNode;
}

export function SplitPage({ leftSide, rightSide, error }: SplitPageProps) {
  return (
    <div
      className="min-h-screen flex flex-1 items-center w-full overflow-x-auto"
      style={{
        backgroundColor: "#FBFAF9",
        backgroundImage:
          "radial-gradient(circle, #EAE9E8 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="min-w-[900px] w-full mx-auto flex flex-col ">
        <div className="flex flex-row items-center p-16 gap-8">
          <div className="flex-1">{leftSide}</div>
          <div className="flex-1 flex flex-col items-center p-16">
            <div className="relative">
              {rightSide}
              {error && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

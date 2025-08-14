import React from "react";

interface PageProps {
  leftSide: React.ReactNode;
  rightSide: React.ReactNode;
  error?: React.ReactNode;
}

function Page({ leftSide, rightSide, error }: PageProps) {
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
      <div className="min-w-[900px] w-full mx-auto">
        <div className="flex flex-row items-center p-16 gap-8">
          <div className="flex-1">{leftSide}</div>
          <div className="flex-1 flex flex-col items-center p-16">
            {error ?? rightSide}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;

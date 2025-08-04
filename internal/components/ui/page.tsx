import React from "react";

interface PageProps {
  children: React.ReactNode;
}

function Page({ children }: PageProps) {
  return (
    <div
      className="min-h-screen flex flex-1 items-center justify-center w-full"
      style={{
        backgroundColor: "#FBFAF9",
        backgroundImage:
          "radial-gradient(circle, #EAE9E8 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        backgroundRepeat: "repeat",
      }}
    >
      {children}
    </div>
  );
}

export default Page;

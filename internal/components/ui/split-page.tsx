import React from "react";
import { Toaster } from "./toaster";
import { CodeTabs } from "./code-tabs";
import { Typography } from "./typography";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { InfoIcon } from "./info-icon";

interface SplitPageProps {
  leftSide: React.ReactNode;
  rightSide: React.ReactNode;
  codeTabs?: Record<string, string>;
  error?: React.ReactNode;
}

export function SplitPage({
  leftSide,
  rightSide,
  error,
  codeTabs,
}: SplitPageProps) {
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
      <div className="min-w-0 w-full mx-auto flex flex-col">
        <div className="flex flex-col lg:flex-row lg:items-center p-4 lg:p-16 gap-4 lg:gap-8">
          <div className="flex-1">{leftSide}</div>
          <div className="flex-1 flex flex-col items-center p-4 lg:p-16 gap-8">
            {rightSide}
            {error}
            {!error && !!codeTabs && (
              <div className="flex gap-2 flex-col">
                <div className="flex gap-2 items-center">
                  <Typography variant="h4" className="font-medium">
                    Stytch API in your backend
                  </Typography>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        The Backend SDK and API Response show how your backend
                        server will interact with the Stytch API.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CodeTabs codes={codeTabs} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

import { createContext, useContext } from "react";
import { APIResponse } from "../api";

export const CodeSnippetsContext = createContext<{
  codeTabs: Record<string, string> | undefined;
  addResponse: (
    response: APIResponse<unknown>,
    opts?: { replace?: boolean }
  ) => void;
  restorePreviousSnippets: () => void;
}>({
  codeTabs: {},
  addResponse: () => {},
  restorePreviousSnippets: () => {},
});

export const useCodeSnippets = () => {
  return useContext(CodeSnippetsContext);
};

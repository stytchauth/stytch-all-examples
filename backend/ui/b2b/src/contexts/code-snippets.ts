import { createContext, useContext } from "react";
import { APIResponse } from "../api";

export const CodeSnippetsContext = createContext<{
  codeTabs: Record<string, string> | undefined;
  addResponse: (
    response: APIResponse<unknown>,
    opts?: { replace?: boolean }
  ) => void;
}>({
  codeTabs: {},
  addResponse: () => {},
});

export const useCodeSnippets = () => {
  return useContext(CodeSnippetsContext);
};

import { useCallback, useMemo, useState } from "react";
import { APIResponse } from "../api";
import { CodeSnippetsContext } from "./code-snippets";

type CodeSnippet = {
  codeSnippet: string;
  stytchResponse: string;
};

export const CodeSnippetsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [apiRequests, _setApiRequests] = useState<CodeSnippet[]>([]);

  const setApiRequests: React.Dispatch<React.SetStateAction<CodeSnippet[]>> =
    useCallback((requests) => {
      _setApiRequests(requests);
    }, []);

  const addResponse = useCallback(
    (response: APIResponse<unknown>, opts?: { replace?: boolean }) => {
      setApiRequests((prev) => [
        ...(opts?.replace ? [] : prev),
        {
          codeSnippet: response.codeSnippet,
          stytchResponse:
            typeof response.stytchResponse === "string"
              ? response.stytchResponse
              : JSON.stringify(response.stytchResponse, null, 2),
        },
      ]);
    },
    [setApiRequests]
  );

  const codeTabs = useMemo(() => {
    return apiRequests.length > 0
      ? {
          "Backend SDK Code": apiRequests
            .map((request) => request.codeSnippet)
            .join("\n\n"),
          "API Response": apiRequests
            .map((request) => request.stytchResponse)
            .join("\n\n"),
        }
      : undefined;
  }, [apiRequests]);

  return (
    <CodeSnippetsContext.Provider value={{ codeTabs, addResponse }}>
      {children}
    </CodeSnippetsContext.Provider>
  );
};

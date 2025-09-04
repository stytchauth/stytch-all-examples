import { useCallback, useMemo, useRef, useState } from "react";
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

  const prevRequests = useRef<CodeSnippet[]>([]);

  const setApiRequests: React.Dispatch<React.SetStateAction<CodeSnippet[]>> =
    useCallback(
      (requests) => {
        prevRequests.current = apiRequests;
        _setApiRequests(requests);
      },
      [apiRequests]
    );

  const addResponse = useCallback(
    (response: APIResponse<unknown>, opts?: { replace?: boolean }) => {
      prevRequests.current = apiRequests;
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
    [apiRequests, setApiRequests]
  );

  const restorePreviousSnippets = useCallback(() => {
    _setApiRequests(prevRequests.current);
  }, [_setApiRequests]);

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
    <CodeSnippetsContext.Provider
      value={{ codeTabs, addResponse, restorePreviousSnippets }}
    >
      {children}
    </CodeSnippetsContext.Provider>
  );
};

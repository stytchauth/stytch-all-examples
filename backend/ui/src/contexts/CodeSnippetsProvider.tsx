import { useCallback, useMemo, useState } from "react";
import { APIResponse } from "../api";
import { CodeSnippetsContext } from "./code-snippets";

export const CodeSnippetsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [apiRequests, setApiRequests] = useState<
    {
      codeSnippet: string;
      stytchResponse: string;
    }[]
  >([]);

  const addResponse = useCallback(
    (response: APIResponse<unknown>, opts?: { replace?: boolean }) => {
      setApiRequests([
        ...(opts?.replace ? [] : apiRequests),
        {
          codeSnippet: response.codeSnippet,
          stytchResponse: JSON.stringify(response.stytchResponse, null, 2),
        },
      ]);
    },
    [apiRequests]
  );

  const codeTabs = useMemo(() => {
    return apiRequests.length > 0
      ? {
          "API Response": apiRequests
            .map((request) => request.stytchResponse)
            .join("\n\n"),
          "Backend SDK Code": apiRequests
            .map((request) => request.codeSnippet)
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

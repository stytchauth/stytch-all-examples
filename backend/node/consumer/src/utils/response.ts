export type ResponseBody<T> = {
  method: string;
  codeSnippet: string;
  stytchResponse: T;
  metadata: Record<string, unknown>;
}

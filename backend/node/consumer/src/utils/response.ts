/**
 * `ResponseBody` is a wrapper for Stytch API calls for the purposes of
 * populating content in the example app.
 *
 * You can ignore this when building your own Stytch integration.
 */
export type ResponseBody<T> = {
  method: string;
  codeSnippet: string;
  stytchResponse: T;
  metadata: Record<string, unknown>;
  error?: Error;
}

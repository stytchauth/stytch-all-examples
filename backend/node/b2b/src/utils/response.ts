
export type ResponseBody<T> = {
  method: string;
  codeSnippet: string;
  stytchResponse: T;
  metadata: Record<string, unknown>;
}

// export function respond<T>(expressRes: ExpressResponse, res: Response<T>) {
// }

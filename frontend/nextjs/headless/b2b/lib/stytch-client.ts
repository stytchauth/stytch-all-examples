import { B2BClient } from "stytch";

export const stytchClient = new B2BClient({
  project_id: process.env.PROJECT_ID || "",
  secret: process.env.PROJECT_SECRET || "",
});

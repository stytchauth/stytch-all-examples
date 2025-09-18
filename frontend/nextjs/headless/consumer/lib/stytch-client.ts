import { Client } from "stytch";

export const stytchClient = new Client({
  project_id: process.env.PROJECT_ID || "",
  secret: process.env.PROJECT_SECRET || "",
});

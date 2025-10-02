import express, { type Application, Request, Response, Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import * as discovery from "./discovery/index.js";
import * as magicLinks from "./magicLinks/index.js";
import * as sessions from "./session/index.js";
import { universalAuthenticate } from "./utils/authenticate.js";
import { loadStytchClient } from "./utils/stytchClient.js";
import { errorMiddleware, loggingMiddleware } from "./utils/middlewares.js";

const port = 3000;
const app: Application = express();
// Instantiate a Stytch client.
loadStytchClient();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(loggingMiddleware);

const router = Router();

// Handle index with simple health check.
router.get("/", (_: Request, res: Response) => {
  res.status(200).send("OK");
});


// Handle universal authenticate endpoint.
router.all("/authenticate", universalAuthenticate);

// Handle Email Magic Links routes.
router.post("/magic-links/invite", magicLinks.invite);
router.post("/magic-links/login-signup", magicLinks.loginOrSignup);
router.post("/magic_links/email/discovery/send", magicLinks.discoverySend);

// Handle Discovery routes.
router.get("/discovery/organizations", discovery.listOrganizations);
router.post("/discovery/organizations/create", discovery.createOrgViaDiscovery);

// Handle Sessions routes.
router.post("/sessions/exchange", sessions.exchange);
router.get("/session", sessions.getCurrentSession);
router.all("/logout", sessions.logout);

app.use(router);

// Error handling middlewares should be used last in Express.js applications.
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

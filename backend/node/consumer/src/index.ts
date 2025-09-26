import express, { type Application, NextFunction, Request, Response, Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import * as magicLinks from "./magicLinks/index.js";
import * as oauth from "./oauth/index.js";
import * as sessions from "./session/index.js";
import { universalAuthenticate } from "./utils/authenticate.js";
import { loadStytchClient } from "./utils/stytchClient.js";

const port = 3000;
const app: Application = express();
// Instantiate a Stytch client.
loadStytchClient();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json({ strict: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req: Request, _: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

const router = Router();

// Handle index with simple health check.
router.get("/", (_: Request, res: Response) => {
  res.status(200).send("OK");
});


// Handle universal authenticate endpoint.
router.all("/authenticate", universalAuthenticate);

// Handle Email Magic Links routes.
router.post("/magic_links/email/send", magicLinks.sendEmail);
router.post("/magic_links/authenticate", magicLinks.authenticate);

// Handle OAuth routes.
router.get("/oauth/authenticate", oauth.oauthAuthenticate);

// Handle Sessions routes.
router.get("/session", sessions.getCurrentSession);
router.all("/logout", sessions.logout);

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

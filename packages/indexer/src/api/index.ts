import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { graphql } from "ponder";

const app = new Hono();

// The playground is served from another origin (Vercel / localhost:3020).
app.use("/graphql", cors({ origin: "*", allowMethods: ["GET", "POST", "OPTIONS"] }));
app.use("/graphql", graphql({ db, schema }));

export default app;

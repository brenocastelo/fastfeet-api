import { Router } from "express";

const routes = new Router();

routes.get("/", (re, res) => {
  return res.json({ ok: true });
});

export default routes;

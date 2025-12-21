import app, { init } from "../../server/app.js";

export default async function handler(req, res) {
  await init();
  return app(req, res);
}

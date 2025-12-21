import app, { init } from "./app.js";

const port = process.env.PORT || 4000;

await init();

app.listen(port, () => {
  console.log(`✅ API running on http://localhost:${port}`);
});

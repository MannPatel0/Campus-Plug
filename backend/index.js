import express, { json } from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(json());

// sample route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(3030, () => {
  console.log("\tRunning Backend:");
  console.log("\x1b[36m \tLocal:\thttp://localhost:3030/ \x1b[0m");
});

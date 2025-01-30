import express, { json } from "express";
import cors from "cors";
const app = express();

// Middleware
app.use(cors());
app.use(json());

// Sample Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(3030, () => console.log(`Server running on port ${3030}`));

import express, { json } from "express";
import cors from "cors";
const app = express();

// Middleware
//uses the cors and json middleware
//cors is used to allow cross-origin requests
//json is used to parse the request body
app.use(cors());
app.use(json());

// Sample Route
//This is a sample route that sends a JSON response
//when a GET request is made to /api/test
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(3030, () => {
  console.log("\tRunning Backend:");
  console.log("\x1b[36m \tLocal:\thttp://localhost:3030/ \x1b[0m");
});

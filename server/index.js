import path from "path";
import express from "express";
import {fileURLToPath} from 'url';

const PORT = process.env.PORT || 8500;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.resolve(__dirname, '../client/dist')));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

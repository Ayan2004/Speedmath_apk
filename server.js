import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Prevent serving server/package metadata files directly
app.use((req, res, next) => {
  const blocked = ['/server.js', '/package.json', '/package-lock.json', '/bun.lock', '/bun.lockb'];
  if (blocked.includes(req.path) || req.path.startsWith('/node_modules')) {
    return res.status(404).send('Not Found');
  }
  next();
});

// Serve static HTML pages from root
app.use(express.static(__dirname, { index: 'index.html', extensions: ['html'] }));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SpeedMath Mock Drill Hub running on http://0.0.0.0:${PORT}`);
});

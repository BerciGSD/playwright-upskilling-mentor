import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function screenshotSaverPlugin(): Plugin {
  return {
    name: 'screenshot-saver-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-screenshot', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { filename, dataUrl } = JSON.parse(body);
              if (filename && dataUrl) {
                const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const docsDir = path.resolve(__dirname, 'docs/images');
                const publicDir = path.resolve(__dirname, 'public/screenshots');
                if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
                if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

                fs.writeFileSync(path.join(docsDir, filename), buffer);
                fs.writeFileSync(path.join(publicDir, filename), buffer);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, file: filename }));
                return;
              }
            } catch (err) {
              console.error('Failed to save screenshot:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to process screenshot' }));
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), screenshotSaverPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    allowedHosts: true // Allow all incoming tunnel domains (Cloudflare, Tailscale, Localtunnel, etc.)
  }
});

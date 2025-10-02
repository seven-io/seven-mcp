import http from 'http';
import net from 'net';
import { URL } from 'url';

export interface CallbackResult {
  code: string;
  state: string;
}

// OAuth redirect URI configured ports (must match seven.io OAuth app settings)
// These are configured as: http://127.0.0.1:7177/callback, etc.
export const OAUTH_PORTS = [7177, 9437, 8659];

/**
 * Start a temporary HTTP server to receive OAuth callback
 * @param port - Port to listen on (default: 7177)
 * @param expectedState - Expected state parameter for CSRF protection
 * @returns Promise that resolves with authorization code when callback is received
 */
export function startCallbackServer(
  port: number = 7177,
  expectedState: string
): Promise<CallbackResult> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url || '', `http://127.0.0.1:${port}`);

      // Handle OAuth callback
      if (url.pathname === '/callback') {
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');

        // Handle OAuth errors
        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Authorization Failed</title>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    background: #e74c3c;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                  }
                  body::before,
                  body::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 50%;
                  }
                  body::before {
                    top: 0;
                    background: linear-gradient(180deg,
                      transparent 0%,
                      transparent 30%,
                      rgba(255, 255, 255, 0.02) 40%,
                      rgba(255, 255, 255, 0.05) 50%,
                      rgba(255, 255, 255, 0.02) 60%,
                      transparent 70%,
                      transparent 100%
                    );
                    transform: skewY(-3deg);
                    transform-origin: top left;
                  }
                  body::after {
                    bottom: 0;
                    background:
                      radial-gradient(ellipse 800px 300px at 50% 120%, rgba(192, 57, 43, 0.3), transparent),
                      linear-gradient(0deg,
                        rgba(192, 57, 43, 0.4) 0%,
                        transparent 40%
                      );
                    transform: skewY(2deg);
                    transform-origin: bottom right;
                  }
                  @keyframes wave {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(-25px) translateY(-10px); }
                  }
                  .wave-bg {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    right: -100%;
                    bottom: 0;
                    background-image:
                      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 50% 20%, rgba(231, 76, 60, 0.2) 0%, transparent 40%);
                    animation: wave 20s ease-in-out infinite;
                  }
                  .container {
                    text-align: center;
                    background: white;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    max-width: 400px;
                    position: relative;
                    z-index: 1;
                  }
                  .error-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 1.5rem;
                    background: #ff4d4f;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    color: white;
                  }
                  h1 {
                    color: #333;
                    margin-bottom: 1rem;
                    font-size: 1.75rem;
                  }
                  p {
                    color: #666;
                    font-size: 1rem;
                    line-height: 1.5;
                    margin-bottom: 0.5rem;
                  }
                  .error-details {
                    color: #999;
                    font-size: 0.9rem;
                    margin-top: 1rem;
                  }
                </style>
              </head>
              <body>
                <div class="wave-bg"></div>
                <div class="container">
                  <div class="error-icon">✕</div>
                  <h1>Authorization Failed</h1>
                  <p><strong>Error:</strong> ${error}</p>
                  ${errorDescription ? `<p class="error-details">${errorDescription}</p>` : ''}
                  <p>You can close this window.</p>
                </div>
              </body>
            </html>
          `);
          server.close();
          reject(new Error(`OAuth error: ${error} - ${errorDescription}`));
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Invalid Callback</title>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    background: #f39c12;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                  }
                  body::before,
                  body::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 50%;
                  }
                  body::before {
                    top: 0;
                    background: linear-gradient(180deg,
                      transparent 0%,
                      transparent 30%,
                      rgba(255, 255, 255, 0.02) 40%,
                      rgba(255, 255, 255, 0.05) 50%,
                      rgba(255, 255, 255, 0.02) 60%,
                      transparent 70%,
                      transparent 100%
                    );
                    transform: skewY(-3deg);
                    transform-origin: top left;
                  }
                  body::after {
                    bottom: 0;
                    background:
                      radial-gradient(ellipse 800px 300px at 50% 120%, rgba(211, 84, 0, 0.3), transparent),
                      linear-gradient(0deg,
                        rgba(211, 84, 0, 0.4) 0%,
                        transparent 40%
                      );
                    transform: skewY(2deg);
                    transform-origin: bottom right;
                  }
                  @keyframes wave {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(-25px) translateY(-10px); }
                  }
                  .wave-bg {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    right: -100%;
                    bottom: 0;
                    background-image:
                      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 50% 20%, rgba(243, 156, 18, 0.2) 0%, transparent 40%);
                    animation: wave 20s ease-in-out infinite;
                  }
                  .container {
                    text-align: center;
                    background: white;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    max-width: 400px;
                    position: relative;
                    z-index: 1;
                  }
                  .warning-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 1.5rem;
                    background: #faad14;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    color: white;
                  }
                  h1 {
                    color: #333;
                    margin-bottom: 1rem;
                    font-size: 1.75rem;
                  }
                  p {
                    color: #666;
                    font-size: 1rem;
                    line-height: 1.5;
                  }
                </style>
              </head>
              <body>
                <div class="wave-bg"></div>
                <div class="container">
                  <div class="warning-icon">!</div>
                  <h1>Invalid Callback</h1>
                  <p>Missing code or state parameter</p>
                  <p>You can close this window.</p>
                </div>
              </body>
            </html>
          `);
          server.close();
          reject(new Error('Missing code or state parameter'));
          return;
        }

        // Validate state (CSRF protection)
        if (state !== expectedState) {
          res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Security Error</title>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    background: #e74c3c;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                  }
                  body::before,
                  body::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 50%;
                  }
                  body::before {
                    top: 0;
                    background: linear-gradient(180deg,
                      transparent 0%,
                      transparent 30%,
                      rgba(255, 255, 255, 0.02) 40%,
                      rgba(255, 255, 255, 0.05) 50%,
                      rgba(255, 255, 255, 0.02) 60%,
                      transparent 70%,
                      transparent 100%
                    );
                    transform: skewY(-3deg);
                    transform-origin: top left;
                  }
                  body::after {
                    bottom: 0;
                    background:
                      radial-gradient(ellipse 800px 300px at 50% 120%, rgba(192, 57, 43, 0.3), transparent),
                      linear-gradient(0deg,
                        rgba(192, 57, 43, 0.4) 0%,
                        transparent 40%
                      );
                    transform: skewY(2deg);
                    transform-origin: bottom right;
                  }
                  @keyframes wave {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(-25px) translateY(-10px); }
                  }
                  .wave-bg {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    right: -100%;
                    bottom: 0;
                    background-image:
                      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 50% 20%, rgba(231, 76, 60, 0.2) 0%, transparent 40%);
                    animation: wave 20s ease-in-out infinite;
                  }
                  .container {
                    text-align: center;
                    background: white;
                    padding: 3rem;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    max-width: 400px;
                    position: relative;
                    z-index: 1;
                  }
                  .shield-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 1.5rem;
                    background: #ff4d4f;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    color: white;
                  }
                  h1 {
                    color: #333;
                    margin-bottom: 1rem;
                    font-size: 1.75rem;
                  }
                  p {
                    color: #666;
                    font-size: 1rem;
                    line-height: 1.5;
                  }
                </style>
              </head>
              <body>
                <div class="wave-bg"></div>
                <div class="container">
                  <div class="shield-icon">🛡</div>
                  <h1>Security Error</h1>
                  <p>State mismatch - possible CSRF attack</p>
                  <p>You can close this window.</p>
                </div>
              </body>
            </html>
          `);
          server.close();
          reject(new Error('State mismatch - possible CSRF attack'));
          return;
        }

        // Success!
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Authorization Successful</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  background: #00c896;
                  height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  overflow: hidden;
                }
                body::before,
                body::after {
                  content: '';
                  position: absolute;
                  left: 0;
                  right: 0;
                  height: 50%;
                }
                body::before {
                  top: 0;
                  background: linear-gradient(180deg,
                    transparent 0%,
                    transparent 30%,
                    rgba(255, 255, 255, 0.02) 40%,
                    rgba(255, 255, 255, 0.05) 50%,
                    rgba(255, 255, 255, 0.02) 60%,
                    transparent 70%,
                    transparent 100%
                  );
                  transform: skewY(-3deg);
                  transform-origin: top left;
                }
                body::after {
                  bottom: 0;
                  background:
                    radial-gradient(ellipse 800px 300px at 50% 120%, rgba(0, 150, 110, 0.3), transparent),
                    linear-gradient(0deg,
                      rgba(0, 140, 100, 0.4) 0%,
                      transparent 40%
                    );
                  transform: skewY(2deg);
                  transform-origin: bottom right;
                }
                @keyframes wave {
                  0%, 100% { transform: translateX(0) translateY(0); }
                  50% { transform: translateX(-25px) translateY(-10px); }
                }
                .wave-bg {
                  position: absolute;
                  top: 0;
                  left: -100%;
                  right: -100%;
                  bottom: 0;
                  background-image:
                    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 50% 20%, rgba(0, 200, 150, 0.2) 0%, transparent 40%);
                  animation: wave 20s ease-in-out infinite;
                }
                .container {
                  text-align: center;
                  background: white;
                  padding: 3rem;
                  border-radius: 12px;
                  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                  max-width: 400px;
                  position: relative;
                  z-index: 1;
                }
                .checkmark {
                  width: 80px;
                  height: 80px;
                  margin: 0 auto 1.5rem;
                  background: #52c41a;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 40px;
                  color: white;
                }
                h1 {
                  color: #333;
                  margin-bottom: 1rem;
                  font-size: 1.75rem;
                }
                p {
                  color: #666;
                  font-size: 1rem;
                  line-height: 1.5;
                }
              </style>
            </head>
            <body>
              <div class="wave-bg"></div>
              <div class="container">
                <div class="checkmark">✓</div>
                <h1>Authorization Successful!</h1>
                <p>You can close this window and return to the terminal.</p>
              </div>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `);

        server.close();
        resolve({ code, state });
        return;
      }

      // Handle other paths
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    });

    // Handle server errors
    server.on('error', (err) => {
      reject(err);
    });

    // Start listening (force IPv4 by using 127.0.0.1 instead of localhost)
    server.listen(port, '127.0.0.1');
  });
}

/**
 * Find an available port from the OAuth ports list
 * @returns The first available port
 */
export async function findAvailablePort(): Promise<number> {
  for (const port of OAUTH_PORTS) {
    const isAvailable = await new Promise<boolean>((resolve) => {
      const server = net.createServer();
      server.once('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          resolve(false);
        } else {
          resolve(false);
        }
      });
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port, '127.0.0.1');
    });

    if (isAvailable) {
      return port;
    }
  }

  throw new Error(`No available ports found from: ${OAUTH_PORTS.join(', ')}`);
}

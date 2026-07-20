import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';

const serverUrl = 'http://127.0.0.1:4321/';

const isReady = async () => {
  try {
    const response = await fetch(serverUrl);
    return response.ok;
  } catch {
    return false;
  }
};

const stopServer = async (server: ChildProcess) => {
  if (server.exitCode !== null || server.killed) return;
  server.kill();
  await Promise.race([
    once(server, 'exit'),
    new Promise((resolve) => setTimeout(resolve, 2000))
  ]);
  if (server.exitCode === null) server.kill('SIGKILL');
};

export default async () => {
  if (await isReady()) return;

  const server = spawn(
    process.execPath,
    ['node_modules/astro/bin/astro.mjs', 'preview', '--host', '127.0.0.1', '--port', '4321'],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: 'ignore',
      windowsHide: true
    }
  );

  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Preview server exited before tests with code ${server.exitCode}.`);
    }
    if (await isReady()) return () => stopServer(server);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  await stopServer(server);
  throw new Error(`Preview server did not become ready at ${serverUrl}.`);
};

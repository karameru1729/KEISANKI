import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

// Ensure private key handles newlines if passed via environment variable
const formatPrivateKey = (key?: string) => {
  if (!key) return undefined;
  return key.replace(/\\n/g, '\n');
};

export async function connectSSH() {
  const host = process.env.SSH_HOST;
  const port = process.env.SSH_PORT ? parseInt(process.env.SSH_PORT, 10) : 22;
  const username = process.env.SSH_USER;
  const privateKey = formatPrivateKey(process.env.SSH_PRIVATE_KEY);
  const privateKeyPath = process.env.SSH_PRIVATE_KEY_PATH;

  if (!host || !username) {
    throw new Error('SSH_HOST or SSH_USER environment variables are not set.');
  }

  if (!privateKey && !privateKeyPath) {
    throw new Error('Neither SSH_PRIVATE_KEY nor SSH_PRIVATE_KEY_PATH are set.');
  }

  // Connect to the SSH server
  await ssh.connect({
    host,
    port,
    username,
    privateKeyPath,
    privateKey,
  });

  return ssh;
}

export async function executeCommand(command: string) {
  try {
    const connection = await connectSSH();
    const result = await connection.execCommand(command);
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      code: result.code,
    };
  } catch (error: any) {
    console.error("SSH Execution Error:", error);
    throw new Error(`Failed to execute command: ${error.message}`);
  } finally {
    ssh.dispose();
  }
}

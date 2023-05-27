import type { NextApiRequest, NextApiResponse } from 'next'
import { spawn } from 'child_process'

let daemonProcess;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!daemonProcess) {
    console.log('Starting daemon process...');

    daemonProcess = spawn('node', ['daemon.js']);

    daemonProcess.stdout.on('data', (data) => {
      console.log(`Daemon stdout: ${data}`);
    });

    daemonProcess.stderr.on('data', (data) => {
      console.error(`Daemon stderr: ${data}`);
    });

    daemonProcess.on('close', (code) => {
      console.log(`Daemon process exited with code ${code}`);
      daemonProcess = null;
    });

    res.status(200).json({ message: 'Daemon started successfully.' });
  } else {
    res.status(200).json({ message: 'Daemon is already running.' });
  }
};

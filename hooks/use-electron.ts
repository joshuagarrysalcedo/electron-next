import { useEffect, useState } from 'react';

// Define the electron window interface
interface ElectronWindow extends Window {
  electron?: {
    send: (channel: string, data: any) => void;
    receive: (channel: string, func: (...args: any[]) => void) => void;
    appInfo: {
      name: string;
      version: string;
      environment: string;
    };
  };
}

export function useElectron() {
  const [isElectron, setIsElectron] = useState<boolean>(false);
  const [appInfo, setAppInfo] = useState<{
    name: string;
    version: string;
    environment: string;
  } | null>(null);

  useEffect(() => {
    // Check if running in Electron
    if (typeof window !== 'undefined') {
      const electronWindow = window as ElectronWindow;
      const isRunningInElectron = !!electronWindow.electron;
      setIsElectron(isRunningInElectron);

      if (isRunningInElectron && electronWindow.electron?.appInfo) {
        setAppInfo(electronWindow.electron.appInfo);
      }
    }
  }, []);

  // Safe wrapper for sending messages to Electron
  const sendToElectron = (channel: string, data: any) => {
    if (isElectron) {
      const electronWindow = window as ElectronWindow;
      electronWindow.electron?.send(channel, data);
    } else {
      console.warn('Not running in Electron, cannot send message:', channel, data);
    }
  };

  // Safe wrapper for receiving messages from Electron
  const receiveFromElectron = (channel: string, callback: (...args: any[]) => void) => {
    if (isElectron) {
      const electronWindow = window as ElectronWindow;
      electronWindow.electron?.receive(channel, callback);
    } else {
      console.warn('Not running in Electron, cannot listen to channel:', channel);
    }
  };

  return {
    isElectron,
    appInfo,
    sendToElectron,
    receiveFromElectron
  };
}
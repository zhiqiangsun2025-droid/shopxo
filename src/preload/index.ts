import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  ping: async () => {
    const result = await ipcRenderer.invoke('engine:ping');
    return result;
  },
});

declare global {
  interface Window {
    api: {
      ping: () => Promise<unknown>;
    };
  }
}

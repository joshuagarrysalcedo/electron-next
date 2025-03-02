interface Window {
  isCapacitor?: boolean;
  Capacitor?: {
    isNative: boolean;
    getPlatform: () => string;
  };
}

// Manually declare the capacitor global object
declare namespace Capacitor {
  const isNative: boolean;
  function getPlatform(): string;
}
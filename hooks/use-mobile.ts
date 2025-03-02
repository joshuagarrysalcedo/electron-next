import * as React from "react";

const MOBILE_BREAKPOINT = 768;

// Detect if viewport size is mobile
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// Detect if running on a mobile platform with Capacitor
export function useMobilePlatform() {
  const [isCapacitor, setIsCapacitor] = React.useState<boolean>(false);
  const [platform, setPlatform] = React.useState<string>('web');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if running in Capacitor
      setIsCapacitor(!!window.isCapacitor);

      // Determine the platform
      if (window.Capacitor) {
        setPlatform(window.Capacitor.getPlatform());
      }
    }
  }, []);

  const isIOS = platform === 'ios';
  const isAndroid = platform === 'android';
  const isNative = isIOS || isAndroid;
  const isWeb = !isNative;

  return {
    isCapacitor,
    isIOS,
    isAndroid,
    isNative,
    isWeb,
    platform
  };
}

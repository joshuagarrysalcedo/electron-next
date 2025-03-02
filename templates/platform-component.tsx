import React, { ReactNode } from 'react';
import { useElectron } from '../hooks/use-electron';
import { useMobilePlatform } from '../hooks/use-mobile';

/**
 * Props for the PlatformAware component
 */
interface PlatformAwareProps {
  /** Content to render on all platforms */
  children: ReactNode;
  
  /** Content to render only on desktop (Electron) */
  desktopContent?: ReactNode;
  
  /** Content to render only on mobile (iOS/Android) */
  mobileContent?: ReactNode;
  
  /** Content to render only on web */
  webContent?: ReactNode;
  
  /** Content to render only on iOS */
  iosContent?: ReactNode;
  
  /** Content to render only on Android */
  androidContent?: ReactNode;

  /** Class name for the wrapper div */
  className?: string;
}

/**
 * PlatformAware - A component that renders different content based on the platform
 * 
 * This component can be used to render different content for different platforms:
 * - Desktop (Electron)
 * - Mobile (iOS/Android)
 * - Web
 * 
 * It uses the useElectron and useMobilePlatform hooks to detect the platform.
 * 
 * @example
 * ```tsx
 * <PlatformAware
 *   desktopContent={<p>This is only visible on desktop</p>}
 *   mobileContent={<p>This is only visible on mobile</p>}
 *   webContent={<p>This is only visible on web</p>}
 * >
 *   <p>This is visible on all platforms</p>
 * </PlatformAware>
 * ```
 */
export function PlatformAware({
  children,
  desktopContent,
  mobileContent,
  webContent,
  iosContent,
  androidContent,
  className = '',
}: PlatformAwareProps) {
  const { isElectron } = useElectron();
  const { isCapacitor, isIOS, isAndroid, isWeb } = useMobilePlatform();

  const renderPlatformSpecificContent = () => {
    // Desktop (Electron)
    if (isElectron && desktopContent) {
      return desktopContent;
    }
    
    // iOS
    if (isIOS && iosContent) {
      return iosContent;
    }
    
    // Android
    if (isAndroid && androidContent) {
      return androidContent;
    }
    
    // Mobile (any)
    if (isCapacitor && mobileContent) {
      return mobileContent;
    }
    
    // Web
    if (isWeb && webContent) {
      return webContent;
    }
    
    // No platform-specific content
    return null;
  };

  return (
    <div className={className}>
      {children}
      {renderPlatformSpecificContent()}
    </div>
  );
}

/**
 * Desktop - A component that only renders on desktop (Electron)
 */
export function Desktop({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { isElectron } = useElectron();
  
  if (!isElectron) return null;
  
  return <div className={className}>{children}</div>;
}

/**
 * Mobile - A component that only renders on mobile (iOS/Android)
 */
export function Mobile({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { isCapacitor } = useMobilePlatform();
  
  if (!isCapacitor) return null;
  
  return <div className={className}>{children}</div>;
}

/**
 * Web - A component that only renders on web
 */
export function Web({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { isElectron } = useElectron();
  const { isCapacitor } = useMobilePlatform();
  
  if (isElectron || isCapacitor) return null;
  
  return <div className={className}>{children}</div>;
}

/**
 * IOS - A component that only renders on iOS
 */
export function IOS({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { isIOS } = useMobilePlatform();
  
  if (!isIOS) return null;
  
  return <div className={className}>{children}</div>;
}

/**
 * Android - A component that only renders on Android
 */
export function Android({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { isAndroid } = useMobilePlatform();
  
  if (!isAndroid) return null;
  
  return <div className={className}>{children}</div>;
}
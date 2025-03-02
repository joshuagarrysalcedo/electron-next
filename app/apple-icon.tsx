import { ImageResponse } from 'next/og';
 
// Route segment config
export const runtime = 'edge';
 
// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';
 
// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(to bottom right, #0055FF, #00AAFF)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 24,
        }}
      >
        EN
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
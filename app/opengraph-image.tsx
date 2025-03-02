import { ImageResponse } from 'next/og';
 
// Route segment config
export const runtime = 'edge';
 
// Image metadata
export const alt = 'Electron Next App';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
// Image generation
export default async function OGImage() {
  // Font
  const interSemiBold = fetch(
    new URL('https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap')
  ).then((res) => res.arrayBuffer());
  
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          background: 'linear-gradient(to bottom right, #FFFFFF, #F0F0F0)',
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontFamily: 'Inter',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Electron Next App
        </div>
        <div
          style={{
            fontSize: 30,
            fontFamily: 'Inter',
            color: '#444',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          A cross-platform application built with Electron and Next.js
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: await interSemiBold,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  );
}
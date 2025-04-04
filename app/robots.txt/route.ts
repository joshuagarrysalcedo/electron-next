import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(
    {
      robots: {
        rules: [
          {
            userAgent: '*',
            allow: '/',
          },
        ],
        sitemap: 'https://yourdomain.com/sitemap.xml',
      },
    },
    {
      headers: {
        'content-type': 'text/plain',
      },
    }
  );
}
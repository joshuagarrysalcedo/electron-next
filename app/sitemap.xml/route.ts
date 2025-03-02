import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(
    {
      urls: [
        {
          url: 'https://yourdomain.com',
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 1,
        },
        {
          url: 'https://yourdomain.com/dashboard',
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        },
      ],
    },
    {
      headers: {
        'content-type': 'application/xml',
      },
    }
  );
}
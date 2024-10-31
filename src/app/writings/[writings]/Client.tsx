'use client';

import React from 'react';
import Timeline from '@/components/blogs/Timeline';
import BlurImage from '@/components/blogs/BlurImage';

const components = { Timeline, BlurImage };

interface ClientBlogPostProps {
  children: React.ReactNode;
}

export default function ClientBlogPost({ children }: ClientBlogPostProps) {
  return (
    <>
      {children}
    </>
  );
}
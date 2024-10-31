'use client'

import React from 'react';

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
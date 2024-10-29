'use client';

import React from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Timeline from '@/components/blogs/Timeline';
import BlurImage from '@/components/blogs/BlurImage';
import CommentSection from '@/components/blogs/CommentSection';

const components = { Timeline, BlurImage };

interface ClientBlogPostProps {
  mdxSource: MDXRemoteSerializeResult;
  slug: string;
}

export default function ClientBlogPost({ mdxSource, slug }: ClientBlogPostProps) {
  return (
    <>
      <MDXRemote {...mdxSource} components={components} />
      <CommentSection postSlug={slug} />
    </>
  );
}
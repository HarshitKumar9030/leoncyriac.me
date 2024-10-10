"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Timeline from "@/components/blogs/Timeline";
import BlurImage from "@/components/blogs/BlurImage";
import CommentSection from "@/components/blogs/CommentSection";
import { useComments } from "@/hooks/useComments";

const MDXRemote = dynamic(
  () => import("next-mdx-remote").then((mod) => mod.MDXRemote),
  {
    ssr: false,
  }
);

const components = { Timeline, BlurImage };

interface ClientBlogPostProps {
  content: string;
  slug: string
}

export default function ClientBlogPost({ content, slug }: ClientBlogPostProps) {
  const [mdxSource, setMdxSource] = useState<any>(null);

  useEffect(() => {
    import("next-mdx-remote/serialize").then((mod) => {
      mod.serialize(content).then(setMdxSource);
    });
  }, [content]);

  if (!mdxSource) {
    return <div>Loading...</div>;
  }

  return (
    
    <>
      <MDXRemote {...mdxSource} components={components} />
      <CommentSection
        postSlug={slug}
      />
    </>
  );
}

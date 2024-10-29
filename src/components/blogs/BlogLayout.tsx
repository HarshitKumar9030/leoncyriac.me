'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link, { LinkProps } from 'next/link';
import { MDXProvider } from '@mdx-js/react';
import TableOfContents from './TableOfContents';
import {
  Clock,
  Eye,
  Calendar,
  ThumbsUp,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/custom/button';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface FrontMatter {
  title: string;
  date: string;
  readingTime: string;
  image: string;
}

interface BlogLayoutProps {
  children: React.ReactNode;
  frontMatter: FrontMatter;
}

const components = {
  img: (props: React.ComponentProps<typeof Image>) => (
    <div className="relative w-full h-64 my-8">
      <Image
        {...props}
        fill
        style={{ objectFit: 'cover' }}
        className="rounded-lg"
        loading="lazy"
        placeholder="blur"
        blurDataURL="/placeholder.png"
      />
    </div>
  ),
  a: (props: LinkProps & { children: React.ReactNode }) => (
    <Link
      {...props}
      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
    >
      {props.children}
    </Link>
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className="text-2xl font-bold mt-8 mb-4 text-zinc-800 dark:text-zinc-200"
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className="text-xl font-semibold mt-6 mb-3 text-zinc-800 dark:text-zinc-200"
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="mb-4 text-zinc-600 dark:text-zinc-400" />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      className="list-disc list-inside mb-4 text-zinc-600 dark:text-zinc-400"
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      className="list-decimal list-inside mb-4 text-zinc-600 dark:text-zinc-400"
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic my-4 text-zinc-600 dark:text-zinc-400"
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      className="bg-zinc-100 dark:bg-zinc-800 rounded px-1 py-0.5 text-sm text-zinc-800 dark:text-zinc-200"
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      {...props}
      className="bg-zinc-100 dark:bg-zinc-800 rounded p-4 overflow-x-auto my-4"
    />
  ),
};

const MetaItem: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> =
  ({ icon, children }) => (
    <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
      {icon}
      <span className="ml-1">{children}</span>
    </div>
  );

export default function BlogLayout({
  children,
  frontMatter,
}: BlogLayoutProps) {
  const { data: session } = useSession();
  const [views, setViews] = useState<number>(0);
  const [likes, setLikes] = useState<string[]>([]);
  const [userHasLiked, setUserHasLiked] = useState<boolean>(false);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const pathname = usePathname();
  const slug = pathname ? pathname.split('/').pop() || '' : '';
  const { toast } = useToast();
  const didIncrementView = useRef(false);

  useEffect(() => {
    if (slug && !didIncrementView.current) {
      fetch(`/api/views/${slug}`, { method: 'POST' });
      didIncrementView.current = true;
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      const viewsRef = doc(db, 'views', slug);
      const unsubscribeViews = onSnapshot(viewsRef, (docSnap) => {
        const data = docSnap.data();
        setViews(data?.count || 0);
      });

      return () => {
        unsubscribeViews();
      };
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      const likesRef = doc(db, 'likes', slug);
      const unsubscribeLikes = onSnapshot(likesRef, (docSnap) => {
        const data = docSnap.data();
        const likesData = data?.likes || [];
        setLikes(likesData);
        if (session?.user?.email) {
          setUserHasLiked(likesData.includes(session.user.email));
        } else {
          setUserHasLiked(false);
        }
      });

      return () => {
        unsubscribeLikes();
      };
    }
  }, [slug, session]);

  // Fetch comments count
  useEffect(() => {
    if (slug) {
      const fetchCommentsCount = async () => {
        try {
          const res = await fetch(`/api/comments/count?slug=${slug}`);
          const data = await res.json();
          setCommentsCount(data.count || 0);
        } catch (error) {
          console.error('Error fetching comments count:', error);
        }
      };

      fetchCommentsCount();
    }
  }, [slug]);

  const handleLike = async () => {
    if (!session?.user?.email) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like posts.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const res = await fetch(`/api/likes/${slug}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update like status.');
      }
      const likesData = data.likes || [];
      setLikes(likesData);
      setUserHasLiked(likesData.includes(session.user.email));
    } catch (error) {
      console.error('Error in handleLike:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like status.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: frontMatter.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'The link has been copied to your clipboard.',
      });
    }
  };

  const handleCommentsClick = () => {
    const commentsSection = document.getElementById('comments');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = 'comments';
    }
  };

  return (
    <MDXProvider components={components}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              {frontMatter.title}
            </h1>
            <div className="flex items-center space-x-4 text-zinc-500 dark:text-zinc-400">
              <MetaItem icon={<Calendar className="w-4 h-4" />}>
                {formatDate(frontMatter.date)}
              </MetaItem>
              <MetaItem icon={<Clock className="w-4 h-4" />}>
                {frontMatter.readingTime} min read
              </MetaItem>
              <MetaItem icon={<Eye className="w-4 h-4" />}>
                {views} views
              </MetaItem>
            </div>
          </header>

          <div className="relative w-full h-[60vh] mb-8">
            <Image
              src={frontMatter.image}
              alt={frontMatter.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>

          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-4">
              <Button
                onClick={handleLike}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ThumbsUp
                  className={`w-4 h-4 ${userHasLiked ? 'text-neutral-500' : ''}`}
                />
                <span>{likes.length}</span>
              </Button>
              <Button
                onClick={handleCommentsClick}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{commentsCount}</span>
              </Button>
            </div>
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-3/4 lg:pr-8">
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                {children}
              </div>

              {/* Comments Section */}
              <section id="comments" className="mt-16">
                {/* Render your comments component here */}
                {/* <Comments postSlug={slug} /> */}
              </section>
            </div>

            <aside className="w-full lg:w-1/4 mt-8 lg:mt-0">
              <div className="sticky top-8">
                <TableOfContents />
              </div>
            </aside>
          </div>
        </article>
      </div>
    </MDXProvider>
  );
}

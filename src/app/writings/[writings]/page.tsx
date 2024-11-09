import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import BlogLayout from '@/components/blogs/BlogLayout';
import Timeline from '@/components/blogs/Timeline';
import BlurImage from '@/components/blogs/BlurImage';
import CommentSection from '@/components/blogs/CommentSection';
import { NewImage } from '@/components/blogs/NewImage';
import { Callout } from '@/components/blogs/Callout';
import Quote from '@/components/blogs/Quote';
import ClientBlogPost from './Client';

const components = { Timeline, BlurImage, Callout, Quote, NewImage };

interface BlogPostProps {
  params: {
    writings: string;
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/blogs'));
  return files.map((filename) => ({
    writings: filename.replace('.mdx', ''),
  }));
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { writings } = params;
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'src/blogs', `${writings}.mdx`),
    'utf-8'
  );
  const { data: frontMatter } = matter(markdownWithMeta);

  return {
    title: frontMatter.title,
    description: frontMatter.description,
    openGraph: {
      title: frontMatter.title,
      description: frontMatter.description,
      images: [{ url: frontMatter.image }],
    },
  };
}

export default async function ServerBlogPost({ params }: BlogPostProps) {
  const { writings } = params;
  const filePath = path.join(process.cwd(), 'src/blogs', `${writings}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { data: frontMatter, content } = matter(markdownWithMeta);

  const { content: mdxContent } = await compileMDX({
    source: content,
    components,
    options: {
      parseFrontmatter: true,
    },
  });

  return (
    // @ts-ignore
    <BlogLayout frontMatter={frontMatter}>
      <ClientBlogPost>
        {mdxContent}
      </ClientBlogPost>
      <CommentSection postSlug={writings} />
    </BlogLayout>
  );
}
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import BlogLayout from '@/components/blogs/BlogLayout';

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

export default async function BlogPost({ params }: BlogPostProps) {
  const { writings } = params;
  const filePath = path.join(process.cwd(), 'src/blogs', `${writings}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { data: frontMatter, content } = matter(markdownWithMeta);

  const mdxSource = await serialize(content);

  const ClientBlogPost = await import('./Client').then(mod => mod.default);

  return (
    // @ts-ignore
    <BlogLayout frontMatter={frontMatter}>
      <ClientBlogPost mdxSource={mdxSource} slug={writings} />
    </BlogLayout>
  );
}
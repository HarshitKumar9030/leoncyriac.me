import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { adminDB } from '@/lib/firebaseAdmin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const query = searchParams.get('q') || ''

  try {
    const blogsDirectory = path.join(process.cwd(), 'src/blogs')
    const files = await fs.readdir(blogsDirectory)
    
    const [viewsSnapshot, likesSnapshot, commentsSnapshot] = await Promise.all([
      adminDB.collection('views').get(),
      adminDB.collection('likes').get(),
      adminDB.collection('comments').get(),
    ])

    const viewsMap = new Map(viewsSnapshot.docs.map(doc => [doc.id, doc.data().count || 0]))
    const likesMap = new Map(likesSnapshot.docs.map(doc => [doc.id, doc.data().likes || []]))
    const commentsMap = new Map(commentsSnapshot.docs.map(doc => [doc.id, doc.data().count || 0]))

    const posts = await Promise.all(files
      .filter((filename) => filename.endsWith('.mdx'))
      .map(async (filename) => {
        const filePath = path.join(blogsDirectory, filename)
        const fileContents = await fs.readFile(filePath, 'utf8')
        const { data: frontMatter, content } = matter(fileContents)
        
        const slug = filename.replace('.mdx', '')
        const wordsPerMinute = 200
        const numberOfWords = content.split(/\s/g).length
        const readingTime = `${Math.ceil(numberOfWords / wordsPerMinute)} min read`
        
        return {
          id: slug,
          slug,
          title: frontMatter.title || '',
          description: frontMatter.description || '',
          image: frontMatter.image || '',
          date: frontMatter.date || '',
          readingTime,
          tags: frontMatter.tags ? frontMatter.tags.map((tag: string) => ({ id: tag, name: tag })) : [],
          views: viewsMap.get(slug) || 0,
          likes: likesMap.get(slug) || [],
          commentsCount: commentsMap.get(slug) || 0,
        }
      }))

    const sortedPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const filteredPosts = query
      ? sortedPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.description.toLowerCase().includes(query.toLowerCase()) ||
            post.tags.some((tag: { name: string }) => 
              tag.name.toLowerCase().includes(query.toLowerCase())
            )
        )
      : sortedPosts

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    return NextResponse.json({
      posts: paginatedPosts,
      hasMore: endIndex < filteredPosts.length,
    })
  } catch (error) {
    console.error('Error in posts API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
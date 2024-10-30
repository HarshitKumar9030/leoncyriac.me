import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { adminDB } from '@/lib/firebaseAdmin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const query = searchParams.get('q') || ''

  try {
    // Get blog posts from markdown files
    const blogsDirectory = path.join(process.cwd(), 'src/blogs')
    const files = fs.readdirSync(blogsDirectory)
    
    // Get metadata from Firebase Admin
    const [viewsSnapshot, likesSnapshot, commentsSnapshot] = await Promise.all([
      adminDB.collection('views').get(),
      adminDB.collection('likes').get(),
      adminDB.collection('comments').get(),
    ])

    const viewsMap = new Map()
    const likesMap = new Map()
    const commentsMap = new Map()

    viewsSnapshot.forEach((doc) => {
      viewsMap.set(doc.id, doc.data().count || 0)
    })

    likesSnapshot.forEach((doc) => {
      likesMap.set(doc.id, doc.data().likes || [])
    })

    commentsSnapshot.forEach((doc) => {
      commentsMap.set(doc.id, doc.data().count || 0)
    })

    const posts = files
      .filter((filename) => filename.endsWith('.mdx'))
      .map((filename) => {
        const filePath = path.join(blogsDirectory, filename)
        const fileContents = fs.readFileSync(filePath, 'utf8')
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
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Filter posts if search query exists
    const filteredPosts = query
      ? posts.filter(
          (post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.description.toLowerCase().includes(query.toLowerCase()) ||
            post.tags.some((tag: { name: string }) => 
              tag.name.toLowerCase().includes(query.toLowerCase())
            )
        )
      : posts

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
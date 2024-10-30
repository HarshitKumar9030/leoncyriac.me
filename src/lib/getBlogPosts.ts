interface BlogPost {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string;
    date: string;
    readingTime: string;
    tags: { id: string; name: string }[];
    views: number;
    likes: string[];
    commentsCount: number;
  }
  
  interface BlogPostsResponse {
    posts: BlogPost[];
    hasMore: boolean;
  }
  
  export async function getBlogPosts(page: number, postsPerPage: number, query: string): Promise<BlogPostsResponse> {
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=${postsPerPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }
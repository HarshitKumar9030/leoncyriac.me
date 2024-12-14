import nextMDX from '@next/mdx';

const withMDX = nextMDX({
    extension: /\.mdx?$/,
    options: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  })


/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/marathon',
            destination: 'https://www.youtube.com', 
            permanent: true,
          },
        ]
      },
    images: {
        remotePatterns: [{
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.myanimelist.net',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.crunchyroll.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                pathname: '/**',
            },
        ]
    }
};

export default withMDX(nextConfig);
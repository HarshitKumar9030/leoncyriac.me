/** @type {import('next').NextConfig} */
const nextConfig = {
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
        ]
    }
};

export default nextConfig;
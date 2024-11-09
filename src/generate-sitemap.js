import { writeFileSync, statSync } from 'fs';
import { join } from 'path';
import { globby } from 'globby';
import prettier from 'prettier';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WEBSITE_URL = 'https://www.leoncyriac.me';

async function generateSitemap() {
    console.log('Generating sitemap...');

    try {
        const pages = await globby([
            'app/**/page.tsx',
            'app/**/page.jsx',
            '!app/api/**/*',
            'blogs/**/*.mdx',           // Changed from writings to blogs
            '!blogs/*.draft.mdx',       // Changed from writings to blogs
            '!app/admin/**/*',
            '!app/**/loading.tsx',
            '!app/**/error.tsx',
            '!app/**/not-found.tsx',
            '!app/**/layout.tsx',
            '!.next/**/*',
            '!node_modules/**/*'
        ]);

        const sitemapEntries = await Promise.all(pages.map(async (page) => {
            const path = page
                .replace('app', '')
                .replace(/\/page\.tsx$|\/page\.jsx$/, '')
                .replace('blogs', '/writings')    // Replace blogs with /writings in the URL
                .replace(/\.mdx$/, '');

            // Skip dynamic routes and empty paths
            if (path.includes('[') || !path) {
                return '';
            }

            // Clean up the path to ensure proper URL format
            const cleanPath = path.startsWith('/') ? path : `/${path}`;
            
            const stats = statSync(page);
            const lastMod = new Date(stats.mtime).toISOString();

            let priority = '0.7';
            if (cleanPath === '/') {
                priority = '1.0';
            } else if (cleanPath.includes('/writings/')) {
                priority = '0.8';
            }

            let changefreq = 'monthly';
            if (cleanPath === '/') {
                changefreq = 'daily';
            } else if (cleanPath.includes('/writings/')) {
                changefreq = 'weekly';
            }

            return `
                <url>
                    <loc>${WEBSITE_URL}${cleanPath}</loc>
                    <lastmod>${lastMod}</lastmod>
                    <changefreq>${changefreq}</changefreq>
                    <priority>${priority}</priority>
                </url>`;
        }));

        const sitemap = `
            <?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${sitemapEntries.join('')}
            </urlset>`;

        const formatted = await prettier.format(sitemap, {
            parser: 'html',
            printWidth: 120,
            htmlWhitespaceSensitivity: 'ignore'
        });

        writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), formatted);
        console.log('Sitemap generated successfully!');

    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap().catch((err) => {
    console.error('Error generating sitemap:', err);
    process.exit(1);
});
export default async function handler(req, res) {
    try {
        const dbUrl = 'https://firestore.googleapis.com/v1/projects/photocollection-aaacb/databases/(default)/documents:runQuery';
        
        // Fetch published articles
        const response = await fetch(dbUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'car-rental-articles' }],
                    where: {
                        fieldFilter: {
                            field: { fieldPath: 'published' },
                            op: 'EQUAL',
                            value: { booleanValue: true }
                        }
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Firestore query failed: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Google's REST API returns an array of documents, some might not have 'document' if empty result
        const articles = data.filter(item => item.document).map(item => {
            const fields = item.document.fields;
            return {
                slug: fields.slug?.stringValue || '',
                updatedAt: fields.updatedAt?.timestampValue,
                createdAt: fields.createdAt?.timestampValue
            };
        });

        const now = new Date().toISOString();
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Static URLs
        xml += `  <url>\n    <loc>https://www.travthru.com/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        xml += `  <url>\n    <loc>https://www.travthru.com/articles</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

        // Dynamic Article URLs
        articles.forEach(article => {
            if (article.slug) {
                const lastmod = article.updatedAt || article.createdAt || now;
                xml += `  <url>\n    <loc>https://www.travthru.com/articles/${article.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
            }
        });
        
        xml += `</urlset>`;

        res.setHeader('Content-Type', 'text/xml');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400'); // Cache for 1 hour
        res.status(200).send(xml);
    } catch (error) {
        console.error('Error generating dynamic sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
}

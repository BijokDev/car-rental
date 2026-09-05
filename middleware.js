export const config = {
  matcher: '/articles/:slug',
};

export default async function middleware(req) {
  const url = new URL(req.url);
  const slug = url.pathname.split('/').filter(Boolean).pop();

  try {
    // 1. Fetch the actual article from Firestore REST API
    const dbUrl = 'https://firestore.googleapis.com/v1/projects/photocollection-aaacb/databases/(default)/documents:runQuery';
    const dbResponse = await fetch(dbUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'car-rental-articles' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'slug' },
              op: 'EQUAL',
              value: { stringValue: slug }
            }
          },
          limit: 1
        }
      })
    });

    if (!dbResponse.ok) {
      return fetch(new URL('/index.html', req.url)); // Fallback
    }

    const data = await dbResponse.json();
    const docData = data[0]?.document?.fields;

    // If article not found, just serve normal index.html and let React router handle 404
    if (!docData) {
      return fetch(new URL('/index.html', req.url));
    }

    // Extract fields safely
    const title = docData.title?.stringValue || 'Travel Blog | TRAVTHRU';
    const excerpt = docData.excerpt?.stringValue || 'Discover tips, guides, and insights about transportation services in Malaysia with TRAVTHRU.';
    const image = docData.image?.stringValue || 'https://www.travthru.com/car-rental-images/alpharp.webp';
    const canonicalUrl = `https://www.travthru.com/articles/${slug}`;

    // 2. Fetch the base HTML
    // We rewrite the internal request to /index.html
    const htmlResponse = await fetch(new URL('/index.html', req.url));
    let html = await htmlResponse.text();

    // 3. String replacement for OG Tags and Meta Tags
    html = html.replace(/<title>.*?<\/title>/, `<title>${title} | TRAVTHRU</title>`);
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${excerpt}" />`);

    // Fix canonical - without this every article page inherits the homepage's canonical URL
    html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`);

    // Replace OG Tags
    html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title} | TRAVTHRU" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${excerpt}" />`);
    html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`);

    // Replace Twitter Tags
    html = html.replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${title} | TRAVTHRU" />`);
    html = html.replace(/<meta property="twitter:description" content=".*?" \/>/, `<meta property="twitter:description" content="${excerpt}" />`);
    html = html.replace(/<meta property="twitter:image" content=".*?" \/>/, `<meta property="twitter:image" content="${image}" />`);

    return new Response(html, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 's-maxage=600, stale-while-revalidate=3600' // Edge cache
      }
    });

  } catch (err) {
    console.error('Middleware error:', err);
    // Fallback to normal SPA flow
    return fetch(new URL('/index.html', req.url));
  }
}

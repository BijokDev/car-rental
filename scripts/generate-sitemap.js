import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyD1u9jVuJ2B9IAyZCvPvi2VFvEUXEL8EMw",
    authDomain: "photocollection-aaacb.firebaseapp.com",
    projectId: "photocollection-aaacb",
    storageBucket: "photocollection-aaacb.firebasestorage.app",
    messagingSenderId: "1098153185069",
    appId: "1:1098153185069:web:d3dfe08093d65662c88da4",
    measurementId: "G-RY04QP408L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const generateSitemap = async () => {
    try {
        console.log('Generating sitemap...');
        const q = query(collection(db, 'car-rental-articles'), where('published', '==', true));
        const snapshot = await getDocs(q);
        
        const articles = snapshot.docs.map(doc => doc.data());
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        // Static URLs
        xml += `  <url>\n    <loc>https://travthru.com/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        xml += `  <url>\n    <loc>https://travthru.com/articles</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        
        // Dynamic Article URLs
        articles.forEach(article => {
            if (article.slug) {
                // If the article has a specific last modified date we could use it, but skipping is fine
                xml += `  <url>\n    <loc>https://travthru.com/articles/${article.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
            }
        });
        
        xml += `</urlset>`;
        
        const outputPath = path.join(__dirname, '../public/sitemap.xml');
        fs.writeFileSync(outputPath, xml);
        
        console.log(`Successfully generated sitemap.xml with ${articles.length + 2} URLs.`);
        process.exit(0);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
};

generateSitemap();

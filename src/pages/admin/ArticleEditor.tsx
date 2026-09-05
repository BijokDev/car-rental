import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../lib/firebase';
import { uploadFile, getFileUrl } from '../../lib/storage';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Article } from '../../../types';
import { useAuth } from '../../context/AuthContext';
import { FileText, Copy, X, Info, ImageIcon, RefreshCw, Loader2, AlertCircle, Upload } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Article Templates for SEO
const ARTICLE_TEMPLATES = [
  {
    name: 'Airport Transfer',
    title: 'Airport Transfer from KLIA to [Location] - Premium Chauffeur Service',
    excerpt: 'Looking for reliable airport transfer from KLIA to [Location]? TRAVTHRU offers premium chauffeur services with fixed rates, no surge pricing, and professional drivers available 24/7.',
    content: `## Premium KLIA Airport Transfer Service

Arriving at Kuala Lumpur International Airport (KLIA) or KLIA2? Start your Malaysian journey with comfort and style with TRAVTHRU's premium airport transfer service to [Location].

## Why Choose TRAVTHRU?

- **Fixed Pricing** - No surge pricing or hidden fees
- **24/7 Availability** - We operate around the clock
- **Flight Tracking** - Our drivers monitor your flight
- **Professional Drivers** - Experienced and courteous
- **Premium Fleet** - Toyota Alphard, Hyundai Staria, Mercedes-Benz

## Airport Transfer Rates

| Vehicle | Price |
|---------|-------|
| Economy Sedan | RM90 |
| Standard MPV | RM180 |
| Premium MPV | RM300 |
| Luxury | RM350 |

## How to Book

WhatsApp us at +60107198186 with your flight details. We'll confirm within minutes!

## Service Areas

We cover all KL areas including Bukit Bintang, KLCC, Bangsar, Mont Kiara, and Petaling Jaya.`
  },
  {
    name: 'Genting Trip',
    title: 'Private Transfer to Genting Highlands - Comfortable Journey',
    excerpt: 'Planning a trip to Genting Highlands? TRAVTHRU provides comfortable private transfers with experienced drivers who know the mountain roads well.',
    content: `## Genting Highlands Private Transfer

Escape to the cool mountains of Genting Highlands with TRAVTHRU's private transfer service.

## Why Private Transfer to Genting?

- **Comfortable Journey** - Relax in our premium vehicles
- **Experienced Drivers** - Familiar with mountain roads
- **Door-to-Door Service** - Pickup from anywhere in KL
- **Flexible Timing** - Travel at your convenience

## Rates

| Vehicle | One Way | Round Trip |
|---------|---------|------------|
| Standard | RM180 | RM300 |
| Premium MPV | RM250 | RM400 |
| Luxury | RM350 | RM550 |

## What's Included

- Professional driver
- Toll charges
- Waiting time (up to 1 hour)
- Mineral water

## Book Now

WhatsApp: +60107198186`
  },
  {
    name: 'Corporate Service',
    title: 'Corporate Chauffeur Service in Kuala Lumpur - Professional Business Transport',
    excerpt: 'Need reliable corporate transportation in KL? TRAVTHRU offers professional chauffeur services for executives and business travelers.',
    content: `## Corporate Chauffeur Service

TRAVTHRU provides premium corporate transportation for businesses in Kuala Lumpur.

## Our Corporate Services

- **Executive Transfers** - Airport to hotel/office
- **Business Meetings** - Reliable point-to-point service
- **Corporate Events** - Group transportation
- **VIP Clients** - Impress important guests

## Benefits

- **Punctuality Guaranteed** - We understand time is money
- **Professional Drivers** - Well-groomed and courteous
- **Premium Fleet** - Mercedes-Benz, Toyota Alphard
- **Corporate Accounts** - Monthly billing available

## Contact Us

For corporate inquiries:
- WhatsApp: +60107198186
- Email: booking@travthru.com`
  }
];

interface ArticleEditorProps {
  onClose: () => void;
  editArticle?: Article | null;
}

// Configure DOMPurify to allow images and standard styling
const sanitizeOptions = {
  ADD_TAGS: ['img', 'iframe', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong', 'em', 'a', 'p', 'br', 'div'],
  ADD_ATTR: ['src', 'alt', 'title', 'class', 'width', 'height', 'target', 'href', 'rel', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'data-code']
};

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

const ArticleEditor: React.FC<ArticleEditorProps> = ({ onClose, editArticle }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingContentImage, setUploadingContentImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [contentImageError, setContentImageError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Parse markdown content with custom rendering
  const renderedContent = useMemo(() => {
    if (!content) {
      return '<p style="color: #9CA3AF; font-style: italic;">Start typing to see preview...</p>';
    }

    try {
      // Parse markdown to HTML
      let html = marked.parse(content) as string;
      
      // Add custom styling classes to code blocks for copy functionality
      html = html.replace(
        /<pre><code(.*?)>([\s\S]*?)<\/code><\/pre>/g,
        (match, attrs, code) => {
          const encodedCode = encodeURIComponent(code.replace(/<[^>]*>/g, ''));
          return `
            <div style="position: relative; margin: 1.5rem 0;">
              <button 
                class="copy-code-btn" 
                data-code="${encodedCode}"
                style="position: absolute; right: 8px; top: 8px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; opacity: 0.7; transition: opacity 0.2s;"
                onmouseover="this.style.opacity='1'" 
                onmouseout="this.style.opacity='0.7'"
              >
                Copy
              </button>
              <pre style="background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 0;"><code${attrs}>${code}</code></pre>
            </div>
          `;
        }
      );

      return DOMPurify.sanitize(html, sanitizeOptions);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return '<p style="color: red;">Error parsing markdown</p>';
    }
  }, [content]);

  // Load existing article data for editing
  useEffect(() => {
    if (editArticle) {
      setTitle(editArticle.title || '');
      setSlug(editArticle.slug || editArticle.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || '');
      setContent(editArticle.content || '');
      setExcerpt(editArticle.excerpt || '');
      setImage(editArticle.image || '');
    }
  }, [editArticle]);

  // Copy code button event listener
  useEffect(() => {
    const handleCopy = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('copy-code-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const code = decodeURIComponent(target.getAttribute('data-code') || '');
        if (code) {
          try {
            await navigator.clipboard.writeText(code);
            const originalText = target.innerText;
            target.innerText = 'Copied!';
            target.style.color = '#4ade80';
            setTimeout(() => {
              target.innerText = originalText;
              target.style.color = '#fff';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        }
      }
    };

    document.addEventListener('click', handleCopy);
    return () => document.removeEventListener('click', handleCopy);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUploadError(null);
      setUploading(true);
      try {
        const response = await uploadFile(e.target.files[0]);
        if (response.success && response.url) {
          setImage(response.url);
        } else {
          throw new Error(response.error || 'Upload failed');
        }
      } catch (error: any) {
        console.error("Upload failed", error);
        setImageUploadError(error.message || 'Image upload failed. Please try again.');
      } finally {
        setUploading(false);
        e.target.value = '';
      }
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setContentImageError(null);
    setUploadingContentImage(true);
    try {
      const response = await uploadFile(file);
      if (response.success && response.url) {
        const finalUrl = getFileUrl(response.url);
        const snippet = `![Image description](${finalUrl})`;
        
        // Insert at cursor position
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = content;
          const newText = text.substring(0, start) + snippet + text.substring(end);
          setContent(newText);
        } else {
          // Append to end
          setContent(prev => prev + '\n\n' + snippet);
        }
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error(err);
      setContentImageError(err.message || 'Content image upload failed. Please try again.');
    } finally {
      setUploadingContentImage(false);
      e.target.value = '';
    }
  };

  const handleSave = async (published: boolean) => {
    if (!title || !content) return alert("Title and Content are required");
    
    setSaving(true);
    try {
        const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const articleData: Partial<Article> = {
            title,
            slug: finalSlug,
            content,
            excerpt: excerpt || content.substring(0, 150) + '...',
            image,
            author: user?.displayName || 'Admin',
            published,
            updatedAt: serverTimestamp(),
        };

        if (editArticle?.id) {
          // Update existing article
          await updateDoc(doc(db, 'car-rental-articles', editArticle.id), articleData);
          alert("Article updated!");
        } else {
          // Create new article
          await addDoc(collection(db, 'car-rental-articles'), {
            ...articleData,
            createdAt: serverTimestamp(),
          });
          alert("Article saved!");
        }
        onClose();
    } catch (error) {
        console.error("Error saving article:", error);
        alert("Failed to save article");
    } finally {
        setSaving(false);
    }
  };

  const applyTemplate = (template: typeof ARTICLE_TEMPLATES[0]) => {
    setTitle(template.title);
    setSlug(template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    setExcerpt(template.excerpt);
    setContent(template.content);
    setShowTemplates(false);
  };

  // Helper function to insert text at cursor
  const insertAtCursor = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    const replacement = before + selectedText + after;
    
    setContent(content.substring(0, start) + replacement + content.substring(end));
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const showAIPromptModal = () => {
    const promptText = `I need you to write an SEO-optimized article for TRAVTHRU (https://www.travthru.com/) - a premium airport transfer and chauffeur service in Malaysia.

**ABOUT TRAVTHRU:**
- Premium airport transfers from KLIA/KLIA2 to anywhere in KL
- Private chauffeur services for business and leisure
- Fleet includes: Economy Sedan, Standard MPV, Premium MPV (Toyota Alphard, Hyundai Staria), and Luxury (Mercedes-Benz)
- 24/7 availability with flight tracking
- Fixed pricing, no surge charges
- WhatsApp booking: +60107198186

**STRICT FORMATTING RULES (Required for the CMS):**

1.  **Headings**:
    *   Main Title: \`# Title Here\` (H1) - Include location + service keywords
    *   Sections: \`## Section Name\` (H2)

2.  **Lists**: Use bullet points for features and benefits:
    \`- **Feature Name** - Description here\`

3.  **Tables**: For pricing, use markdown tables:
    \`| Vehicle | Price |\`
    \`|---------|-------|\`
    \`| Economy | RM90 |\`

4.  **Images**: \`![Description](https://example.com/image.jpg)\`

5.  **Blockquotes**: For testimonials or callouts:
    \`> "Great service!" - Customer\`

**SEO REQUIREMENTS:**
- Title must include: location name + "airport transfer" or "chauffeur service"
- Mention TRAVTHRU brand name 2-3 times naturally
- Include WhatsApp number (+60107198186) for booking
- Target keywords: KLIA transfer, airport taxi, private driver KL, executive chauffeur

**Task**: Write an article about: [INSERT TOPIC - e.g., "Airport Transfer from KLIA to Bangsar", "Wedding Car Rental in KL", "Corporate Chauffeur Service for Executives"]

**OUTPUT INSTRUCTION (CRITICAL):**
I need the **RAW MARKDOWN** code so I can copy-paste it.
Please output the **ENTIRE** article inside a single block using **FOUR BACKTICKS** (like this: \`\`\`\`markdown ... \`\`\`\`).
This ensures any inner formatting shows up correctly. Do not render the markdown.`;

    const modalId = 'ai-prompt-modal';
    const existing = document.getElementById(modalId);
    if (existing) return;

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            ✨ AI Assistant Prompt
          </h3>
          <button id="close-ai-modal" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <p class="text-sm text-gray-500 mb-4">
          Copy this text and paste it into ChatGPT/Claude to get perfect articles for your site.
        </p>
        <textarea id="ai-prompt-text" class="w-full h-48 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-700 resize-none mb-4" readonly>${promptText}</textarea>
        <div class="flex justify-end gap-2">
          <button id="copy-ai-prompt" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
            Copy Prompt
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-ai-modal')?.addEventListener('click', () => modal.remove());
    document.getElementById('copy-ai-prompt')?.addEventListener('click', () => {
      navigator.clipboard.writeText(promptText);
      const btn = document.getElementById('copy-ai-prompt');
      if (btn) {
        btn.innerText = 'Copied!';
        setTimeout(() => modal.remove(), 1000);
      }
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  };

  // Custom styles for the preview
  const previewStyles = `
    .article-preview h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; margin-top: 1.5rem; color: #111827; line-height: 1.2; }
    .article-preview h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 1.5rem; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
    .article-preview h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; color: #374151; }
    .article-preview h4 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; color: #4b5563; }
    .article-preview p { margin-bottom: 1rem; line-height: 1.75; color: #374151; }
    .article-preview ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
    .article-preview ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
    .article-preview li { margin-bottom: 0.5rem; line-height: 1.6; color: #374151; }
    .article-preview strong { font-weight: 700; color: #111827; }
    .article-preview em { font-style: italic; }
    .article-preview a { color: #2563eb; text-decoration: underline; }
    .article-preview a:hover { color: #1d4ed8; }
    .article-preview blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; margin: 1rem 0; background: #eff6ff; padding: 1rem; border-radius: 0 8px 8px 0; color: #1e40af; font-style: italic; }
    .article-preview code { background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 4px; font-family: monospace; font-size: 0.875rem; color: #dc2626; }
    .article-preview pre code { background: transparent; padding: 0; color: inherit; }
    .article-preview img { max-width: 100%; height: auto; border-radius: 12px; margin: 1rem 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .article-preview table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    .article-preview th, .article-preview td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
    .article-preview th { background: #f9fafb; font-weight: 600; }
    .article-preview tr:nth-child(even) { background: #f9fafb; }
    .article-preview hr { border: none; border-top: 2px solid #e5e7eb; margin: 2rem 0; }
  `;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      <style>{previewStyles}</style>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{editArticle ? 'Edit Article' : 'New Article'}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowTemplates(!showTemplates)} 
            className="flex items-center gap-1 px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
          >
            <FileText className="w-4 h-4" />
            Templates
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Templates */}
      {showTemplates && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-900 mb-3">📋 Article Templates</h3>
          <div className="grid gap-3">
            {ARTICLE_TEMPLATES.map((template, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-white rounded border">
                <div>
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-500">{template.title.substring(0, 50)}...</p>
                </div>
                <button
                  onClick={() => applyTemplate(template)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Copy className="w-3 h-3" />
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Title and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title *</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => {
                setTitle(e.target.value);
                if (!editArticle) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                }
              }} 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900" 
              placeholder="Airport Transfer from KLIA to Bukit Bintang"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={slug} 
                onChange={e => setSlug(e.target.value)} 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900" 
              />
              <button 
                type="button" 
                onClick={() => setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))}
                className="bg-gray-200 text-gray-500 hover:text-blue-600 px-3 rounded-lg flex items-center justify-center transition-colors" 
                title="Sync Slug with Title"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Featured Image</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={image} 
              onChange={e => setImage(e.target.value)} 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" 
              placeholder="https://... or upload below" 
              disabled={uploading}
            />
            <label
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium text-sm transition-all shadow-sm shrink-0 ${
                uploading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 cursor-pointer active:scale-95'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} className="text-gray-500" />
                  <span>Upload</span>
                </>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>

          {/* Error Banner for Featured Image */}
          {imageUploadError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-2 text-xs text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{imageUploadError}</span>
              </div>
              <button
                type="button"
                onClick={() => setImageUploadError(null)}
                className="text-red-400 hover:text-red-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Uploading progress card */}
          {uploading && (
            <div className="mt-2.5 p-3 rounded-xl bg-brand-50/80 border border-brand-200/70 max-w-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-900 mb-1.5">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600 shrink-0" />
                <span>Uploading featured image...</span>
              </div>
              <div className="w-full bg-brand-200/60 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-600 h-1.5 rounded-full w-full animate-pulse" />
              </div>
            </div>
          )}

          {/* Preview / Skeleton */}
          <div className="mt-3">
            {uploading ? (
              <div className="h-32 w-56 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50/50 flex flex-col items-center justify-center text-center p-3 animate-pulse shadow-sm">
                <Loader2 className="w-6 h-6 animate-spin text-brand-600 mb-1.5" />
                <span className="text-xs font-bold text-brand-900">Uploading Image</span>
                <span className="text-[10px] text-brand-500 mt-0.5">Please wait a moment...</span>
              </div>
            ) : image ? (
              <div className="relative group inline-block">
                <img
                  src={getFileUrl(image)}
                  alt="Featured Preview"
                  className="h-32 w-auto max-w-xs object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  title="Remove image"
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Excerpt (Short Description)</label>
          <textarea 
            value={excerpt} 
            onChange={e => setExcerpt(e.target.value)} 
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 resize-none" 
            placeholder="Looking for reliable airport transfer from KLIA? TRAVTHRU offers premium service..."
          />
        </div>

        {/* Content Editor with Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="flex flex-col h-full">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content (Markdown) *</label>
            
            {/* Content Image Helper */}
            <div className="bg-gray-50 p-3.5 rounded-xl mb-2.5 border border-gray-200/80">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-gray-800">Content Image Helper</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Upload and automatically insert markdown image at cursor</p>
                </div>
                <label
                  className={`px-3.5 py-2 rounded-lg inline-flex items-center gap-2 text-xs font-semibold shadow-sm transition-all ${
                    uploadingContentImage
                      ? 'bg-blue-100 text-blue-700 cursor-not-allowed pointer-events-none'
                      : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer active:scale-95'
                  }`}
                >
                  {uploadingContentImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      <span>Inserting Image...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Insert Image at Cursor</span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleContentImageUpload}
                    disabled={uploadingContentImage}
                  />
                </label>
              </div>

              {contentImageError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs text-red-700">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{contentImageError}</span>
                  </div>
                  <button type="button" onClick={() => setContentImageError(null)} className="text-red-400 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Toolbar */}
            <div className="flex gap-2 mb-2 p-2 bg-gray-100 rounded-t-lg border border-gray-200 border-b-0 flex-wrap">
              <button 
                type="button" 
                onClick={() => insertAtCursor('**', '**', 'Bold text')}
                className="p-1 px-3 rounded hover:bg-gray-200 text-gray-700 font-bold" 
                title="Bold"
              >
                B
              </button>
              
              <button 
                type="button" 
                onClick={() => insertAtCursor('*', '*', 'Italic text')}
                className="p-1 px-3 rounded hover:bg-gray-200 text-gray-700 italic font-serif" 
                title="Italic"
              >
                I
              </button>

              <div className="w-px bg-gray-300 mx-1"></div>

              <button 
                type="button" 
                onClick={() => insertAtCursor('\n# ', '', 'Title')}
                className="p-1 px-3 rounded hover:bg-gray-200 text-gray-700 font-bold text-sm" 
                title="H1 Heading"
              >
                H1
              </button>

              <button 
                type="button" 
                onClick={() => insertAtCursor('\n## ', '', 'Section Heading')}
                className="p-1 px-3 rounded hover:bg-gray-200 text-gray-700 font-bold text-sm" 
                title="H2 Heading"
              >
                H2
              </button>

              <div className="w-px bg-gray-300 mx-1"></div>

              <button 
                type="button" 
                onClick={() => insertAtCursor('\n- ', '', 'List item')}
                className="p-1 px-3 rounded hover:bg-gray-200 text-gray-700" 
                title="Bullet List"
              >
                • List
              </button>

              <button 
                type="button" 
                onClick={() => insertAtCursor('\n1. ', '', 'List item')}
                className="p-1 px-3 rounded hover:bg-gray-200 text-gray-700" 
                title="Numbered List"
              >
                1. List
              </button>

              <button 
                type="button" 
                onClick={() => insertAtCursor('\n```js\n', '\n```\n', 'console.log("Code here");')}
                className="p-1 px-3 rounded hover:bg-gray-200 text-gray-700 font-mono text-xs border border-gray-300 flex items-center gap-1" 
                title="Code Block"
              >
                &lt;/&gt; Code
              </button>

              <button 
                type="button" 
                onClick={() => insertAtCursor('\n> ', '', 'Quote text')}
                className="p-1 px-3 rounded hover:bg-gray-200 text-gray-700" 
                title="Blockquote"
              >
                " Quote
              </button>

              <button 
                type="button" 
                onClick={() => insertAtCursor('[', '](https://)', 'Link text')}
                className="p-1 px-3 rounded hover:bg-gray-200 text-gray-700" 
                title="Link"
              >
                🔗 Link
              </button>

              <div className="flex-1"></div>
              
              {/* AI Prompt Button */}
              <button 
                type="button" 
                onClick={showAIPromptModal}
                className="p-1 px-3 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center gap-1 border border-indigo-200" 
                title="Get AI Prompt"
              >
                ✨ AI Prompt
              </button>
            </div>

            <textarea 
              id="content-editor"
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="flex-1 min-h-[400px] w-full bg-gray-50 border border-gray-200 rounded-b-lg px-4 py-2 text-gray-900 font-mono text-sm leading-relaxed border-t-0" 
              required 
              placeholder={`# Article Title

Write a compelling introduction here...

## First Section

Your content goes here. Use markdown formatting:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- Bullet points for lists

## Code Example

\`\`\`js
console.log('Hello World');
\`\`\`

> Use blockquotes for important callouts

[Link text](https://example.com) for clickable links

![Image description](https://example.com/image.jpg) for images`}
            />
          </div>

          {/* Live Preview */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-end mb-3">
              <label className="block text-xs font-bold text-gray-500 uppercase">Live Preview</label>
              <details className="relative group">
                <summary className="list-none cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span className="border-b border-dashed border-blue-600">Formatting Guide</span>
                </summary>
                <div className="absolute right-0 top-6 w-[420px] bg-white border border-gray-200 rounded-xl shadow-2xl p-5 z-50 text-gray-800">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                    <h5 className="font-bold text-lg">Markdown Guide</h5>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs">
                    <div>
                      <p className="font-bold text-gray-400 uppercase text-[10px] mb-2">Structure</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <code className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-mono text-xs whitespace-nowrap"># Title</code>
                          <span className="text-gray-500">Main Heading</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <code className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-mono text-xs whitespace-nowrap">## Subtitle</code>
                          <span className="text-gray-500">Section Heading</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <code className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-mono text-xs whitespace-nowrap">- Item</code>
                          <span className="text-gray-500">Bullet Point</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <code className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-mono text-xs whitespace-nowrap">1. Item</code>
                          <span className="text-gray-500">Numbered List</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-gray-400 uppercase text-[10px] mb-2">Style</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <code className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-mono text-xs whitespace-nowrap">**Bold**</code>
                          <span className="text-gray-500">Make text <strong>bold</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <code className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-mono text-xs whitespace-nowrap">*Italic*</code>
                          <span className="text-gray-500">Make text <em>italic</em></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <code className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-mono text-xs whitespace-nowrap">&gt; Quote</code>
                          <span className="text-gray-500">Callout box</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <code className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-mono text-xs whitespace-nowrap">[Text](url)</code>
                          <span className="text-gray-500">Clickable Link</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-bold text-blue-600 mb-2 text-xs uppercase">Code & Images</p>
                    <div className="space-y-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <code className="text-blue-600 font-mono">```js</code><br/>
                        <code className="text-gray-600 font-mono">console.log("code");</code><br/>
                        <code className="text-blue-600 font-mono">```</code>
                        <span className="text-gray-500 ml-2">→ Code block with copy button</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <code className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-mono text-xs">![Alt](url)</code>
                        <span className="text-gray-500">Insert image</span>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
            
            <div className="flex-1 min-h-[400px] w-full bg-white border border-gray-200 rounded-lg p-6 overflow-y-auto max-h-[600px]">
              <div 
                className="article-preview"
                dangerouslySetInnerHTML={{ __html: renderedContent }} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button 
            onClick={() => handleSave(false)}
            disabled={saving || uploading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={saving || uploading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : (editArticle ? 'Update & Publish' : 'Publish')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;

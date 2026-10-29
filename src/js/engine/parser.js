/**
 * Markdown to HTML Parser for Visual Preview with Fallback
 */

export function renderMarkdownToHtml(markdown) {
  if (!markdown) return '<p style="color: #64748b; text-align: center;">Isi form di sebelah kiri untuk melihat preview visual...</p>';

  let html = markdown;

  // 1. Tag Align Center / Left
  html = html.replace(/<h1 align="(.*?)">(.*?)<\/h1>/gi, '<h1 style="text-align: $1; color: #f9fafb; margin-bottom: 8px;">$2</h1>');
  html = html.replace(/<h3 align="(.*?)">(.*?)<\/h3>/gi, '<h3 style="text-align: $1; color: #9ca3af; font-weight: 400; margin-bottom: 16px;">$2</h3>');

  // 2. Headings Markdown
  html = html.replace(/^### (.*$)/gim, '<h3 style="color: #38bdf8; border-bottom: 1px solid #374151; padding-bottom: 6px; margin-top: 20px; margin-bottom: 12px;">$1</h3>');

  // 3. Bold Text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #38bdf8;">$1</strong>');

  // 4. List Items
  html = html.replace(/^- (.*$)/gim, '<li style="margin-left: 20px; color: #e2e8f0; margin-bottom: 6px;">$1</li>');

  // 5. Container Paragraph alignment
  html = html.replace(/<p align="(.*?)">/gi, '<div style="text-align: $1; margin: 12px 0; display: flex; flex-wrap: wrap; justify-content: $1; gap: 8px;">');
  html = html.replace(/<\/p>/gi, '</div>');

  // 6. Handling Image Fallback (Cegah gambar pecah)
  html = html.replace(/<img src="(.*?)" alt="(.*?)" \/>/gi, (match, src, alt) => {
    return `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.onerror=null; this.style.display='none'; this.insertAdjacentHTML('afterend', '<div style=\\'display:inline-flex; align-items:center; gap:8px; padding:12px 20px; background:#1e293b; border:1px solid #334155; border-radius:8px; color:#38bdf8; font-size:12px; margin:4px; font-weight:600;\\'>📊 Preview Widget: ${alt}</div>');" />`;
  });

  return html;
}
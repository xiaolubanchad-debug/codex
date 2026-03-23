export type EditorialBlockType = "paragraph" | "heading" | "quote" | "list" | "image";

export type EditorialBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; alt: string; src: string }
  | { type: "paragraph"; text: string };

const IMAGE_PATTERN = /^!\[(.*?)\]\((.*?)\)$/;
const HTML_TAG_PATTERN = /<[^>]+>/;

function normalizeBody(body: string) {
  return body.replace(/\r\n/g, "\n").trim();
}

function stripMarkup(line: string) {
  const imageMatch = line.match(IMAGE_PATTERN);

  if (imageMatch) {
    return imageMatch[1].trim();
  }

  return line
    .replace(/^###\s+/, "")
    .replace(/^##\s+/, "")
    .replace(/^>\s+/, "")
    .replace(/^[-*]\s+/, "")
    .trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function isHtmlContent(body: string) {
  return HTML_TAG_PATTERN.test(body);
}

export function getPlainTextFromBody(body: string) {
  const normalized = normalizeBody(body);

  if (!normalized) {
    return "";
  }

  if (isHtmlContent(normalized)) {
    return stripHtml(normalized).replace(/\s+/g, " ").trim();
  }

  return normalized
    .split("\n")
    .map(stripMarkup)
    .filter(Boolean)
    .join(" ");
}

export function estimateReadingTime(body: string) {
  const plainText = getPlainTextFromBody(body);
  const charCount = plainText.replace(/\s+/g, "").length;
  const minutes = Math.max(1, Math.ceil(charCount / 320));

  return `${minutes} 分钟`;
}

export function extractFirstImage(body: string) {
  const normalized = normalizeBody(body);

  if (!normalized) {
    return null;
  }

  if (isHtmlContent(normalized)) {
    const imageMatch = normalized.match(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>|<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*>|<img[^>]*src=["']([^"']+)["'][^>]*>/i);

    if (imageMatch) {
      const src = imageMatch[1] || imageMatch[4] || imageMatch[5] || "";
      const alt = imageMatch[2] || imageMatch[3] || "文章配图";
      return src ? { alt, src } : null;
    }

    return null;
  }

  const lines = normalized.split("\n");

  for (const line of lines) {
    const match = line.trim().match(IMAGE_PATTERN);

    if (match) {
      return {
        alt: match[1].trim() || "文章配图",
        src: match[2].trim(),
      };
    }
  }

  return null;
}

export function prependImageToBody(body: string, src: string, alt = "文章配图") {
  const normalized = normalizeBody(body);

  if (isHtmlContent(normalized)) {
    const imageHtml = `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" /><figcaption>${escapeHtml(alt)}</figcaption></figure>`;
    return normalized ? `${imageHtml}${normalized}` : `${imageHtml}<p>在这里开始撰写正文。</p>`;
  }

  const imageLine = `![${alt}](${src})`;

  if (!normalized) {
    return `${imageLine}\n\n在这里开始撰写正文。`;
  }

  return `${imageLine}\n\n${normalized}`;
}

export function buildExcerptFromBody(body: string, maxLength = 88) {
  const plainText = getPlainTextFromBody(body);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trim()}…`;
}

export function parseEditorialBody(body: string): EditorialBlock[] {
  const normalized = normalizeBody(body);

  if (!normalized || isHtmlContent(normalized)) {
    return [];
  }

  const chunks = normalized.split(/\n\s*\n/);
  const blocks: EditorialBlock[] = [];

  for (const chunk of chunks) {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      continue;
    }

    if (lines.length === 1) {
      const line = lines[0];
      const imageMatch = line.match(IMAGE_PATTERN);

      if (imageMatch) {
        blocks.push({
          type: "image",
          alt: imageMatch[1].trim() || "文章配图",
          src: imageMatch[2].trim(),
        });
        continue;
      }

      if (line.startsWith("### ")) {
        blocks.push({ type: "heading", level: 3, text: line.slice(4).trim() });
        continue;
      }

      if (line.startsWith("## ")) {
        blocks.push({ type: "heading", level: 2, text: line.slice(3).trim() });
        continue;
      }
    }

    if (lines.every((line) => line.startsWith("> "))) {
      blocks.push({
        type: "quote",
        text: lines.map((line) => line.slice(2).trim()).join("\n"),
      });
      continue;
    }

    if (lines.every((line) => line.startsWith("- ") || line.startsWith("* "))) {
      blocks.push({
        type: "list",
        items: lines.map((line) => line.slice(2).trim()),
      });
      continue;
    }

    blocks.push({
      type: "paragraph",
      text: lines.join(" "),
    });
  }

  return blocks;
}

export function bodyToHtml(body: string) {
  const normalized = normalizeBody(body);

  if (!normalized) {
    return "";
  }

  if (isHtmlContent(normalized)) {
    return normalized;
  }

  return parseEditorialBody(normalized)
    .map((block) => {
      if (block.type === "heading") {
        return block.level === 2
          ? `<h2>${escapeHtml(block.text)}</h2>`
          : `<h3>${escapeHtml(block.text)}</h3>`;
      }

      if (block.type === "quote") {
        return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
      }

      if (block.type === "list") {
        return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      }

      if (block.type === "image") {
        return `<figure><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" /><figcaption>${escapeHtml(block.alt)}</figcaption></figure>`;
      }

      return `<p>${escapeHtml(block.text)}</p>`;
    })
    .join("");
}

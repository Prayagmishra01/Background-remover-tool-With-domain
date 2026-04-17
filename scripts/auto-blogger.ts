/**
 * Fully Automated Blog Generation System
 * Execute using: npx tsx scripts/auto-blogger.ts
 */
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const contentDirectory = path.join(process.cwd(), 'content/blog');
const keywordBankPath = path.join(process.cwd(), 'scripts/keyword-bank.json');

// --- HELPER STRATEGIES ---

// We generate the slug, title, and file simultaneously based on one of the low KD keywords.
function getAvailableKeyword(): string {
  if (!fs.existsSync(keywordBankPath)) return "offline background remover tool";
  const keywordsStr = fs.readFileSync(keywordBankPath, 'utf8');
  let keywords: string[] = JSON.parse(keywordsStr);

  if (keywords.length === 0) {
    console.error("Keyword bank empty!");
    return "free background remover locally";
  }

  // Get first, remove it, save array
  const selected = keywords.shift() as string;
  fs.writeFileSync(keywordBankPath, JSON.stringify(keywords, null, 2));
  return selected;
}

function generateSlug(title: string): string {
    return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

async function generateBlogPost(keyword: string) {
    const prompt = `
    You are a cynical, highly-authoritative tech blogger who hates privacy-invading cloud services. 
    You are writing a blog post for the website promptcraftin.in, which is a 100% free, no-login, browser-local AI background remover.

    Your TARGET KEYWORD for SEO: "${keyword}"

    CRITICAL RULES:
    1. ZERO ROBOTIC FLUFF. DO NOT use words like: "realm, delving into, tapestry, bustling, in today's digital landscape, testament, crucial."
    2. Write with short, punchy sentences. Be direct.
    3. Length: ~1000 - 1200 words.
    4. Format strictly in Markdown. 
    5. Include exactly ONE H1 tag at the top (The Title).
    6. Include an engaging Hook introduction, H2s, H3s, bullet points, and real-life examples (e.g., e-commerce sellers, HR professionals).
    7. Naturally weave in internal linking context to "promptcraftin.in". Let them know there is a 100% local, no-upload tool ready to use today.
    8. Explain the technical "why" simply (e.g. WebAssembly, client-side caching instead of servers).

    Generate ONLY the raw Markdown text. Do not wrap in markdown blocks like \`\`\`markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        return response.text;
    } catch (error) {
        console.error("API Error generating blog post:", error);
        return null;
    }
}

// Extract Title from Markdown and process frontmatter
function processMarkdownToFile(rawMarkdown: string, keyword: string) {
    const lines = rawMarkdown.split('\n');
    let title = "Untitled Local Tech Blog";
    
    // Find the first H1 tag for the title
    const h1Index = lines.findIndex(line => line.startsWith('# '));
    if (h1Index !== -1) {
        title = lines[h1Index].replace('# ', '').trim();
        // Remove H1 from body since it will be in the Frontmatter / Next.js layout 
        lines.splice(h1Index, 1);
    }
    
    const slug = generateSlug(title);
    const date = new Date().toISOString().split('T')[0];
    
    // Generate a simple description
    const rawText = lines.join(' ').replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' ');
    const description = rawText.substring(0, 150).trim() + "...";

    const frontmatter = `---
title: "${title}"
description: "${description}"
date: "${date}"
slug: "${slug}"
primary_keyword: "${keyword}"
tags: ["Privacy", "AI Tools"]
---

`;

    const finalContent = frontmatter + lines.join('\n').trim();
    
    if (!fs.existsSync(contentDirectory)) {
        fs.mkdirSync(contentDirectory, { recursive: true });
    }

    const filePath = path.join(contentDirectory, `${slug}.md`);
    fs.writeFileSync(filePath, finalContent, 'utf8');
    
    console.log(`✅ Successfully generated and saved: ${slug}.md`);
    return slug;
}

// ---------------------------------
// The Job Scheduler / Main Method
// ---------------------------------
async function runAutoBlogger() {
    console.log("🚀 Starting Auto-Blog Generation Cycle...");
    const keyword = getAvailableKeyword();
    console.log(`🎯 Selected Keyword: "${keyword}"`);

    const markdown = await generateBlogPost(keyword);
    if (!markdown) {
        console.error("❌ Failed to generate content via Gemini.");
        return;
    }

    const newSlug = processMarkdownToFile(markdown, keyword);

    // If implementing Google Search Console Indexing API:
    console.log(`📡 Auto-publishing simulated. Triggering indexing ping for /blog/${newSlug} ...`);
    // Example: await pingGoogleIndexingAPI(`https://promptcraftin.in/blog/${newSlug}`);
    
    console.log("🏁 Cycle Complete.");
}

runAutoBlogger();

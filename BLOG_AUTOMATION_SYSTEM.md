# PromptCraft Automated Blogging System (P.A.B.S)

This document outlines the architecture, setup, and usage of the fully automated, localized SEO blogging pipeline designed specifically for `promptcraftin.in`.

## 1. System Architecture

The blogging system operates statically using Next.js, fueled by an automated Node.js generation script backed by the Gemini API.

*   **Content Directory:** `content/blog/` (All articles exist as static `.md` files).
*   **Routing System:** 
    *   `/app/blog/page.tsx`: Parses the directory, reads Frontmatter (`gray-matter`), and generates the `/blog` index.
    *   `/app/blog/[slug]/page.tsx`: Dynamically ingests the Markdown and converts to HTML via `react-markdown`.
*   **The Brain (`scripts/auto-blogger.ts`):** A standalone TypeScript script using the official Google Gen AI SDK. It pulls a curated, low-competition long-tail keyword out of a JSON bank, prompts Gemini with strict "Anti-AI-fluff" directives, constructs the Markdown with frontmatter, and auto-saves the file.
*   **Keyword Bank (`scripts/keyword-bank.json`):** Holds 30 hyper-targeted keywords. The bot consumes one per run.

## 2. The Humanization Layer (Critical)

Inside `scripts/auto-blogger.ts`, look at the `generateBlogPost()` function. We have hardcoded **Negative Constraint Prompting**:
> *"ZERO ROBOTIC FLUFF. DO NOT use words like: 'realm, delving into, tapestry, bustling, in today's digital landscape... Write with short, punchy sentences. Be direct. Write like a cynical tech blogger."*

By explicitly filtering out the syntactical structures Google's spam algorithms look for (long meandering introductions, the word 'delve', overly enthusiastic transitions), the generated Markdown passes beautifully as human-written technical guides.

## 3. Automation Workflow & Scheduling

To achieve the "3 posts per day" (Morning, Afternoon, Evening) goal without paying for constant cloud compute, you have two options:

### Option A: Vercel Cron Jobs (Recommended)
Because we are generating raw `.md` files prior to build-time, treating this as a Next.js Server Action running via regular cron is harder since Vercel builds are immutable. Instead, use Option B.

### Option B: GitHub Actions Auto-Commit (The Ultimate Free Setup)
We run the script inside a GitHub Action, let it generate the `.md` file, and commit it straight to the `main` branch. This triggers Vercel to auto-rebuild your site instantly with the new blog post.

1.  Create a file `.github/workflows/auto-blog.yml` in your repo:
\`\`\`yaml
name: Generate Auto Blogs
on:
  schedule:
    - cron: '0 8 * * *'  # 8 AM (Morning)
    - cron: '0 14 * * *' # 2 PM (Afternoon)
    - cron: '0 20 * * *' # 8 PM (Evening)
jobs:
  generate-blog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install tsx @google/genai gray-matter
      - run: npx tsx scripts/auto-blogger.ts
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
      - name: Commit and push changes
        run: |
          git config --global user.name "Auto Blogger"
          git config --global user.email "bot@promptcraftin.in"
          git add content/blog/ scripts/keyword-bank.json
          git commit -m "chore: auto-published new blog post" || echo "No changes to commit"
          git push
\`\`\`

When this fires, new articles populate `promptcraftin.in/blog` automatically 3 times a day.

## 4. Indexing Automation (Google Search Console)

Whenever a new Markdown file is merged via the GitHub Action, Vercel automagically regenerates `/app/sitemap.ts` with the new `/blog/slug` URL.

However, waiting for Googlebot can take weeks.
To force instant indexing:

1. Enable the **Google Indexing API** in Google Cloud Console.
2. Generate a Service Account JSON Key.
3. Inside the `scripts/auto-blogger.ts`, you would add a lightweight REST call firing the URL to the API:
\`\`\`javascript
const gscUrl = "https://indexing.googleapis.com/v3/urlNotifications:publish";
// Auth via JWT Service Account, then post: { url: "https://promptcraftin.in/blog/your-new-slug", type: "URL_UPDATED" }
\`\`\`
*(For now, it prints to the console as simulated).*

## 5. Internal Linking Engine

The Auto Blogger is instructed via prompt: *"Naturally weave in internal linking context to promptcraftin.in."*
Because the articles are explicitly written about local browser removal, every blog acts as a Top-of-Funnel (ToFu) net.
Notice inside `/app/blog/[slug]/page.tsx`, beneath every article is a hard-coded CTA:
**"Experience blazing fast offline background removal inside your browser -> Open Tool"** 
This drives link equity and user traffic straight to your root app page.

## Testing the System Right Now
Run the following locally:
\`\`\`bash
cd /app/applet
npm install tsx -g
export GEMINI_API_KEY="your-key-here"
npx tsx scripts/auto-blogger.ts
\`\`\`
Watch it pluck a keyword out of `keyword-bank.json`, write a localized markdown file into `content/blog/`, and become live instantly!

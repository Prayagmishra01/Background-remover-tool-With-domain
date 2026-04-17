# Error Tracking & Observability Setup (PromptCraft.in)

This document explains how the privacy-first error tracking system works and how to set up delivery channels (Telegram/Email/Database). 

## How the System Works
1. **`lib/errorTracker.ts`**: Intercepts front-end exceptions, strips out ALL image data (base64) and Windows/Unix file paths to maintain the strict privacy rule. 
2. **`components/ErrorBoundary.tsx`**: Catches React component rendering crashes and shows a clean, user-friendly fallback ("Something went wrong") over the complex stack trace.
3. **`app/api/telemetry/errors/route.ts`**: The central delivery pipeline. 

---

## 1. Setting up Telegram Alerts (Recommended)

Telegram is the absolute best way to receive instantaneous push notifications from your web app without paying for email infrastructure.

**Steps:**
1. Open Telegram and search for the `BotFather`.
2. Type `/newbot` and follow the prompts to create your bot.
3. Save the **HTTP API Token** you receive.
4. Send a message to your new bot (e.g., "Hello").
5. Go to `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` in your browser.
6. Look for the `"chat": {"id": 123456789}` inside the JSON response. That is your Chat ID.

**Add these to your environment variables (.env / Vercel):**
```env
TELEGRAM_BOT_TOKEN="your_bot_token_here"
TELEGRAM_CHAT_ID="your_chat_id_here"
```

The system will now automatically shoot instantaneous, clean messages to your phone whenever a user experiences a WebGL crash, out-of-memory error, or processing failure!

---

## 2. Setting up Email Alerts (Option C)

If you prefer Email summaries instead of Telegram alerts, you can enable Resend or SendGrid. 

**Steps for Resend (Free Tier):**
1. Sign up at [Resend.com](https://resend.com).
2. Get your API Key.
3. Install the Resend SDK: `npm install resend`
4. Update `/app/api/telemetry/errors/route.ts` with following logic:

```javascript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'errors@promptcraftin.in',
  to: 'your-email@gmail.com',
  subject: `[${payload.severity}] Error in ${payload.tool_stage}`,
  text: JSON.stringify(payload, null, 2)
});
```

---

## 3. Database & Dashboard Logging (Option A)

If traffic expands and Telegram gets too noisy, log directly to a MongoDB database to view inside an admin panel.

1. Setup MongoDB Atlas (Free).
2. Update `/app/api/telemetry/errors/route.ts` to `collection.insertOne(payload)`.
3. Create an internal route `promptcraftin.in/admin/errors` that pulls `DB.find()` inside a secured React Server Component table.

---

## 💡 How to use Google AI Studio for Debugging

When you eventually get an error alert (e.g. Canvas generation fails on Safari Mobile), here is how you use Google AI Studio to fix it instantly:

1. **Copy the JSON alert from Telegram.**
2. **Open your Google AI Studio Applet workspace.**
3. **Use the following prompt format:**

> "I received this error report from the background remover tool:
> [PASTE TELEGRAM OR JSON ALERT HERE]
> Can you investigate the file where this `last_action` took place, trace the stack, and apply a fix? Ensure the fix works for Safari mobile webGL implementations."

The Agent has total visibility to execute a `cat` on the crashing files and seamlessly author a patch directly in the project source.

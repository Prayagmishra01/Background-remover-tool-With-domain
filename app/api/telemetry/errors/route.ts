import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // --- NEW: Save JSON globally to a local file so you can read it easily ---
    try {
      const logFilePath = path.join(process.cwd(), 'latest-errors.log');
      const logEntry = `[${new Date().toISOString()}] ${JSON.stringify(payload, null, 2)}\n\n`;
      fs.appendFileSync(logFilePath, logEntry);
      console.log('🚨 NEW ERROR LOGGED TO: /latest-errors.log');
    } catch (fsErr) {
      console.error("Failed to write to local error log file", fsErr);
    }

    // 1. Send to Telegram using token provided. If no CHAT_ID, log that it's missing.
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || "8680525755:AAESgGKZSLf9MRpavQbHthM5QngMWgmrjtI";
    const telegramChatId = process.env.TELEGRAM_CHAT_ID || "6040436866";

    if (telegramBotToken && telegramChatId) {
      // Escape HTML characters for Telegram HTML parse_mode
      const escapeHtml = (text: string) => text ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "N/A";

      const actionHistoryList = payload.action_history 
        ? payload.action_history.map((a: string, i: number) => `${i + 1}. ${escapeHtml(a)}`).join('\n')
        : "None recorded";

      const message = `
🚨 <b>PROMPTCRAFT.IN SYSTEM CRASH</b> 🚨

<b>🕒 TIME:</b> <code>${escapeHtml(payload.timestamp)}</code>
<b>⚠️ SEVERITY:</b> <code>${escapeHtml(payload.severity.toUpperCase())}</code>
<b>⚙️ STAGE:</b> <code>${escapeHtml(payload.tool_stage.toUpperCase())}</code>

<b>🔴 ERROR MESSAGE:</b>
<pre>${escapeHtml(payload.error_message)}</pre>

<b>👤 USER ENVIRONMENT:</b>
• <b>Device:</b> <code>${escapeHtml(payload.device)}</code>
• <b>Resolution:</b> <code>${escapeHtml(payload.screen_resolution)}</code> (VP: <code>${escapeHtml(payload.viewport_size)}</code>)
• <b>Memory:</b> <code>${escapeHtml(payload.device_memory)}</code> (JS: <code>${escapeHtml(payload.memory_usage)}</code>)
• <b>Cores:</b> <code>${escapeHtml(payload.hardware_concurrency)}</code>
• <b>Network:</b> <code>${escapeHtml(payload.connection)}</code>
• <b>Browser:</b> <code>${escapeHtml(payload.browser)}</code>
• <b>Timezone:</b> <code>${escapeHtml(payload.timezone)}</code>

<b>📍 LOCATION & ACTIONS:</b>
• <b>URL:</b> <a href="${escapeHtml(payload.page_url)}">${escapeHtml(payload.page_url)}</a>
<b>User's Last 5 Context Actions:</b>
<pre>${actionHistoryList}</pre>

<b>🔍 STACK TRACE:</b>
<pre>${escapeHtml(payload.stack_trace).substring(0, 800)}${payload.stack_trace.length > 800 ? '\n...[TRUNCATED]' : ''}</pre>
      `;

      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'HTML'
        })
      }).catch(e => console.error("Telegram API Error", e));
    } else if (telegramBotToken && !telegramChatId) {
      console.warn("TELEGRAM_BOT_TOKEN found, but TELEGRAM_CHAT_ID is missing. Cannot send message to Telegram.");
    }

    // 2. Here you could optionally push to MongoDB, Firebase, or an Email API (like Resend).
    // For this privacy-first setup, Telegram is the recommended instantaneous, secure delivery 
    // mechanism that doesn't require setting up a bloated database just for logs.
    
    // Example for Resend/SMTP:
    // if (process.env.RESEND_API_KEY) {
    //    await sendEmail({ subject: "Error Alert", text: JSON.stringify(payload) })
    // }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to log telemetry" }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // 1. Send to Telegram if Token exists
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      const message = `
🚨 *PROMPTCRAFT.IN ERROR ALERT* 🚨

*Time:* \`${payload.timestamp}\`
*Stage:* ${payload.tool_stage.toUpperCase()}
*Severity:* ${payload.severity.toUpperCase()}

*Error Message:*
\`${payload.error_message}\`

*Last Action:* ${payload.action}
*URL:* ${payload.page_url}

*Device:* ${payload.device}
*Browser:* ${payload.browser}
      `;

      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'Markdown'
        })
      }).catch(e => console.error("Telegram API Error", e));
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

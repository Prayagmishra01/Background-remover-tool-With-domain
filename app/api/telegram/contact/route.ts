import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { source, message } = await req.json();

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      console.warn("Missing Telegram credentials to send feedback.");
      return NextResponse.json({ success: true, warning: 'Credentials missing' });
    }

    const text = `📬 <b>New User Inquiry</b>\n\n<b>Source:</b> ${source}\n<b>Message:</b>\n<pre>${message}</pre>`;

    await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text,
        parse_mode: 'HTML'
      })
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Telemetry error:", err);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}

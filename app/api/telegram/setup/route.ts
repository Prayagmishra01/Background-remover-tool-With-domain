import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN || "8680525755:AAESgGKZSLf9MRpavQbHthM5QngMWgmrjtI";
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await response.json();
    
    if (data.ok && data.result && data.result.length > 0) {
      // Find the most recent message
      const latestMessage = data.result[data.result.length - 1];
      const chatId = latestMessage.message?.chat?.id || latestMessage.my_chat_member?.chat?.id;
      const title = latestMessage.message?.chat?.first_name || latestMessage.message?.chat?.title || "Unknown Chat";
      
      return NextResponse.json({ 
        success: true, 
        message: "Successfully found your Chat ID!",
        your_chat_id: chatId,
        chat_name: title,
        instructions: "Copy the 'your_chat_id' number and paste it into to your Secrets/Environment Variables as 'TELEGRAM_CHAT_ID'. The error reporting system is fully integrated."
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "No messages found for this bot.",
        instructions: "Open Telegram, search for your bot (@True_Remove_background_bot), send it a message like 'hello', and then refresh this page to get your Chat ID."
      }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to connect to Telegram api", message: err.message }, { status: 500 });
  }
}

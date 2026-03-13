const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const body = req.body;
    if (!body || !body.message) return res.status(200).send('No message');

    const apiId = parseInt(process.env.API_ID);
    const apiHash = process.env.API_HASH;
    const session = new StringSession(process.env.TELEGRAM_SESSION);

    const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });
    
    try {
        await client.connect();
        const text = body.message.text;
        const chatId = body.message.chat.id;

        // Neural Logic would go here (similar to our Executive Loop)
        // For now, simple Ack
        console.log(`Received message from ${chatId}: ${text}`);

        return res.status(200).send('OK');
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    } finally {
        await client.disconnect();
    }
}

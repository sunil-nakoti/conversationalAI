const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyBl0Vv0c_81mun7TIqGwsYXnQaJRmrdBeo"); // Replace with your API Key

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    if (msg.from !== 'status@broadcast') {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `You are Riya, the smart receptionist for City Gym. Your goal is to get the user to book a Free Trial Session.
- Keep answers SHORT (under 40 words).
- Be polite and enthusiastic.
- If asked for price: ₹1500/month.
- If asked for timings: 6 AM to 10 PM.
- If they agree to a trial, ask for a time to visit.
Current message: ${msg.body}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            msg.reply(text);
        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            msg.reply('Sorry, I am having trouble connecting. Please try again later.');
        }
    }
});

client.initialize();

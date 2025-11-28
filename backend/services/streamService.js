const WebSocket = require('ws');
const { createClient } = require('@deepgram/sdk');
const { generateTTS } = require('./ttsService');

// TODO: Replace this with your actual agent logic, possibly by importing from another file.
async function generateAgentReply(options) {
  console.log("AGENT BRAIN:", options);
  // Example response for demonstration
  return "Hello! You said: " + options.userMessage;
}

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

function setupPlivoSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/streams/plivo' });

  wss.on('connection', (ws) => {
    console.log('New Plivo Call Connected');
    let streamSid = ""; 
    
    // 1. SETUP DEEPGRAM (The Ears)
    const deepgramLive = deepgram.listen.live({
      model: "nova-2",
      language: "en-IN", 
      encoding: "linear16", 
      sample_rate: 8000,
      smart_formatting: true,
      endpointing: 300
    });

    // 2. LISTEN TO PLIVO (Incoming Audio)
    ws.on('message', (message) => {
      const data = JSON.parse(message);

      if (data.event === 'start') {
        streamSid = data.streamId;
        console.log(`Stream Started: ${streamSid}`);
      }

      if (data.event === 'media') {
        const audioBuffer = Buffer.from(data.media.payload, 'base64');
        deepgramLive.send(audioBuffer);
      }
      
      if (data.event === 'stop') {
        console.log("Call Ended");
        deepgramLive.finish();
      }
    });

    // 3. LISTEN TO DEEPGRAM (Transcription)
    deepgramLive.on('TranscriptReceived', async (transcript) => {
      // This is deprecated, but the only way to get the transcript data.
      const data = JSON.parse(transcript);
      const userText = data.channel.alternatives[0].transcript;
      
      if (userText && data.is_final) {
        console.log(`User Said: ${userText}`);

        // A. GET INTELLIGENCE (Gemini Flash)
        const aiText = await generateAgentReply({
          userMessage: userText,
          playbook: "You are Rahul, a Real Estate agent. Goal: Book Site Visit...",
          persona: "Speak naturally in Indian English.",
          chatHistory: "", // TODO: Implement simple in-memory or DB history
          complianceRules: "No fake promises."
        });

        // B. GENERATE VOICE (Sarvam AI)
        const audioBase64 = await generateTTS(aiText, 'SARVAM');

        // C. SPEAK TO PLIVO
        const mediaMessage = {
          event: "media",
          streamId: streamSid,
          media: {
            payload: audioBase64,
            sampleRate: "8000",
            contentType: "audio/x-l16" // Linear PCM
          }
        };
        ws.send(JSON.stringify(mediaMessage));
      }
    });

    // Error Handling
    deepgramLive.on('error', (err) => console.error("Deepgram Error:", err));
    ws.on('close', () => {
        console.log('Plivo WebSocket closed.');
        deepgramLive.finish();
    });
  });

  console.log('Plivo WebSocket server is set up.');
}

module.exports = { setupPlivoSocket };

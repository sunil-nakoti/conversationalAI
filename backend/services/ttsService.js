const axios = require('axios');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { WaveFile } = require('wavefile');

// Initialize Google Client
const googleClient = new TextToSpeechClient();

async function generateSarvamTTS(text) {
  const response = await axios.post(
    'https://api.sarvam.ai/text-to-speech',
    {
      target_language_code: "en-IN",
      inputs: [text],
      speaker: "karun", // Options: "karun" (Male), "anushka" (Female)
      speech_sample_rate: 8000, // Matches Telephony
      enable_preprocessing: true,
      model: "bulbul:v2"
    },
    {
      headers: { 'api-subscription-key': process.env.SARVAM_API_KEY }
    }
  );

  // Sarvam returns a WAV file (with header). We need to strip the header for streaming.
  const base64Wav = response.data.audios[0];
  const wavBuffer = Buffer.from(base64Wav, 'base64');
  
  // Use WaveFile to parse and extract raw samples
  const wav = new WaveFile(wavBuffer);
  const rawSamples = wav.getSamples(false, Int16Array); // Get raw PCM samples
  
  // Convert back to Buffer
  const rawBuffer = Buffer.from(rawSamples.buffer);
  return rawBuffer.toString('base64');
}

async function generateGoogleTTS(text) {
  const [response] = await googleClient.synthesizeSpeech({
    input: { text: text },
    voice: { languageCode: 'en-IN', name: 'en-IN-Neural2-B' }, // Male Indian Voice
    audioConfig: { 
      audioEncoding: 'LINEAR16', // PCM format
      sampleRateHertz: 8000      // Telephony standard
    },
  });

  if (!response.audioContent) throw new Error("No audio content from Google");
  
  // Google returns raw audio content directly, just base64 encode it
  return Buffer.from(response.audioContent).toString('base64');
}

async function generateTTS(text, provider = 'SARVAM') {
  try {
    if (provider === 'SARVAM') {
      return await generateSarvamTTS(text);
    } else {
      return await generateGoogleTTS(text);
    }
  } catch (error) {
    console.error(`TTS Provider ${provider} failed, switching to Google.`, error);
    // Fallback to Google if Sarvam fails
    return await generateGoogleTTS(text);
  }
}

module.exports = { generateTTS };

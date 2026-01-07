import { TranscriptionResponse } from '../types';

const N8N_WEBHOOK_URL = 'https://n8n.srv965433.hstgr.cloud/webhook/d6809865-6310-4416-a351-3e14de3540cf';

export const sendAudioToN8n = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData();
  
  // Naming the file with .mp3 extension as a hint, though the blob might be webm/ogg depending on browser.
  // Most n8n binary nodes handle MIME type detection or conversion automatically.
  formData.append('file', audioBlob, 'recording.mp3');

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }

    // Try to parse JSON first
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data: TranscriptionResponse = await response.json();
      // Heuristic to find the text in the response object
      return data.text || data.transcription || data.output || data.message || JSON.stringify(data);
    } else {
      // Fallback to plain text
      return await response.text();
    }
  } catch (error) {
    console.error("Error sending to n8n:", error);
    throw error;
  }
};

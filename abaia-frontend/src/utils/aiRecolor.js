// src/utils/aiRecolor.js
// يستخدم Cloudinary بدلاً من MediaPipe لتلوين العباية — بدون WASM ولا WebGL

export async function loadSegmenter() {
  return true;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function recolorWithAI(imageUrl, targetHex) {
  const resp = await fetch(`${API_URL}/api/recolor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl, targetHex }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${resp.status}`);
  }

  const data = await resp.json();
  return data.url;
}

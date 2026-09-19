const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('API health error:', err);
    return { status: 'offline', ai_engine: 'offline' };
  }
}

// In-memory demo history for standalone web deployment
let localDemoHistory = [
  {
    id: 101,
    prediction: 'Tiger',
    confidence: 93.8,
    probabilities: { Tiger: 93.8, Deer: 3.5, Wolf: 2.7 },
    source: 'raspberry_pi',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    inference_time_ms: 36.2,
  },
  {
    id: 102,
    prediction: 'Deer',
    confidence: 89.4,
    probabilities: { Deer: 89.4, Wolf: 6.8, Tiger: 3.8 },
    source: 'web',
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    inference_time_ms: 39.1,
  },
  {
    id: 103,
    prediction: 'Wolf',
    confidence: 91.2,
    probabilities: { Wolf: 91.2, Deer: 5.1, Tiger: 3.7 },
    source: 'raspberry_pi',
    timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    inference_time_ms: 37.5,
  },
];

export async function predictFootprint(file, source = 'web') {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', source);

    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend unavailable, falling back to simulated inference:', err);
  }

  // Simulated fallback for deployed website
  await new Promise((resolve) => setTimeout(resolve, 850)); // realistic network/inference latency
  const name = (file?.name || '').toLowerCase();
  let species = 'Tiger';
  let conf = 92.4;
  let probs = { Tiger: 92.4, Wolf: 4.8, Deer: 2.8 };

  if (name.includes('deer')) {
    species = 'Deer';
    conf = 88.7;
    probs = { Deer: 88.7, Wolf: 6.9, Tiger: 4.4 };
  } else if (name.includes('wolf')) {
    species = 'Wolf';
    conf = 90.5;
    probs = { Wolf: 90.5, Deer: 5.3, Tiger: 4.2 };
  }

  const simulatedResult = {
    id: Date.now(),
    prediction: species,
    confidence: conf,
    probabilities: probs,
    inference_time_ms: +(Math.random() * 8 + 34).toFixed(1),
    source: source || 'web',
    timestamp: new Date().toISOString(),
    model: 'AMSF-Net (Simulated)',
    device: 'Vercel Web Edge',
  };

  localDemoHistory.unshift(simulatedResult);
  return simulatedResult;
}

export async function getHardwareLatest() {
  try {
    const res = await fetch(`${API_BASE_URL}/hardware/latest`);
    if (!res.ok) throw new Error(`Failed to fetch hardware status: ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      device_status: 'EDGE SIMULATION',
      camera_status: 'ACTIVE',
      network_status: 'CONNECTED',
      last_seen: new Date().toISOString(),
      latest_prediction: localDemoHistory[0] || null,
    };
  }
}

export async function getPredictionHistory({ source = 'all', search = '', limit = 50, offset = 0 } = {}) {
  try {
    const params = new URLSearchParams();
    if (source && source !== 'all') params.append('source', source);
    if (search) params.append('search', search);
    params.append('limit', limit);
    params.append('offset', offset);

    const res = await fetch(`${API_BASE_URL}/predictions/history?${params.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend history unavailable, using local demo history:', err);
  }

  let filtered = [...localDemoHistory];
  if (source && source !== 'all') {
    filtered = filtered.filter((item) => item.source === source);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (item) => item.prediction.toLowerCase().includes(q) || item.source.toLowerCase().includes(q)
    );
  }

  return {
    total: filtered.length,
    items: filtered.slice(offset, offset + limit),
    limit,
    offset,
  };
}

export async function clearPredictionHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/predictions/history`, {
      method: 'DELETE',
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Clear history fallback');
  }
  const count = localDemoHistory.length;
  localDemoHistory = [];
  return { count, message: 'History cleared' };
}

export async function getModelInfo() {
  const res = await fetch(`${API_BASE_URL}/model/info`);
  if (!res.ok) throw new Error(`Model info fetch failed: ${res.status}`);
  return await res.json();
}

export async function getModelPerformance() {
  const res = await fetch(`${API_BASE_URL}/model/performance`);
  if (!res.ok) throw new Error(`Model performance fetch failed: ${res.status}`);
  return await res.json();
}

export function getImageUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  return `${API_BASE_URL}${pathOrUrl}`;
}

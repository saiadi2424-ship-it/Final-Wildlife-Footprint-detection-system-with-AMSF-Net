import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { checkHealth, getHardwareLatest } from '../api/client';

const SystemContext = createContext();

export function SystemProvider({ children }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hardwareMode, setHardwareMode] = useState('live'); // 'live' | 'demo'
  const [apiHealth, setApiHealth] = useState({ status: 'checking', ai_engine: 'checking' });
  const [hardwareTelemetry, setHardwareTelemetry] = useState({
    device_status: 'WAITING FOR DEVICE',
    camera_status: 'WAITING',
    network_status: 'WAITING',
    last_seen: null,
    latest_prediction: null,
  });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  // Check API health
  const refreshHealth = useCallback(async () => {
    const health = await checkHealth();
    setApiHealth(health);
  }, []);

  // Poll hardware status
  const pollHardware = useCallback(async () => {
    if (hardwareMode === 'demo') {
      // Demo mode simulated telemetry
      setHardwareTelemetry({
        device_status: 'CONNECTED (SIMULATED)',
        camera_status: 'ACTIVE (SIMULATED)',
        network_status: 'CONNECTED (SIMULATED)',
        last_seen: new Date().toISOString(),
        latest_prediction: {
          id: 999,
          prediction: 'Tiger',
          confidence: 89.45,
          probabilities: { Deer: 4.12, Tiger: 89.45, Wolf: 6.43 },
          inference_time_ms: 38.5,
          source: 'raspberry_pi (simulated)',
          timestamp: new Date().toISOString(),
          model: 'AMSF-Net',
          device: 'Raspberry Pi 3 (Demo)',
        },
      });
      return;
    }

    // Live mode: fetch real backend state
    const data = await getHardwareLatest();
    setHardwareTelemetry(data);
  }, [hardwareMode]);

  // Initial and recurring poll
  useEffect(() => {
    refreshHealth();
    pollHardware();

    const healthInterval = setInterval(refreshHealth, 10000);
    const hardwareInterval = setInterval(pollHardware, 3000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(hardwareInterval);
    };
  }, [refreshHealth, pollHardware]);

  return (
    <SystemContext.Provider
      value={{
        activeTab,
        setActiveTab,
        hardwareMode,
        setHardwareMode,
        apiHealth,
        hardwareTelemetry,
        refreshHealth,
        pollHardware,
        toast,
        showToast,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}

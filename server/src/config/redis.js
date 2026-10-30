import EventEmitter from 'events';

// In-Memory Redis Mock Adapter for zero-dependency execution
class InMemoryRedis extends EventEmitter {
  constructor() {
    super();
    this.store = new Map();
    this.timers = new Map();
    this.isConnected = false;
    console.log('[Redis] Initialized High-Performance In-Memory Session & Dynamic Shift Timer Engine');
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && item.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, mode, duration) {
    let expiry = null;
    if (mode === 'EX' && duration) {
      expiry = Date.now() + duration * 1000;
    } else if (mode === 'PX' && duration) {
      expiry = Date.now() + duration;
    }
    this.store.set(key, { value, expiry });
    return 'OK';
  }

  async del(key) {
    return this.store.delete(key) ? 1 : 0;
  }

  async hset(hashKey, field, value) {
    let hash = this.store.get(hashKey)?.value;
    if (!hash || typeof hash !== 'object') {
      hash = {};
    }
    hash[field] = value;
    this.store.set(hashKey, { value: hash, expiry: null });
    return 1;
  }

  async hget(hashKey, field) {
    const hash = this.store.get(hashKey)?.value;
    return hash && field in hash ? hash[field] : null;
  }

  async hgetall(hashKey) {
    const hash = this.store.get(hashKey)?.value;
    return hash && typeof hash === 'object' ? { ...hash } : {};
  }

  // Real-time dynamic shift timer tracking
  startShiftTimer(shiftId, gigId, hourlyRate, startTime = Date.now()) {
    const timerData = {
      shiftId,
      gigId,
      hourlyRate,
      startTime,
      status: 'RUNNING',
      lastPing: Date.now()
    };
    this.store.set(`shift:timer:${shiftId}`, { value: timerData, expiry: null });
    return timerData;
  }

  getShiftTimer(shiftId) {
    const item = this.store.get(`shift:timer:${shiftId}`);
    if (!item) return null;
    const data = item.value;
    const elapsedSeconds = Math.floor((Date.now() - data.startTime) / 1000);
    const accruedPayout = parseFloat(((elapsedSeconds / 3600) * data.hourlyRate).toFixed(2));
    return {
      ...data,
      elapsedSeconds,
      elapsedFormatted: this.formatSeconds(elapsedSeconds),
      accruedPayout
    };
  }

  stopShiftTimer(shiftId) {
    const timer = this.getShiftTimer(shiftId);
    if (!timer) return null;
    this.store.delete(`shift:timer:${shiftId}`);
    return {
      ...timer,
      status: 'STOPPED',
      stopTime: Date.now()
    };
  }

  formatSeconds(sec) {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  }
}

export const redisClient = new InMemoryRedis();

export default redisClient;

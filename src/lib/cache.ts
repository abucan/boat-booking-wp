import type { TimeSlot } from '../types/booking';

interface CacheEntry {
  slots: TimeSlot[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

class TimeSlotCache {
  private cache: Map<string, CacheEntry> = new Map();

  getCacheKey(date: Date, routeId: string, tourType: string): string {
    return `${date.toISOString().split('T')[0]}-${routeId}-${tourType}`;
  }

  get(date: Date, routeId: string, tourType: string): TimeSlot[] | null {
    const key = this.getCacheKey(date, routeId, tourType);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if cache is still valid
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return entry.slots;
  }

  set(date: Date, routeId: string, tourType: string, slots: TimeSlot[]): void {
    const key = this.getCacheKey(date, routeId, tourType);
    this.cache.set(key, {
      slots,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const timeSlotCache = new TimeSlotCache();

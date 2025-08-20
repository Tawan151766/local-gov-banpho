// Utility functions for System Info
let systemInfoCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all system info from API with caching
 */
export async function getSystemInfo() {
  const now = Date.now();

  // Return cached data if still valid
  if (
    systemInfoCache &&
    cacheTimestamp &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return systemInfoCache;
  }

  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return {};
    }

    const response = await fetch("/api/system-info?active=true");
    const result = await response.json();

    if (result.success) {
      // Convert array to object for easier access
      const infoMap = {};
      result.data.forEach((item) => {
        infoMap[item.key] = item;
      });

      systemInfoCache = infoMap;
      cacheTimestamp = now;
      return infoMap;
    }
  } catch (error) {
    console.error("Error fetching system info:", error);
  }

  // Return empty object if failed
  return {};
}

/**
 * Get specific system info value by key
 */
export async function getSystemInfoValue(key, defaultValue = "") {
  const systemInfo = await getSystemInfo();
  return systemInfo[key]?.value || defaultValue;
}

/**
 * Get multiple system info values
 */
export async function getSystemInfoValues(keys) {
  const systemInfo = await getSystemInfo();
  const result = {};

  keys.forEach((key) => {
    result[key] = systemInfo[key]?.value || "";
  });

  return result;
}

/**
 * Clear cache (useful for admin updates)
 */
export function clearSystemInfoCache() {
  systemInfoCache = null;
  cacheTimestamp = null;
}

/**
 * Default system info values (fallback)
 */
export const DEFAULT_SYSTEM_INFO = {
  organization_name: "เทศบาลตำบลบ้านโพธิ์",
  phone: "038-123-456",
  email: "contact@banpho.go.th",
  address: "222 หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140",
  fax: "038-123-457",
  website: "https://banpho.go.th",
  facebook: "https://facebook.com/banpho.official",
  line_id: "@banpho_official",
  working_hours: "จันทร์ - ศุกร์ 08:30 - 16:30 น.",
  mayor_name: "นายสมชาย ใจดี",
};

/**
 * Get system info with fallback to defaults
 */
export async function getSystemInfoWithFallback(key) {
  const value = await getSystemInfoValue(key);
  return value || DEFAULT_SYSTEM_INFO[key] || "";
}

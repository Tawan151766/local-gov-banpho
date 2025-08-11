"use client";

import { useState, useEffect } from 'react';
import { getSystemInfo, getSystemInfoValue, getSystemInfoValues, DEFAULT_SYSTEM_INFO } from '@/lib/systemInfo';

/**
 * Hook to get all system info
 */
export function useSystemInfo() {
  const [systemInfo, setSystemInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSystemInfo();
        setSystemInfo(data);
        setError(null);
      } catch (err) {
        setError(err);
        setSystemInfo({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { systemInfo, loading, error };
}

/**
 * Hook to get specific system info value
 */
export function useSystemInfoValue(key, defaultValue = '') {
  const [value, setValue] = useState(defaultValue || DEFAULT_SYSTEM_INFO[key] || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchValue = async () => {
      try {
        setLoading(true);
        const result = await getSystemInfoValue(key, defaultValue || DEFAULT_SYSTEM_INFO[key]);
        setValue(result);
      } catch (error) {
        console.error(`Error fetching system info for key: ${key}`, error);
        setValue(defaultValue || DEFAULT_SYSTEM_INFO[key] || '');
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      fetchValue();
    }
  }, [key, defaultValue]);

  return { value, loading };
}

/**
 * Hook to get multiple system info values
 */
export function useSystemInfoValues(keys) {
  // Initialize with default values
  const initialValues = {};
  keys.forEach(key => {
    initialValues[key] = DEFAULT_SYSTEM_INFO[key] || '';
  });
  
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(true);

  // Convert keys array to string for stable dependency
  const keysString = JSON.stringify(keys);

  useEffect(() => {
    const fetchValues = async () => {
      try {
        setLoading(true);
        const result = await getSystemInfoValues(keys);
        
        // Add fallback values
        const valuesWithFallback = {};
        keys.forEach(key => {
          valuesWithFallback[key] = result[key] || DEFAULT_SYSTEM_INFO[key] || '';
        });
        
        setValues(valuesWithFallback);
      } catch (error) {
        console.error('Error fetching system info values:', error);
        // Set fallback values
        const fallbackValues = {};
        keys.forEach(key => {
          fallbackValues[key] = DEFAULT_SYSTEM_INFO[key] || '';
        });
        setValues(fallbackValues);
      } finally {
        setLoading(false);
      }
    };

    if (keys && keys.length > 0) {
      fetchValues();
    } else {
      setLoading(false);
    }
  }, [keys, keysString]); // Use string instead of array

  return { values, loading };
}
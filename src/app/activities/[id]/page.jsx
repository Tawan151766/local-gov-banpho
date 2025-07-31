"use client";
import React, { useState, useEffect, use } from "react";
import ActivityDetail from "../../component/Activities/ActivityDetail";

export default function ActivityPage({ params }) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Unwrap the params Promise
  const resolvedParams = use(params);

  useEffect(() => {
    if (resolvedParams.id) {
      fetchActivity(resolvedParams.id);
    }
  }, [resolvedParams.id]);

  const fetchActivity = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/posts/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setActivity(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch activity');
      }
    } catch (err) {
      console.error("Error fetching activity:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ActivityDetail 
        activity={activity} 
        loading={loading} 
        error={error} 
        onRetry={() => fetchActivity(resolvedParams.id)}
      />
    </div>
  );
}
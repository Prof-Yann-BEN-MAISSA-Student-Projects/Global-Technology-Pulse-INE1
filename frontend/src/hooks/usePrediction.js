import { useState, useEffect } from 'react';
import axios from 'axios';

export default function usePrediction(repoId) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!repoId) return;

    let isMounted = true;
    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:2500/api/projects/predictions/${encodeURIComponent(repoId)}`);
        if (isMounted) {
          setPrediction(response.data);
        }
      } catch (err) {
        console.error(`Error loading predictions for ${repoId}:`, err);
        if (isMounted) {
          setError(err.message || 'Failed to load predictions');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrediction();

    return () => {
      isMounted = false;
    };
  }, [repoId]);

  return { prediction, loading, error };
}

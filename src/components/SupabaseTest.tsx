import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function SupabaseTest() {
  const [version, setVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase
          .from('caregivers')
          .select('count')
          .limit(1);
        
        if (error) throw error;
        
        setVersion('Connection successful!');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An error occurred');
      }
    }

    checkConnection();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!version) return <div>Testing connection...</div>;
  return <div>{version}</div>;
}

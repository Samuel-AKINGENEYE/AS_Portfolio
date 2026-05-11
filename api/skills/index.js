import { supabase } from '../../lib/supabase.js';
import { setCors, handleOptions, verifyAdmin } from '../../lib/auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category')
        .order('order', { ascending: true, nullsFirst: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data: data ?? [] });
    }

    if (req.method === 'POST') {
      verifyAdmin(req);
      const { name, category, order } = req.body;
      const { data, error } = await supabase
        .from('skills')
        .insert({ name, category, order: order ?? 0 })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(401).json({ success: false, error: 'Unauthorized' });
    console.error('Skills error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

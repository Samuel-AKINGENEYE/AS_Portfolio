import { supabase } from '../../lib/supabase.js';
import { setCors, handleOptions, verifyAdmin } from '../../lib/auth.js';
import { toTimeline } from '../../lib/transform.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('start_date', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data: (data ?? []).map(toTimeline) });
    }

    if (req.method === 'POST') {
      verifyAdmin(req);
      const { institution, degree, field, start_date, startDate, end_date, endDate, current, description } = req.body;
      const { data, error } = await supabase
        .from('education')
        .insert({
          institution,
          degree,
          field,
          start_date: start_date ?? startDate,
          end_date: end_date ?? endDate,
          current: current ?? false,
          description,
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ success: true, data: toTimeline(data) });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(401).json({ success: false, error: 'Unauthorized' });
    console.error('Education error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

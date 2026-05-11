import { supabase } from '../../lib/supabase.js';
import { setCors, handleOptions, verifyAdmin } from '../../lib/auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  const { id } = req.query;

  try {
    verifyAdmin(req);

    if (req.method === 'PUT') {
      const { name, category, order } = req.body;
      const { data, error } = await supabase
        .from('skills')
        .update({ name, category, order })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(401).json({ success: false, error: 'Unauthorized' });
    console.error('Skill [id] error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

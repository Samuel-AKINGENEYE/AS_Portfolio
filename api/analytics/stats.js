import { supabase } from '../../lib/supabase.js';
import { setCors, handleOptions, verifyAdmin } from '../../lib/auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    verifyAdmin(req);
    const days = parseInt(req.query.days ?? '30', 10);
    const since = new Date(Date.now() - days * 86400000).toISOString();

    // Try to read from analytics table; fall back to empty stats if table missing
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false });

    if (error) {
      // Table doesn't exist — return zeros so dashboard doesn't crash
      return res.status(200).json({
        success: true,
        data: { totalViews: 0, uniqueVisitors: 0, events: [], days },
      });
    }

    const uniqueVisitors = new Set((data ?? []).map((r) => r.visitor_id)).size;
    const totalViews = (data ?? []).filter((r) => !r.event || r.event === 'page_view').length;

    return res.status(200).json({
      success: true,
      data: { totalViews, uniqueVisitors, events: data ?? [], days },
    });
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(401).json({ success: false, error: 'Unauthorized' });
    return res.status(500).json({ success: false, error: err.message });
  }
}

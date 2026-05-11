import { supabase } from '../../lib/supabase.js';
import { setCors, handleOptions } from '../../lib/auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { page, visitorId, event } = req.body;

    // Attempt to store in analytics table — silently skip if table doesn't exist yet
    await supabase.from('analytics').insert({
      page: page ?? '/',
      visitor_id: visitorId,
      event: event ?? 'page_view',
      created_at: new Date().toISOString(),
    }).then(() => {}).catch(() => {});

    return res.status(200).json({ success: true });
  } catch {
    return res.status(200).json({ success: true }); // never fail analytics
  }
}

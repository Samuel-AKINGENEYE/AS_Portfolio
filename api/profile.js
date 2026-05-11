import { supabase } from '../lib/supabase.js';
import { setCors, handleOptions, verifyAdmin } from '../lib/auth.js';
import { toProfile } from '../lib/transform.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('profiles').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      return res.status(200).json({ success: true, data: toProfile(data) });
    }

    if (req.method === 'PUT') {
      verifyAdmin(req);
      const { name, title, bio, location, email, avatar, resume_url, resumeUrl, social_links, socialLinks, availability } = req.body;

      // Fetch existing profile id first
      const { data: existing } = await supabase.from('profiles').select('id').single();
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Profile not found' });
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          name, title, bio, location, email, avatar,
          resume_url: resume_url ?? resumeUrl,
          social_links: social_links ?? socialLinks,
          availability,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json({ success: true, data: toProfile(data) });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(401).json({ success: false, error: 'Unauthorized' });
    console.error('Profile error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

import { supabase } from '../../lib/supabase.js';
import { setCors, handleOptions, verifyAdmin } from '../../lib/auth.js';
import { toProject } from '../../lib/transform.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  try {
    if (req.method === 'GET') {
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (req.query.featured === 'true') query = query.eq('featured', true);

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json({ success: true, data: (data ?? []).map(toProject) });
    }

    if (req.method === 'POST') {
      verifyAdmin(req);
      const { title, description, tech_stack, techStack, live_url, liveUrl, github_url, githubUrl, image_url, imageUrl, featured } = req.body;
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title,
          description,
          tech_stack: tech_stack ?? techStack ?? [],
          live_url: live_url ?? liveUrl,
          github_url: github_url ?? githubUrl,
          image_url: image_url ?? imageUrl,
          featured: featured ?? false,
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ success: true, data: toProject(data) });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(401).json({ success: false, error: 'Unauthorized' });
    console.error('Projects error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

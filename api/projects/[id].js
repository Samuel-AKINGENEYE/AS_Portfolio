import { supabase } from '../../lib/supabase.js';
import { setCors, handleOptions, verifyAdmin } from '../../lib/auth.js';
import { toProject } from '../../lib/transform.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  const { id } = req.query;

  try {
    verifyAdmin(req);

    if (req.method === 'PUT') {
      const { title, description, tech_stack, techStack, live_url, liveUrl, github_url, githubUrl, image_url, imageUrl, featured } = req.body;
      const { data, error } = await supabase
        .from('projects')
        .update({
          title,
          description,
          tech_stack: tech_stack ?? techStack,
          live_url: live_url ?? liveUrl,
          github_url: github_url ?? githubUrl,
          image_url: image_url ?? imageUrl,
          featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json({ success: true, data: toProject(data) });
    }

    if (req.method === 'DELETE') {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(401).json({ success: false, error: 'Unauthorized' });
    console.error('Project [id] error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

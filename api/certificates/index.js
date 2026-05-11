import { supabase } from '../../lib/supabase.js';
import { setCors, handleOptions, verifyAdmin } from '../../lib/auth.js';
import { toCertificate } from '../../lib/transform.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  try {
    if (req.method === 'GET') {
      let query = supabase.from('certificates').select('*').order('created_at', { ascending: false });
      if (req.query.category) query = query.eq('category', req.query.category);

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json({ success: true, data: (data ?? []).map(toCertificate) });
    }

    if (req.method === 'POST') {
      verifyAdmin(req);
      const { name, issuer, issue_date, issueDate, credential_url, credentialUrl, image_url, imageUrl, category } = req.body;
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          name,
          issuer,
          issue_date: issue_date ?? issueDate,
          credential_url: credential_url ?? credentialUrl,
          image_url: image_url ?? imageUrl,
          category: category ?? 'Other',
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ success: true, data: toCertificate(data) });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(401).json({ success: false, error: 'Unauthorized' });
    console.error('Certificates error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

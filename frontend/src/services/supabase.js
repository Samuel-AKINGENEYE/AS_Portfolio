import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Profile functions
export const getProfile = async () => {
  const { data, error } = await supabase.from('profiles').select('*').single();
  if (error) throw error;
  return data;
};

export const updateProfile = async (profile) => {
  const { data, error } = await supabase.from('profiles').update(profile).eq('id', profile.id);
  if (error) throw error;
  return data;
};

// Projects functions
export const getProjects = async (featured = false) => {
  let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (featured) query = query.eq('featured', true);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createProject = async (project) => {
  const { data, error } = await supabase.from('projects').insert(project).select();
  if (error) throw error;
  return data[0];
};

export const updateProject = async (id, project) => {
  const { data, error } = await supabase.from('projects').update(project).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteProject = async (id) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};

// Certificates functions
export const getCertificates = async () => {
  const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// Skills functions
export const getSkills = async () => {
  const { data, error } = await supabase.from('skills').select('*').order('category').order('order');
  if (error) throw error;
  return data;
};

// Education functions
export const getEducation = async () => {
  const { data, error } = await supabase.from('education').select('*').order('order').order('start_date', { ascending: false });
  if (error) throw error;
  return data;
};

// Experience functions
export const getExperience = async () => {
  const { data, error } = await supabase.from('experience').select('*').order('order').order('start_date', { ascending: false });
  if (error) throw error;
  return data;
};

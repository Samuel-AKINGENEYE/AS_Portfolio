// Maps Supabase snake_case columns to the camelCase fields the frontend expects.

export const toProject = (p) => !p ? null : {
  ...p,
  techStack: p.tech_stack ?? p.techStack ?? [],
  liveUrl: p.live_url ?? p.liveUrl ?? null,
  githubUrl: p.github_url ?? p.githubUrl ?? null,
  imageUrl: p.image_url ?? p.imageUrl ?? null,
};

export const toCertificate = (c) => !c ? null : {
  ...c,
  imageUrl: c.image_url ?? c.imageUrl ?? null,
  issueDate: c.issue_date ?? c.issueDate ?? null,
  credentialUrl: c.credential_url ?? c.credentialUrl ?? null,
};

export const toProfile = (p) => !p ? null : {
  ...p,
  resumeUrl: p.resume_url ?? p.resumeUrl ?? null,
  socialLinks: p.social_links ?? p.socialLinks ?? {},
  avatarUrl: p.avatar_url ?? p.avatarUrl ?? null,
  avatar: p.avatar ?? p.avatar_url ?? p.avatarUrl ?? null,
};

export const toTimeline = (item) => !item ? null : {
  ...item,
  startDate: item.start_date ?? item.startDate ?? null,
  endDate: item.end_date ?? item.endDate ?? null,
};

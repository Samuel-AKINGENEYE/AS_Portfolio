import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const ResumeButton = () => {
  const [profile, setProfile] = useState(null);
  const [trackResume, setTrackResume] = useState(() => () => {});

  useEffect(() => {
    // Fetch profile to get resume URL
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data.data));
  }, []);

  const handleDownload = () => {
    // Track download in analytics
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: '/', event: 'resume_download' })
    }).catch(() => {});
  };

  return (
    <a
      href={profile?.resumeUrl || '/resume.pdf'}
      download
      onClick={handleDownload}
      className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105"
    >
      <Download size={14} /> Resume
    </a>
  );
};

export default ResumeButton;

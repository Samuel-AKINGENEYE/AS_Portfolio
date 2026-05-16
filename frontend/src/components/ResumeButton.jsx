import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const ResumeButton = () => {
  const [profile, setProfile] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || 'https://samuel-ak-portfolio-api.onrender.com/api';
    fetch(`${base}/profile`)
      .then(res => res.json())
      .then(data => setProfile(data.data))
      .catch(() => {});
  }, []);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (downloading) return;

    const url = profile?.resumeUrl;
    if (!url) return;

    setDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'Samuel_AKINGENEYE_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: '/', event: 'resume_download' }),
    }).catch(() => {});
  };

  if (!profile?.resumeUrl) return null;

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      <Download size={14} /> {downloading ? 'Downloading…' : 'Resume'}
    </button>
  );
};

export default ResumeButton;

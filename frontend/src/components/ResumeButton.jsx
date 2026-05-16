import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const ResumeButton = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || 'https://samuel-ak-portfolio-api.onrender.com/api';
    fetch(`${base}/profile`)
      .then(res => res.json())
      .then(data => setProfile(data.data))
      .catch(() => {});
  }, []);

  const handleDownload = (e) => {
    e.preventDefault();
    if (!profile?.resumeUrl) return;
    // Add fl_attachment so Cloudinary sends Content-Disposition: attachment,
    // triggering a real browser download without any fetch/CORS complications.
    const url = profile.resumeUrl.includes('res.cloudinary.com')
      ? profile.resumeUrl.replace(/\/upload\/(?!fl_attachment)/, '/upload/fl_attachment/')
      : profile.resumeUrl;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Samuel_AKINGENEYE_Resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!profile?.resumeUrl) return null;

  return (
    <button
      onClick={handleDownload}
      className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105"
    >
      <Download size={14} /> Resume
    </button>
  );
};

export default ResumeButton;

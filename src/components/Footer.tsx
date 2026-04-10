const Footer = () => (
  <footer className="relative py-8 border-t border-border">
    <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Samuel AKINGENEYE. All rights reserved.</p>
    </div>

    <a
      href="https://wa.me/250790663921"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/25 ring-1 ring-white/10 border border-white/10 whatsapp-bubble"
      aria-label="Contact on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.472-.148-.672.149-.198.297-.768.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.672-1.615-.92-2.212-.242-.579-.487-.5-.672-.51l-.573-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347z" />
        <path d="M20.52 3.48A10.355 10.355 0 0 0 12 1.5C6.201 1.5 1.5 6.2 1.5 12a10.28 10.28 0 0 0 1.42 5.22L1.5 22.5l5.97-1.42A10.321 10.321 0 0 0 12 22.5c5.799 0 10.5-4.7 10.5-10.5 0-2.8-1.1-5.4-3.0-7.5zm-8.52 16.02c-1.82 0-3.61-.49-5.17-1.42l-.37-.22-3.54.84.89-3.46-.24-.36A8.312 8.312 0 0 1 3.75 12c0-4.57 3.73-8.25 8.25-8.25 2.2 0 4.27.86 5.82 2.41s2.41 3.62 2.41 5.84c0 4.56-3.73 8.25-8.25 8.25z" />
      </svg>
    </a>
  </footer>
);

export default Footer;

export default function Background() {
  return (
    <div
      className="fixed top-0 w-full h-screen -z-10 bg-cover bg-center"
      id="aura-image"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=3840&auto=format&fit=crop")',
        maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 50%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 50%, transparent)'
      }}
      data-alpha-mask="80"
    />
  );
}
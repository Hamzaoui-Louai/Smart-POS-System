export function PharmasphereLogoSVG() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
    >
      <circle cx="20" cy="20" r="18" fill="url(#gradient)" stroke="#2563EB" strokeWidth="2" />
      <path d="M20 8v24M12 16h16M14 24h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="20" r="3" fill="white" />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function PharmasphereLogoText() {
  return (
    <div className="flex items-center space-x-3">
      <PharmasphereLogoSVG />
      <span className="font-heading font-bold text-2xl text-gray-900 tracking-wide">Pharmasphere</span>
    </div>
  )
}

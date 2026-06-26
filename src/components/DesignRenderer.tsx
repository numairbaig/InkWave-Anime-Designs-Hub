import React from 'react';

interface DesignRendererProps {
  imageKey: string;
  className?: string;
  showBorder?: boolean;
}

export const DesignRenderer: React.FC<DesignRendererProps> = ({
  imageKey,
  className = "w-full h-full",
  showBorder = false
}) => {
  const borderClass = showBorder ? "border border-[#0d1400]" : "";

  // Safety guard for empty/missing imageKey
  if (!imageKey) {
    return (
      <div className={`${className} ${borderClass} bg-neutral-50 flex items-center justify-center text-xs text-neutral-400 font-mono`}>
        No Design
      </div>
    );
  }

  // Handle uploaded images (base64 data URL) or external links
  if (
    imageKey.startsWith('data:image/') ||
    imageKey.startsWith('http://') ||
    imageKey.startsWith('https://') ||
    imageKey.startsWith('/')
  ) {
    return (
      <img
        src={imageKey}
        alt="Design Artwork"
        className={`${className} ${borderClass} object-contain bg-white`}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Render highly-detailed, beautiful, and vector-perfect anime t-shirt designs
  switch (imageKey) {
    case 'samurai_crimson':
      return (
        <svg viewBox="0 0 400 400" width="100%" height="100%" className={`${className} ${borderClass} bg-white`} xmlns="http://www.w3.org/2000/svg">
          {/* Background Sun */}
          <circle cx="200" cy="180" r="100" fill="#ff2a3b" opacity="0.95" />
          
          {/* Wave/Cloud minimalist lines */}
          <path d="M 50 280 Q 120 250 200 280 T 350 280" stroke="#0d1400" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 80 300 Q 150 280 200 310 T 320 300" stroke="#0d1400" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />

          {/* Samurai Kabuto Silhouette */}
          <g fill="#0d1400">
            {/* Main helmet */}
            <path d="M 150 170 Q 200 130 250 170 Q 200 160 150 170 Z" />
            {/* Horns / Crest */}
            <path d="M 190 145 L 160 90 L 195 130 Z" />
            <path d="M 210 145 L 240 90 L 205 130 Z" />
            <circle cx="200" cy="140" r="8" fill="#ff2a3b" />
            {/* Face mask / Menpo */}
            <path d="M 165 170 C 165 210, 235 210, 235 170 C 200 185, 200 185, 165 170 Z" />
            {/* Mustache style */}
            <path d="M 175 180 Q 200 195 225 180 C 210 190, 190 190, 175 180 Z" fill="#ffffff" />
            {/* Neck guard / Shikoro */}
            <path d="M 150 175 L 135 200 L 160 195 Z" />
            <path d="M 250 175 L 265 200 L 240 195 Z" />
            {/* Katana behind shoulder */}
            <path d="M 120 280 L 280 120" stroke="#0d1400" strokeWidth="6" strokeLinecap="round" />
            <path d="M 260 140 L 290 110" stroke="#ff2a3b" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Japanese Kanji Texts */}
          <text x="310" y="100" fontFamily="serif" fontSize="24" fontWeight="bold" fill="#0d1400" writingMode="vertical-rl" letterSpacing="4">
            不屈
          </text>
          <text x="340" y="130" fontFamily="serif" fontSize="16" fill="#ff2a3b" writingMode="vertical-rl" opacity="0.8">
            サムライ
          </text>

          {/* Editorial frame/details */}
          <rect x="15" y="15" width="370" height="370" stroke="#0d1400" strokeWidth="1" fill="none" opacity="0.1" />
          <text x="30" y="360" fontFamily="monospace" fontSize="9" fill="#0d1400" letterSpacing="1" opacity="0.5">
            INKWAVE // DESIGN NO. 001
          </text>
        </svg>
      );

    case 'straw_hat_pirate':
      return (
        <svg viewBox="0 0 400 400" width="100%" height="100%" className={`${className} ${borderClass} bg-white`} xmlns="http://www.w3.org/2000/svg">
          {/* Background circle of ink drops */}
          <circle cx="200" cy="200" r="110" fill="none" stroke="#0d1400" strokeWidth="2" strokeDasharray="5 5" opacity="0.3" />
          
          {/* Splatters */}
          <circle cx="90" cy="110" r="12" fill="#0d1400" opacity="0.8" />
          <circle cx="290" cy="290" r="8" fill="#0d1400" />
          <circle cx="100" cy="280" r="6" fill="#0d1400" />
          <circle cx="310" cy="120" r="14" fill="#0d1400" opacity="0.75" />

          {/* Crossbones */}
          <g stroke="#0d1400" strokeWidth="18" strokeLinecap="round" opacity="0.95">
            <line x1="90" y1="90" x2="310" y2="310" />
            <line x1="310" y1="90" x2="90" y2="310" />
          </g>
          {/* Bone ends */}
          <g fill="#0d1400">
            <circle cx="85" cy="80" r="14" />
            <circle cx="75" cy="95" r="14" />
            <circle cx="315" cy="80" r="14" />
            <circle cx="325" cy="95" r="14" />
            <circle cx="85" cy="320" r="14" />
            <circle cx="75" cy="305" r="14" />
            <circle cx="315" cy="320" r="14" />
            <circle cx="325" cy="305" r="14" />
          </g>

          {/* Skull Base */}
          <path d="M 140 180 C 140 110, 260 110, 260 180 C 260 215, 235 240, 230 255 L 170 255 C 165 240, 140 215, 140 180 Z" fill="#0d1400" />
          {/* Teeth details */}
          <rect x="180" y="255" width="10" height="20" rx="3" fill="#ffffff" stroke="#0d1400" strokeWidth="3" />
          <rect x="195" y="255" width="10" height="20" rx="3" fill="#ffffff" stroke="#0d1400" strokeWidth="3" />
          <rect x="210" y="255" width="10" height="20" rx="3" fill="#ffffff" stroke="#0d1400" strokeWidth="3" />
          
          {/* Eye sockets (deep white cuts) */}
          <ellipse cx="175" cy="180" rx="16" ry="20" fill="#ffffff" />
          <ellipse cx="225" cy="180" rx="16" ry="20" fill="#ffffff" />
          
          {/* Nose cavity */}
          <path d="M 200 195 L 192 210 L 208 210 Z" fill="#ffffff" />

          {/* Straw Hat */}
          <g>
            {/* Straw Hat Crown */}
            <path d="M 145 130 C 150 70, 250 70, 255 130 Z" fill="#eab308" stroke="#0d1400" strokeWidth="5" />
            {/* Red Band */}
            <path d="M 144 120 Q 200 132 256 120 L 253 130 Q 200 142 147 130 Z" fill="#ef4444" stroke="#0d1400" strokeWidth="1" />
            {/* Straw Hat Brim */}
            <path d="M 100 135 Q 200 165 300 135 Q 270 120 100 135" fill="#facc15" stroke="#0d1400" strokeWidth="5" strokeLinecap="round" />
          </g>

          <text x="200" y="365" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#0d1400" textAnchor="middle" letterSpacing="4">
            THE GREAT PIRATE AGE
          </text>
        </svg>
      );

    case 'oni_mech':
      return (
        <svg viewBox="0 0 400 400" width="100%" height="100%" className={`${className} ${borderClass} bg-white`} xmlns="http://www.w3.org/2000/svg">
          {/* Dark grid background */}
          <path d="M 50 0 L 50 400 M 100 0 L 100 400 M 150 0 L 150 400 M 200 0 L 200 400 M 250 0 L 250 400 M 300 0 L 300 400 M 350 0 L 350 400" stroke="#0d1400" strokeWidth="0.5" opacity="0.08" />
          <path d="M 0 50 L 400 50 M 0 100 L 400 100 M 0 150 L 400 150 M 0 200 L 400 200 M 0 250 L 400 250 M 0 300 L 400 300 M 0 350 L 400 350" stroke="#0d1400" strokeWidth="0.5" opacity="0.08" />

          {/* Cyberpunk circular radar graphic */}
          <circle cx="200" cy="200" r="140" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.3" strokeDasharray="8 8" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="#aaff00" strokeWidth="1.5" opacity="0.4" />

          {/* Horns */}
          <path d="M 120 130 L 70 50 L 130 110 Z" fill="#0d1400" />
          <path d="M 115 110 L 80 65 L 120 100" stroke="#8b5cf6" strokeWidth="3" fill="none" />
          
          <path d="M 280 130 L 330 50 L 270 110 Z" fill="#0d1400" />
          <path d="M 285 110 L 320 65 L 280 100" stroke="#8b5cf6" strokeWidth="3" fill="none" />

          {/* Mech Face Structure */}
          {/* Main Helm */}
          <path d="M 120 140 L 280 140 L 290 200 L 250 290 L 150 290 L 110 200 Z" fill="#0d1400" />
          
          {/* Neon Purple Visor */}
          <path d="M 135 170 L 265 170 L 275 205 L 250 220 L 150 220 L 125 205 Z" fill="#8b5cf6" />
          
          {/* Tech Eyes Inside Visor */}
          <polygon points="150,185 175,185 180,195 155,195" fill="#aaff00" />
          <polygon points="250,185 225,185 220,195 245,195" fill="#aaff00" />

          {/* Face Panel lines */}
          <line x1="200" y1="140" x2="200" y2="290" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
          <polygon points="180,240 220,240 230,280 170,280" fill="#ffffff" opacity="0.9" />
          
          {/* Mech fangs (Oni theme) */}
          <polygon points="160,280 170,280 165,305" fill="#aaff00" />
          <polygon points="240,280 230,280 235,305" fill="#aaff00" />

          {/* Warning labels */}
          <rect x="25" y="325" width="105" height="18" fill="#aaff00" stroke="#0d1400" strokeWidth="1.5" />
          <text x="77" y="338" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#0d1400" textAnchor="middle">
            SYSTEM CAUTION // 01
          </text>
          
          <text x="370" y="340" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#0d1400" writingMode="vertical-rl" letterSpacing="2">
            鬼・機動
          </text>
        </svg>
      );

    case 'cursed_eyes':
      return (
        <svg viewBox="0 0 400 400" width="100%" height="100%" className={`${className} ${borderClass} bg-white`} xmlns="http://www.w3.org/2000/svg">
          {/* Distressed grunge border lines */}
          <rect x="30" y="30" width="340" height="340" stroke="#0d1400" strokeWidth="4" fill="none" />
          <rect x="38" y="38" width="324" height="324" stroke="#ff2a3b" strokeWidth="1.5" fill="none" />

          {/* Streetwear warning stamps */}
          <rect x="50" y="45" width="90" height="15" fill="#0d1400" />
          <text x="95" y="56" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle" letterSpacing="1">
            CURSED REALM
          </text>

          {/* Upper Eyes Pair */}
          <g>
            {/* Left Eye */}
            <path d="M 90 140 Q 130 110 170 140 Q 130 155 90 140 Z" fill="#0d1400" />
            <circle cx="130" cy="136" r="12" fill="#ff2a3b" />
            <circle cx="130" cy="136" r="5" fill="#0d1400" />
            <circle cx="132" cy="134" r="2" fill="#ffffff" />
            {/* Angry eyebrow */}
            <path d="M 85 115 L 175 132 L 170 137 L 85 125 Z" fill="#0d1400" />

            {/* Right Eye */}
            <path d="M 230 140 Q 270 110 310 140 Q 270 155 230 140 Z" fill="#0d1400" />
            <circle cx="270" cy="136" r="12" fill="#ff2a3b" />
            <circle cx="270" cy="136" r="5" fill="#0d1400" />
            <circle cx="272" cy="134" r="2" fill="#ffffff" />
            {/* Angry eyebrow */}
            <path d="M 315 115 L 225 132 L 230 137 L 315 125 Z" fill="#0d1400" />
          </g>

          {/* Lower Cursed Eyes Pair (representing Sukuna/four eyes theme) */}
          <g opacity="0.9">
            {/* Lower Left Eye */}
            <path d="M 105 210 Q 140 185 175 210 Q 140 222 105 210 Z" fill="#0d1400" />
            <circle cx="140" cy="207" r="9" fill="#ff2a3b" />
            <circle cx="140" cy="207" r="3" fill="#0d1400" />
            {/* Angry eyebrow */}
            <path d="M 100 190 L 175 204 L 170 208 L 100 196 Z" fill="#0d1400" />

            {/* Lower Right Eye */}
            <path d="M 225 210 Q 260 185 295 210 Q 260 222 225 210 Z" fill="#0d1400" />
            <circle cx="260" cy="207" r="9" fill="#ff2a3b" />
            <circle cx="260" cy="207" r="3" fill="#0d1400" />
            {/* Angry eyebrow */}
            <path d="M 300 190 L 225 204 L 230 208 L 300 196 Z" fill="#0d1400" />
          </g>

          {/* Tribal Tattoo markings between eyes */}
          <path d="M 195 120 L 205 120 L 205 230 L 195 230 Z" fill="#0d1400" />
          <path d="M 180 175 Q 200 185 220 175 Q 200 195 180 175" fill="#0d1400" />
          <circle cx="200" cy="245" r="7" fill="#ff2a3b" />

          {/* Distressed editorial text */}
          <text x="200" y="315" fontFamily="monospace" fontSize="18" fontWeight="bold" fill="#0d1400" textAnchor="middle" letterSpacing="6">
            領域展開
          </text>
          <text x="200" y="340" fontFamily="sans-serif" fontSize="10" fill="#ff2a3b" textAnchor="middle" letterSpacing="3">
            MALEVOLENT STREETWEAR STUDIO
          </text>
        </svg>
      );

    case 'chakra_seal':
      return (
        <svg viewBox="0 0 400 400" className={`${className} ${borderClass} bg-white`} xmlns="http://www.w3.org/2000/svg">
          {/* Red radial design spikes */}
          <g stroke="#ff2a3b" strokeWidth="2" opacity="0.3">
            <line x1="200" y1="50" x2="200" y2="350" />
            <line x1="50" y1="200" x2="350" y2="200" />
            <line x1="94" y1="94" x2="306" y2="306" />
            <line x1="306" y1="94" x2="94" y2="306" />
          </g>

          {/* Sacred Seal circular text path */}
          <circle cx="200" cy="200" r="130" fill="none" stroke="#0d1400" strokeWidth="3" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="#0d1400" strokeWidth="1" />

          {/* Four corner trigram stamps */}
          <g fill="#0d1400" transform="translate(200,200)">
            {/* Top right */}
            <path d="M 90 -90 L 110 -90 L 110 -70 L 90 -70 Z" />
            <line x1="75" y1="-75" x2="125" y2="-125" stroke="#0d1400" strokeWidth="2" />
            {/* Top left */}
            <path d="M -110 -90 L -90 -90 L -90 -70 L -110 -70 Z" />
            <line x1="-75" y1="-75" x2="-125" y2="-125" stroke="#0d1400" strokeWidth="2" />
            {/* Bottom right */}
            <path d="M 90 70 L 110 70 L 110 90 L 90 90 Z" />
            <line x1="75" y1="75" x2="125" y2="125" stroke="#0d1400" strokeWidth="2" />
            {/* Bottom left */}
            <path d="M -110 70 L -90 70 L -90 90 L -110 90 Z" />
            <line x1="-75" y1="75" x2="-125" y2="125" stroke="#0d1400" strokeWidth="2" />
          </g>

          {/* Main swirl seal */}
          <g fill="#0d1400">
            {/* Stylized spiral seal core */}
            <path d="M 200 200 
                     C 170 190, 160 220, 180 240
                     C 210 260, 250 220, 230 180
                     C 200 140, 130 160, 150 220
                     C 180 290, 290 270, 270 170
                     C 250 80, 90 110, 120 230
                     C 140 320, 310 320, 310 200" 
                  fill="none" stroke="#0d1400" strokeWidth="16" strokeLinecap="round" />
            <circle cx="200" cy="200" r="14" fill="#ff2a3b" />
          </g>

          {/* Kanji markings */}
          <text x="200" y="85" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#0d1400" textAnchor="middle">
            四象封印
          </text>
          <text x="200" y="330" fontFamily="monospace" fontSize="10" fill="#0d1400" textAnchor="middle" letterSpacing="4">
            EIGHT TRIGRAMS SEAL // ACTIVE
          </text>
        </svg>
      );

    case 'colossal_titan':
      return (
        <svg viewBox="0 0 400 400" className={`${className} ${borderClass} bg-white`} xmlns="http://www.w3.org/2000/svg">
          {/* Abstract steam rising */}
          <path d="M 80 180 Q 60 100 90 40" stroke="#0d1400" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
          <path d="M 120 150 Q 100 80 130 30" stroke="#0d1400" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M 280 150 Q 300 80 270 30" stroke="#0d1400" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M 320 180 Q 340 100 310 40" stroke="#0d1400" strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />

          {/* Titan head outline */}
          <path d="M 120 140 C 120 80, 280 80, 280 140 L 275 220 C 275 270, 250 290, 200 290 C 150 290, 125 270, 125 220 Z" fill="#0d1400" />

          {/* Exposed raw muscle stripes (red) */}
          <g fill="#ff2a3b">
            {/* Cheeks */}
            <path d="M 130 160 Q 150 200 135 240 Q 160 210 130 160 Z" />
            <path d="M 270 160 Q 250 200 265 240 Q 240 210 270 160 Z" />
            {/* Forehead bands */}
            <rect x="150" y="100" width="100" height="8" rx="2" />
            <rect x="160" y="112" width="80" height="6" rx="2" />
            {/* Nose bridge */}
            <polygon points="195,130 205,130 208,180 192,180" />
          </g>

          {/* Bone teeth grid */}
          <g stroke="#ffffff" strokeWidth="2" fill="none">
            {/* Jaw teeth line */}
            <path d="M 155 230 H 245" />
            <path d="M 155 242 H 245" />
            <line x1="165" y1="225" x2="165" y2="247" />
            <line x1="175" y1="225" x2="175" y2="247" />
            <line x1="185" y1="225" x2="185" y2="247" />
            <line x1="195" y1="225" x2="195" y2="247" />
            <line x1="205" y1="225" x2="205" y2="247" />
            <line x1="215" y1="225" x2="215" y2="247" />
            <line x1="225" y1="225" x2="225" y2="247" />
            <line x1="235" y1="225" x2="235" y2="247" />
          </g>

          {/* Deep vacant eye sockets */}
          <rect x="150" y="145" width="35" height="15" rx="5" fill="#ffffff" />
          <circle cx="168" cy="152" r="4" fill="#0d1400" />
          
          <rect x="215" y="145" width="35" height="15" rx="5" fill="#ffffff" />
          <circle cx="232" cy="152" r="4" fill="#0d1400" />

          {/* Typographic overlays */}
          <text x="200" y="340" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#0d1400" textAnchor="middle" letterSpacing="5">
            THE COLOSSAL BEAST
          </text>
          <text x="200" y="360" fontFamily="monospace" fontSize="9" fill="#ff2a3b" textAnchor="middle" letterSpacing="2">
            WALL ROSE // SHIGANSHINA DISTRICT
          </text>
        </svg>
      );

    case 'shinigami_apple':
      return (
        <svg viewBox="0 0 400 400" className={`${className} ${borderClass} bg-white`} xmlns="http://www.w3.org/2000/svg">
          {/* Gothic cross background */}
          <line x1="200" y1="40" x2="200" y2="320" stroke="#0d1400" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          <line x1="80" y1="120" x2="320" y2="120" stroke="#0d1400" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

          {/* Shinigami silhouette wings */}
          <g fill="#0d1400">
            {/* Left feather wing */}
            <path d="M 200 150 
                     C 170 120, 110 90, 60 130
                     C 80 160, 120 180, 150 180
                     C 120 190, 80 210, 90 230
                     C 120 225, 160 200, 180 190
                     C 160 210, 120 250, 130 265
                     C 150 250, 180 220, 200 190 Z" />
            
            {/* Right feather wing */}
            <path d="M 200 150 
                     C 230 120, 290 90, 340 130
                     C 320 160, 280 180, 250 180
                     C 280 190, 320 210, 310 230
                     C 280 225, 240 200, 220 190
                     C 240 210, 280 250, 270 265
                     C 250 250, 220 220, 200 190 Z" />

            {/* Shinigami Head */}
            <path d="M 185 140 Q 200 115 215 140 Q 200 160 185 140 Z" />
            {/* Spiky hair */}
            <path d="M 185 140 L 175 125 L 192 133 L 195 115 L 202 130 L 210 115 L 212 133 L 225 125 L 215 140 Z" />
          </g>

          {/* Pixel Art Red Apple */}
          <g transform="translate(175, 210)">
            {/* Apple shape using bento/pixel squares */}
            <rect x="15" y="0" width="20" height="5" fill="#15803d" stroke="#0d1400" strokeWidth="1" /> {/* leaf */}
            <rect x="20" y="5" width="5" height="10" fill="#0d1400" /> {/* stem */}
            
            <rect x="5" y="15" width="40" height="30" rx="6" fill="#ef4444" stroke="#0d1400" strokeWidth="3" />
            <rect x="12" y="20" width="8" height="8" rx="2" fill="#ffffff" opacity="0.8" /> {/* highlight */}
          </g>

          {/* Gothic border details */}
          <text x="200" y="325" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#0d1400" textAnchor="middle" letterSpacing="4">
            DEATH GODS
          </text>
          <text x="200" y="350" fontFamily="sans-serif" fontSize="10" fill="#ef4444" textAnchor="middle" letterSpacing="2">
            DO YOU VALUE APPLES?
          </text>
        </svg>
      );

    case 'nichirin_wave':
      return (
        <svg viewBox="0 0 400 400" className={`${className} ${borderClass} bg-white`} xmlns="http://www.w3.org/2000/svg">
          {/* Ukiyo-e circles frame */}
          <circle cx="200" cy="200" r="140" fill="none" stroke="#0d1400" strokeWidth="2" />
          
          {/* Sword blade crossing diagonally */}
          <g transform="rotate(35, 200, 200)">
            <rect x="50" y="193" width="300" height="14" fill="#e2e8f0" stroke="#0d1400" strokeWidth="3" />
            <line x1="50" y1="197" x2="350" y2="197" stroke="#94a3b8" strokeWidth="2" />
            {/* Guard */}
            <rect x="290" y="180" width="12" height="40" rx="3" fill="#ef4444" stroke="#0d1400" strokeWidth="3" />
            {/* Handle */}
            <rect x="302" y="186" width="60" height="28" fill="#0d1400" />
            <line x1="315" y1="186" x2="330" y2="214" stroke="#ffffff" strokeWidth="2" />
            <line x1="330" y1="186" x2="345" y2="214" stroke="#ffffff" strokeWidth="2" />
            <line x1="345" y1="186" x2="360" y2="214" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Wave body wrapping */}
          <path d="M 60 260 
                   Q 120 180, 200 240 
                   T 340 220 
                   Q 310 160, 250 160
                   C 190 160, 160 210, 120 190
                   C 90 170, 100 130, 140 100
                   C 80 120, 50 170, 60 260 Z" 
                fill="#3b82f6" stroke="#0d1400" strokeWidth="4" />
          
          {/* White wave caps & froth */}
          <g fill="#ffffff" stroke="#0d1400" strokeWidth="2">
            <circle cx="140" cy="100" r="10" />
            <circle cx="125" cy="110" r="8" />
            <circle cx="150" cy="105" r="7" />
            
            <circle cx="210" cy="155" r="9" />
            <circle cx="195" cy="160" r="7" />
            
            <circle cx="290" cy="175" r="11" />
            <circle cx="275" cy="185" r="8" />
          </g>

          {/* Calligraphy label */}
          <text x="310" y="100" fontFamily="serif" fontSize="24" fontWeight="bold" fill="#0d1400" writingMode="vertical-rl" letterSpacing="4">
            水の呼吸
          </text>
          
          <text x="200" y="370" fontFamily="monospace" fontSize="9" fill="#0d1400" textAnchor="middle" letterSpacing="3">
            NICHIRIN BLADE // FIRST STYLE
          </text>
        </svg>
      );

    case 'hollow_mask':
      return (
        <svg viewBox="0 0 400 400" className={`${className} ${borderClass} bg-white`} xmlns="http://www.w3.org/2000/svg">
          {/* Heavy black splatters */}
          <path d="M 60 120 Q 30 200 80 250 T 120 150 Z" fill="#0d1400" opacity="0.8" />
          <path d="M 340 160 Q 370 240 310 280 T 280 180 Z" fill="#0d1400" opacity="0.8" />

          {/* Mask Outline */}
          <path d="M 130 110 C 130 50, 270 50, 270 110 C 270 170, 250 250, 200 310 C 150 250, 130 170, 130 110 Z" fill="#ffffff" stroke="#0d1400" strokeWidth="6" />

          {/* Left half Hollow Red Stripes */}
          <path d="M 134 110 C 134 85, 200 75, 200 110 C 200 170, 150 230, 142 210 Z" fill="#ef4444" />
          <path d="M 145 75 Q 170 100 160 140" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 160 65 Q 185 90 180 120" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Ominous slit eyes */}
          <g>
            {/* Left Eye (black void with yellow center) */}
            <path d="M 155 155 Q 175 140 190 165 Q 170 175 155 155 Z" fill="#0d1400" stroke="#0d1400" strokeWidth="2" />
            <circle cx="173" cy="159" r="4" fill="#facc15" />

            {/* Right Eye */}
            <path d="M 245 155 Q 225 140 210 165 Q 230 175 245 155 Z" fill="#0d1400" stroke="#0d1400" strokeWidth="2" />
            <circle cx="227" cy="159" r="4" fill="#facc15" />
          </g>

          {/* Teeth slits across the bottom mask */}
          <g stroke="#0d1400" strokeWidth="4">
            <line x1="170" y1="230" x2="230" y2="230" />
            <line x1="180" y1="215" x2="180" y2="245" />
            <line x1="190" y1="215" x2="190" y2="245" />
            <line x1="200" y1="210" x2="200" y2="250" />
            <line x1="210" y1="215" x2="210" y2="245" />
            <line x1="220" y1="215" x2="220" y2="245" />
          </g>

          {/* Distressed details */}
          <text x="200" y="360" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#0d1400" textAnchor="middle" letterSpacing="4">
            THE HOLLOW WITHIN
          </text>
        </svg>
      );

    case 'power_level':
    default:
      return (
        <svg viewBox="0 0 400 400" className={`${className} ${borderClass} bg-white`} xmlns="http://www.w3.org/2000/svg">
          {/* Target HUD Grid */}
          <rect x="20" y="20" width="360" height="360" fill="none" stroke="#aaff00" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="160" fill="none" stroke="#aaff00" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="#aaff00" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="30" fill="none" stroke="#aaff00" strokeWidth="2" />
          <circle cx="200" cy="200" r="4" fill="#aaff00" />

          {/* Crosshairs */}
          <line x1="20" y1="200" x2="380" y2="200" stroke="#aaff00" strokeWidth="0.5" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="#aaff00" strokeWidth="0.5" />

          {/* Target brackets */}
          <path d="M 60 120 L 60 60 L 120 60" stroke="#0d1400" strokeWidth="4" fill="none" />
          <path d="M 340 120 L 340 60 L 280 60" stroke="#0d1400" strokeWidth="4" fill="none" />
          <path d="M 60 280 L 60 340 L 120 340" stroke="#0d1400" strokeWidth="4" fill="none" />
          <path d="M 340 280 L 340 340 L 280 340" stroke="#0d1400" strokeWidth="4" fill="none" />

          {/* Sci-Fi Readings */}
          <text x="70" y="95" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#0d1400">
            TARGET: KAKAROT
          </text>
          <text x="70" y="112" fontFamily="monospace" fontSize="9" fill="#0d1400" opacity="0.6">
            LOC: SECTOR 4-G
          </text>

          <text x="230" y="300" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#0d1400">
            SYS: STABLE
          </text>
          <text x="230" y="315" fontFamily="monospace" fontSize="9" fill="#0d1400" opacity="0.6">
            RATE: 99.8%
          </text>

          {/* Dynamic LED Power Level */}
          <rect x="70" y="145" width="260" height="60" rx="6" fill="#0d1400" />
          <text x="200" y="183" fontFamily="monospace" fontSize="24" fontWeight="bold" fill="#aaff00" textAnchor="middle" letterSpacing="1">
            POWER: &gt;9000
          </text>
          
          <text x="200" y="235" fontFamily="sans-serif" fontSize="10" fill="#aaff00" textAnchor="middle" letterSpacing="4" opacity="0.8">
            * EXCEEDS SCOUTER THRESHOLD *
          </text>
          <text x="200" y="360" fontFamily="monospace" fontSize="8" fill="#0d1400" textAnchor="middle" letterSpacing="2">
            SAIYAN SENSOR LABS // VER 9.1
          </text>
        </svg>
      );
  }
};

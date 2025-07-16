import type { SVGProps } from "react";

export function SolarSaverLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}


export function AnimatedIconSunlight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4">
        <animateTransform attributeName="transform" type="scale" begin="0s" dur="1.5s" values="1;1.2;1" repeatCount="indefinite" />
      </circle>
      <path d="M12 2v2">
        <animateTransform attributeName="transform" type="translate" dur="1.5s" values="0 0; 0 -1; 0 0" repeatCount="indefinite" />
      </path>
      <path d="M12 20v2">
        <animateTransform attributeName="transform" type="translate" dur="1.5s" values="0 0; 0 1; 0 0" repeatCount="indefinite" />
      </path>
      <path d="m4.93 4.93 1.41 1.41">
        <animateTransform attributeName="transform" type="translate" dur="1.5s" values="0 0; -0.7 -0.7; 0 0" repeatCount="indefinite" />
      </path>
      <path d="m17.66 17.66 1.41 1.41">
        <animateTransform attributeName="transform" type="translate" dur="1.5s" values="0 0; 0.7 0.7; 0 0" repeatCount="indefinite" />
      </path>
      <path d="M2 12h2">
        <animateTransform attributeName="transform" type="translate" dur="1.5s" values="0 0; -1 0; 0 0" repeatCount="indefinite" />
      </path>
      <path d="M20 12h2">
        <animateTransform attributeName="transform" type="translate" dur="1.5s" values="0 0; 1 0; 0 0" repeatCount="indefinite" />
      </path>
      <path d="m6.34 17.66-1.41 1.41">
        <animateTransform attributeName="transform" type="translate" dur="1.5s" values="0 0; -0.7 0.7; 0 0" repeatCount="indefinite" />
      </path>
      <path d="m19.07 4.93-1.41 1.41">
        <animateTransform attributeName="transform" type="translate" dur="1.5s" values="0 0; 0.7 -0.7; 0 0" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export function AnimatedIconConvert(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m2 14 3-3 3 3" />
      <path d="m20 10-3 3-3-3" />
      <path d="M5 11h14" />
      <path d="M5 11a4.5 4.5 0 0 0 0 9h14a4.5 4.5 0 0 1 0-9Z" />
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="10s" repeatCount="indefinite" />
    </svg>
  );
}

export function AnimatedIconPowerHome(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
      <path d="M12 12v-2">
        <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
      </path>
       <path d="M10 10h4">
        <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin="0.2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

export function AnimatedIconSavings(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 12h-5" />
      <path d="M12.5 9.5 15 12l-2.5 2.5" />
      <path d="M12 21a9 9 0 0 0 0-18" />
      <path d="M7 21a9 9 0 0 0 0-18" />
      <path d="M7 21a9 9 0 0 1 0-18" />
      <path d="M12 3a9 9 0 0 0 0 18" />
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="8s" repeatCount="indefinite" />
    </svg>
  );
}

export function AnimatedIconROI(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <style>
        {`
          .path-draw {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw 3s ease-in-out forwards infinite;
          }
          @keyframes draw {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
      <path d="M3 17l6-6 4 4 8-8" className="path-draw" />
      <path d="M17 3h4v4" />
      <circle cx="21" cy="3" r="2" fill="currentColor">
         <animate attributeName="r" values="0;2;0;0" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export function AnimatedIconHybrid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <style>
        {`
          .flow-line {
            stroke-dasharray: 5;
            animation: flow 2s linear infinite;
          }
          @keyframes flow {
            to {
              stroke-dashoffset: 10;
            }
          }
          .sun-ray {
            animation: pulse-ray 2s ease-in-out infinite;
          }
          @keyframes pulse-ray {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}
      </style>
      {/* Sun */}
      <circle cx="6" cy="6" r="3" />
      <line x1="6" y1="1" x2="6" y2="3" className="sun-ray" style={{ animationDelay: '0s' }} />
      <line x1="6" y1="9" x2="6" y2="11" className="sun-ray" style={{ animationDelay: '0.5s' }} />
      <line x1="1" y1="6" x2="3" y2="6" className="sun-ray" style={{ animationDelay: '1.5s' }} />
      <line x1="9" y1="6" x2="11" y2="6" className="sun-ray" style={{ animationDelay: '1s' }} />
      {/* Battery */}
      <path d="M14 9h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2" />
      <line x1="16" y1="7" x2="16" y2="9" />
      <line x1="15" y1="13" x2="17" y2="13" />
      <line x1="15" y1="17" x2="17" y2="17" />
      {/* Flow line */}
      <path d="M9 7q4 4 6 5" className="flow-line" />
    </svg>
  )
}

export function AnimatedFamilyRun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMax meet" fill="none" {...props}>
      <path id="runPath" d="M-100 150 Q 400 100, 900 150" stroke="none" />
      <g stroke="hsl(var(--primary))" strokeWidth="3" fill="hsl(var(--primary))" strokeLinecap="round" strokeLinejoin="round">
        <g>
          {/* Parent 1 */}
          <g>
            <circle cx="0" cy="0" r="8" />
            <path d="M -5 10 L 0 25 L 5 10 L 0 25 L 0 40 L -7 55 M 0 40 L 7 55" />
             <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
                <mpath href="#runPath" />
            </animateMotion>
          </g>
          {/* Parent 2 */}
          <g transform="translate(50, -5)">
            <circle cx="0" cy="0" r="8" />
            <path d="M -5 10 L 0 25 L 5 10 L 0 25 L 0 40 L -7 55 M 0 40 L 7 55" />
             <animateMotion dur="7.8s" begin="-0.2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#runPath" />
            </animateMotion>
          </g>
          {/* Child */}
          <g transform="translate(90, 15) scale(0.7)">
            <circle cx="0" cy="0" r="8" />
            <path d="M -5 10 L 0 25 L 5 10 L 0 25 L 0 40 L -7 55 M 0 40 L 7 55" />
             <animateMotion dur="7.5s" begin="-0.4s" repeatCount="indefinite" rotate="auto">
                <mpath href="#runPath" />
            </animateMotion>
          </g>
        </g>
      </g>
    </svg>
  )
}

export function AnimatedSun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMax meet" {...props}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx="400" cy="125" r="20" fill="hsl(var(--primary))" filter="url(#glow)">
        <animate attributeName="r" values="20;25;20" dur="8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;1;0.8" dur="8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

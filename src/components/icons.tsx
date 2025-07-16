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

export function AnimatedIconPiggyBank(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 54 44"
      fill="none"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path d="M41.9474 13.2353C41.9474 17.5247 38.6479 21.0588 34.614 21.0588H22.5413C18.5074 21.0588 15.2079 17.5247 15.2079 13.2353V13.2353C15.2079 8.94589 18.5074 5.41176 22.5413 5.41176H34.614C38.6479 5.41176 41.9474 8.94589 41.9474 13.2353V13.2353Z" />
      <path d="M28.5781 29.8235C30.6823 30.5055 33.1534 30.8823 35.8409 30.8823C42.8436 30.8823 48.7356 28.9839 52 26.5882" />
      <path d="M2.99902 26.5882C6.26344 28.9839 12.1554 30.8824 19.1581 30.8824C20.9333 30.8824 22.6457 30.7483 24.2796 30.5" />
      <path d="M43.6826 38.5882V32.4118" />
      <path d="M11.2627 38.5882V32.4118" />
    </svg>
  );
}

export function AnimatedIconPowerCompany(props: SVGProps<SVGSVGElement>) {
  return (
     <svg 
      viewBox="0 0 44 44"
      fill="none"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path d="M22 2V12.4706" />
      <path d="M22 31.5294V42" />
      <path d="M11.6471 16.2353L2 22" />
      <path d="M32.3529 16.2353L42 22" />
      <path d="M8.82355 27.7647L22 22" />
      <path d="M35.1764 27.7647L22 22" />
      <path d="M18.8235 16.2353L13.0588 27.7647" />
      <path d="M25.1765 16.2353L30.9412 27.7647" />
    </svg>
  );
}

export function AnimatedIconWrench(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="15 12 12" dur="2s" repeatCount="indefinite" yoyo="true" />
    </svg>
  );
}
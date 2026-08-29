import type { SVGProps } from "react";
import type { ToolIconKey } from "@/lib/types";

type IconProps = SVGProps<SVGSVGElement>;

export function GemLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 4L15 4L22 10L12 21.5L2 10Z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 4L12 21.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M2 10L22 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
  };
}

export function DrillIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 9h9v4H3z" />
      <path d="M12 10.5h4.5" />
      <path d="M16.5 9.2h2.3c.7 0 1.2.5 1.2 1.2v1.2c0 .7-.5 1.2-1.2 1.2h-2.3z" />
      <path d="M19.5 12.4l2.2 1.3" />
      <path d="M6 13v3.2c0 .5.4.8.8.8h1.4c.5 0 .8-.4.8-.8V13" />
    </svg>
  );
}

export function GrinderIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="15.5" r="4" />
      <path d="M7 12.2v-1" />
      <path d="M9.6 17.6l3.4-3.4" />
      <rect x="12.6" y="10.6" width="8.4" height="3.4" rx="1" transform="rotate(-45 12.6 10.6)" />
      <path d="M18.5 8.7l1.9-1.9" />
    </svg>
  );
}

export function JigsawIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="6" width="9" height="7" rx="1.5" />
      <path d="M6.5 8.4h2.5" />
      <path d="M12 9.5h3.5l1 1.3-1 1.3H12z" />
      <path d="M16.5 10.8h1.8" />
      <path d="M8 13l-2.6 7.5" strokeDasharray="1.6 1.8" />
    </svg>
  );
}

export function ToolsetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 7V5.6c0-.6.4-1 1-1h6c.6 0 1 .4 1 1V7" />
      <rect x="3.5" y="7" width="17" height="11" rx="1.6" />
      <path d="M3.5 12h5.2l1 1.4h4.6l1-1.4h5.2" />
    </svg>
  );
}

export function ScrewdriverIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 3.5l6 6-2.1 2.1-6-6z" />
      <path d="M12.9 8.1l2 2-6.4 6.4a2.1 2.1 0 0 1-1.1.6l-3.4.8.8-3.4a2.1 2.1 0 0 1 .6-1.1z" />
    </svg>
  );
}

export function PressureWasherIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="11" width="7" height="8" rx="1.4" />
      <circle cx="6.5" cy="9" r="1.3" />
      <path d="M10 14.5h3.2l4.3-3" />
      <path d="M18.6 10.3l2-1.4" />
      <path d="M17 15.5c.9.5 1.6 1.3 1.6 2.3 0 1.1-.9 2-2 2s-2-.9-2-2c0-1 .7-1.8 1.6-2.3z" />
    </svg>
  );
}

export function VacuumIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9.5" y="3.5" width="4.2" height="10" rx="1.6" />
      <path d="M11.6 13.5v2.3" />
      <path d="M7.5 19.5h8.2" />
      <path d="M9 19.5v-2a2 2 0 0 1 2-2h1.2a2 2 0 0 1 2 2v2" />
      <circle cx="9" cy="20.6" r="0.9" />
      <circle cx="14.2" cy="20.6" r="0.9" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
      <path d="M12 14.3v2.4" />
    </svg>
  );
}

const MAP: Record<ToolIconKey, (p: IconProps) => React.JSX.Element> = {
  drill: DrillIcon,
  grinder: GrinderIcon,
  jigsaw: JigsawIcon,
  toolset: ToolsetIcon,
  screwdriver: ScrewdriverIcon,
  "pressure-washer": PressureWasherIcon,
  vacuum: VacuumIcon,
};

export function ToolIcon({ icon, ...props }: { icon: ToolIconKey } & IconProps) {
  const Cmp = MAP[icon];
  return <Cmp {...props} />;
}

// --- Generic UI icons (hand-rolled to avoid an extra dependency) ---

export function BellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 10a6 6 0 0 1 12 0c0 3.2.9 4.9 1.6 5.8.3.4 0 1-.5 1H4.9c-.5 0-.8-.6-.5-1C5.1 14.9 6 13.2 6 10z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function StarIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(props)} fill={filled ? "currentColor" : "none"}>
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 7h15" />
      <path d="M9 7V5.2c0-.7.6-1.2 1.2-1.2h3.6c.6 0 1.2.5 1.2 1.2V7" />
      <path d="M6.5 7l.7 12c0 .8.7 1.5 1.5 1.5h6.6c.8 0 1.5-.7 1.5-1.5l.7-12" />
      <path d="M10.2 10.8v6" />
      <path d="M13.8 10.8v6" />
    </svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.5 4.5l5 5-9.5 9.5-5.6 1.1 1.1-5.6z" />
      <path d="M13 6l5 5" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2.5 12S5.8 5.8 12 5.8 21.5 12 21.5 12 18.2 18.2 12 18.2 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.8 6.2l-1.6 1.6M7.8 16.2l-1.6 1.6M17.8 17.8l-1.6-1.6M7.8 7.8L6.2 6.2" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 6H5.5A1.5 1.5 0 0 0 4 7.5v11A1.5 1.5 0 0 0 5.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15" />
      <path d="M14 4h6v6" />
      <path d="M20 4l-9.5 9.5" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5l7 2.6v5.4c0 4.6-3 7.7-7 9-4-1.3-7-4.4-7-9V6.1z" />
      <path d="M9 12l2 2 4-4.2" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11 3l1.3 3.7L16 8l-3.7 1.3L11 13l-1.3-3.7L6 8l3.7-1.3z" />
      <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h15.5" />
      <path d="M14 6.5l5.5 5.5-5.5 5.5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="4.3" />
      <path d="M12 2.5v2.3M12 19.2v2.3M21.5 12h-2.3M4.8 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9L5.3 5.3" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 14.2A8.5 8.5 0 1 1 9.8 4a6.7 6.7 0 0 0 10.2 10.2z" />
    </svg>
  );
}

export function GripIcon(props: IconProps) {
  return (
    <svg {...base(props)} strokeWidth={2.4}>
      <circle cx="9" cy="6" r="0.6" fill="currentColor" />
      <circle cx="9" cy="12" r="0.6" fill="currentColor" />
      <circle cx="9" cy="18" r="0.6" fill="currentColor" />
      <circle cx="15" cy="6" r="0.6" fill="currentColor" />
      <circle cx="15" cy="12" r="0.6" fill="currentColor" />
      <circle cx="15" cy="18" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M20 20l-4.8-4.8" />
    </svg>
  );
}

export function LineChartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M6.5 15.5l3.6-4 3 2.4 4.4-6.4" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11.5 4H6a2 2 0 0 0-2 2v5.5a2 2 0 0 0 .6 1.4l8 8a2 2 0 0 0 2.8 0l5.5-5.5a2 2 0 0 0 0-2.8l-8-8A2 2 0 0 0 11.5 4z" />
      <circle cx="8" cy="9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ScissorsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="6.3" cy="7" r="2.1" />
      <circle cx="6.3" cy="17" r="2.1" />
      <path d="M8 8.3L19.5 19.5" />
      <path d="M8 15.7L19.5 4.5" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5l9.5 16.5H2.5z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.15" fill="currentColor" />
    </svg>
  );
}

export function GraduationCapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2.5 9.5L12 5l9.5 4.5L12 14z" />
      <path d="M6 11.5V16c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4.5" />
      <path d="M21.5 9.5v5.2" />
    </svg>
  );
}

export function StoreIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 9.5L4.7 4.5h14.6l1.2 5" />
      <path d="M3.5 9.5a2.3 2.3 0 0 0 4.6.3 2.3 2.3 0 0 0 4.6 0 2.3 2.3 0 0 0 4.6 0 2.3 2.3 0 0 0 4.6-.3" />
      <path d="M5 10.2V19h14v-8.8" />
      <path d="M10 19v-4.5a2 2 0 0 1 4 0V19" />
    </svg>
  );
}

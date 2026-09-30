import type { ReactNode, SVGProps } from 'react'

const P = {
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  viber: (
    <>
      <path d="M12 3c5 0 8 2.5 8 7.5S17 18 12 18l-4 3v-3.6C5.6 16.3 4 14 4 10.5 4 5.5 7 3 12 3z" />
      <path d="M10 8.5c.4 1.8 1.7 3.1 3.5 3.5" />
    </>
  ),
  telegram: (
    <>
      <path d="M21 4 3 11l6 2 2 6 3-4 5 4z" />
      <path d="m9 13 8-6" />
    </>
  ),
  menu: <path d="M4 8h16M4 16h10" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chevL: <path d="M15 5l-7 7 7 7" />,
  chevR: <path d="M9 5l7 7-7 7" />,
  zoom: <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  bang: (
    <>
      <path d="M12 6.5v7" />
      <path d="M12 17.5v.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
  cookie: (
    <>
      <path d="M12 3a9 9 0 1 0 9 9 3 3 0 0 1-3-3 3 3 0 0 1-3-3 3 3 0 0 1-3-3z" />
      <circle cx="9" cy="11" r="1" />
      <circle cx="14" cy="15" r="1" />
      <circle cx="9.5" cy="16" r="1" />
    </>
  ),
  tree: (
    <>
      <path d="M12 2 5 12h4l-5 7h16l-5-7h4z" />
      <path d="M12 19v3" />
    </>
  ),
  waves: <path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />,
  tentDoor: (
    <>
      <path d="M12 3 2 20h20z" />
      <path d="M12 3v17M9 20l3-6 3 6" />
    </>
  ),
  tent: (
    <>
      <path d="M12 3 2 20h20z" />
      <path d="M12 3v17" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9M17 6l3 3M14.5 8.5l2 2" />
    </>
  ),
  rings: (
    <>
      <circle cx="9" cy="14" r="5" />
      <circle cx="15" cy="14" r="5" />
    </>
  ),
  dish: (
    <>
      <path d="M4 10h16a8 8 0 0 1-16 0z" />
      <path d="M3 10h18" />
    </>
  ),
  sparks: <path d="M12 21v-7M8 21h8M12 14c0-4-3-6-4-10M12 14c0-4 3-6 4-10M12 12V3" />,
  screen: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  sound: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18V6M3 14h18v4" />
      <circle cx="7" cy="11" r="2" />
    </>
  ),
  bath: (
    <>
      <path d="M8 3c-1 1.5 1 2.5 0 4M12 3c-1 1.5 1 2.5 0 4M16 3c-1 1.5 1 2.5 0 4" />
      <path d="M3 11h18v9H3z" />
    </>
  ),
  kayak: (
    <>
      <path d="M2 14c5 3 15 3 20 0-5-2.5-15-2.5-20 0z" />
      <path d="M6 20 18 7M16.5 5.5l3 3M4.5 18.5l3 3" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof P

type Props = Omit<SVGProps<SVGSVGElement>, 'name'> & { name: IconName; size?: number; sw?: number }

export function Icon({ name, size = 20, sw = 1.7, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {P[name]}
    </svg>
  )
}

export function Stars({ value, color, size = 16 }: { value: number; color: string; size?: number }) {
  const off = color === '#1E3328' ? '#C9BDA3' : '#3C5A48'
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill={i < value ? color : off} />
        </svg>
      ))}
    </>
  )
}

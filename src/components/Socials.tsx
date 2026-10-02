import { SITE } from '@/content/site'
import { Icon } from './icons'

const LINKS = {
  viber: { href: SITE.viber, label: 'Написать в Viber', blank: false },
  telegram: { href: SITE.telegram, label: 'Написать в Telegram', blank: true },
  instagram: { href: SITE.instagram, label: `Instagram ${SITE.instagramHandle}`, blank: true },
}

type Name = keyof typeof LINKS

export function Socials({ names = ['viber', 'telegram', 'instagram'], className = 'msgs', size = 20 }: { names?: Name[]; className?: string; size?: number }) {
  return (
    <div className={className}>
      {names.map((n) => {
        const l = LINKS[n]
        return (
          <a key={n} className="icon-btn" href={l.href} aria-label={l.label} title={l.label} {...(l.blank ? { target: '_blank', rel: 'noopener' } : {})}>
            <Icon name={n} size={size} sw={1.6} />
          </a>
        )
      })}
    </div>
  )
}

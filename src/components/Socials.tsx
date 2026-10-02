import { SITE } from '@/content/site'
import { Icon } from './icons'

const LINKS = {
  viber: { href: SITE.viber, text: 'Viber', blank: false },
  telegram: { href: SITE.telegram, text: 'Telegram', blank: true },
  instagram: { href: SITE.instagram, text: 'Instagram', blank: true },
}

type Name = keyof typeof LINKS

export function Socials({
  names = ['viber', 'telegram', 'instagram'],
  className = 'msgs',
  itemClass = 'soc',
  size = 18,
}: {
  names?: Name[]
  className?: string
  itemClass?: string
  size?: number
}) {
  return (
    <div className={className}>
      {names.map((n) => {
        const l = LINKS[n]
        return (
          <a key={n} className={itemClass} href={l.href} {...(l.blank ? { target: '_blank', rel: 'noopener' } : {})}>
            <Icon name={n} size={size} sw={1.6} />
            {l.text}
          </a>
        )
      })}
    </div>
  )
}

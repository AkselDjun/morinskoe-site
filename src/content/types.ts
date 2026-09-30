export type PhotoMeta = { alt: string; pos: string }
export type Shot = { key: string; cap: string; pos: string }
export type Season = 'day' | 'evening' | 'winter'
export type GalleryItem = { type: 'big' | 'pair'; photos: Shot[] } | { type: 'end' }
export type MapPoint = { n: number; title: string; text: string; x: number; y: number; px: number; py: number; photos: Shot[] }
export type PolicyBlock =
  | { type: 'p' | 'note'; html: string }
  | { type: 'ul'; items: string[] }
  | { type: 'dl'; rows: string[][] }
  | { type: 'table'; cols: string[]; widths: number[]; rows: string[][] }
export type PolicySection = { id: string; title: string; blocks: PolicyBlock[] }

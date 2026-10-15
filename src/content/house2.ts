import type { HouseItem } from './types'

export const HOUSE2 = {
  eyebrow: 'Соседний участок',
  title: 'Второй дом',
  text: 'Бревенчатый дом на соседнем участке: гостиная со столом на 10 человек, спальни на мансарде с балконом над рекой, терраса у воды и своя баня.',
}

export const HOUSE2_ITEMS: HouseItem[] = [
  { type: 'big', photos: [{ key: 'h2_exterior', cap: 'Дом на соседнем участке', pos: '50% 50%' }] },
  {
    type: 'pair',
    photos: [
      { key: 'h2_dining', cap: 'Стол на 10 человек', pos: '50% 60%' },
      { key: 'h2_living', cap: 'Гостиная', pos: '50% 55%' },
    ],
  },
  { type: 'video', clip: { src: '/video/h2_terrace', poster: 'h2_terrace', cap: 'Выход на террасу у реки', pos: '50% 50%' } },
  {
    type: 'pair',
    photos: [
      { key: 'h2_stairs', cap: 'Лестница на мансарду', pos: '50% 55%' },
      { key: 'h2_attic_lounge', cap: 'Мансарда', pos: '50% 70%' },
    ],
  },
  { type: 'big', photos: [{ key: 'h2_armchair_river', cap: 'Кресло с видом на реку', pos: '50% 50%' }] },
  {
    type: 'pair',
    photos: [
      { key: 'h2_bedroom_balcony', cap: 'Спальня с балконом', pos: '50% 50%' },
      { key: 'h2_bedroom', cap: 'Спальня на мансарде', pos: '50% 60%' },
    ],
  },
  { type: 'big', photos: [{ key: 'h2_balcony_view', cap: 'Вид с балкона', pos: '50% 60%' }] },
  {
    type: 'pair',
    photos: [
      { key: 'h2_sauna', cap: 'Баня', pos: '50% 50%' },
      { key: 'h2_shower', cap: 'Душевая в бане', pos: '50% 45%' },
    ],
  },
]

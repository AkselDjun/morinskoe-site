import type { GalleryItem, Season } from './types'

export const SEASONS: { id: Season; label: string }[] = [
  { id: 'day', label: 'День' },
  { id: 'evening', label: 'Вечер' },
  { id: 'winter', label: 'Зима' },
]

export const GALLERY: Record<Season, GalleryItem[]> = {
  "day": [
    {
      "type": "big",
      "photos": [
        {
          "key": "g_walk_water",
          "cap": "К воде между туями",
          "pos": "50% 55%"
        }
      ]
    },
    {
      "type": "pair",
      "photos": [
        {
          "key": "g_umbrella",
          "cap": "Аллея туй у воды",
          "pos": "50% 60%"
        },
        {
          "key": "g_podium",
          "cap": "Подиум в цветах",
          "pos": "50% 40%"
        }
      ]
    },
    {
      "type": "big",
      "photos": [
        {
          "key": "g_peonies",
          "cap": "Невеста у Немана",
          "pos": "50% 55%"
        }
      ]
    },
    {
      "type": "pair",
      "photos": [
        {
          "key": "g_ceremony_peony",
          "cap": "Церемония в пионах",
          "pos": "50% 40%"
        },
        {
          "key": "g_hat",
          "cap": "Шляпа и туи",
          "pos": "50% 40%"
        }
      ]
    },
    {
      "type": "big",
      "photos": [
        {
          "key": "g_hay",
          "cap": "Кружево и сено",
          "pos": "50% 60%"
        }
      ]
    },
    {
      "type": "pair",
      "photos": [
        {
          "key": "g_kiss_umbrella",
          "cap": "Белый зонтик",
          "pos": "50% 30%"
        },
        {
          "key": "g_house",
          "cap": "У бревенчатого дома",
          "pos": "50% 55%"
        }
      ]
    },
    {
      "type": "end"
    }
  ],
  "evening": [
    {
      "type": "big",
      "photos": [
        {
          "key": "e_dip",
          "cap": "Первый танец в дыму",
          "pos": "50% 45%"
        }
      ]
    },
    {
      "type": "pair",
      "photos": [
        {
          "key": "e_fount_kiss",
          "cap": "Холодные фонтаны",
          "pos": "50% 60%"
        },
        {
          "key": "e_film_dance",
          "cap": "Лучи и тяжёлый дым",
          "pos": "50% 55%"
        }
      ]
    },
    {
      "type": "pair",
      "photos": [
        {
          "key": "e_silhouette",
          "cap": "Силуэты в свете",
          "pos": "50% 40%"
        },
        {
          "key": "e_bw_kiss",
          "cap": "Чёрно-белый вечер",
          "pos": "50% 35%"
        }
      ]
    },
    {
      "type": "big",
      "photos": [
        {
          "key": "e_fireworks_kiss",
          "cap": "Искры у арки",
          "pos": "50% 45%"
        }
      ]
    },
    {
      "type": "pair",
      "photos": [
        {
          "key": "e_bw_dance",
          "cap": "Танец в облаке",
          "pos": "50% 55%"
        },
        {
          "key": "e_fireworks_color",
          "cap": "Салют над лужайкой",
          "pos": "50% 45%"
        }
      ]
    },
    {
      "type": "end"
    }
  ],
  "winter": [
    {
      "type": "big",
      "photos": [
        {
          "key": "w_chimney",
          "cap": "Зимняя ночь",
          "pos": "50% 70%"
        }
      ]
    },
    {
      "type": "pair",
      "photos": [
        {
          "key": "w_houses",
          "cap": "Дома под звёздами",
          "pos": "50% 55%"
        },
        {
          "key": "w_arch",
          "cap": "Следы на снегу",
          "pos": "50% 65%"
        }
      ]
    },
    {
      "type": "end"
    }
  ]
}

import type { MapPoint } from './types'

export const MAP_W = 708
export const MAP_H = 460
export const MAP_ACTIVE = 2

export const MAP_POINTS: MapPoint[] = [
  {
    "n": 1,
    "title": "Парковка",
    "text": "у въезда с дороги",
    "x": 290,
    "y": 100,
    "px": 330,
    "py": 84,
    "photos": []
  },
  {
    "n": 2,
    "title": "Дом для гостей",
    "text": "14 спальных мест, баня, закрытая беседка до 18 мест",
    "x": 226,
    "y": 226,
    "px": 52,
    "py": 210,
    "photos": [
      {
        "key": "house_arch",
        "cap": "Бревенчатый дом",
        "pos": "68% 55%"
      },
      {
        "key": "house_sun",
        "cap": "Терраса дома",
        "pos": "62% 50%"
      }
    ]
  },
  {
    "n": 3,
    "title": "Шатёр",
    "text": "до 200 гостей, кондиционеры, апрель — октябрь",
    "x": 522,
    "y": 262,
    "px": 486,
    "py": 302,
    "photos": [
      {
        "key": "tent_dance",
        "cap": "Шатёр вечером",
        "pos": "50% 60%"
      },
      {
        "key": "tent_day",
        "cap": "Шатёр днём",
        "pos": "50% 22%"
      },
      {
        "key": "tent_table",
        "cap": "Стол молодожёнов",
        "pos": "50% 62%"
      }
    ]
  },
  {
    "n": 4,
    "title": "Место для церемоний",
    "text": "выездная регистрация у реки",
    "x": 262,
    "y": 300,
    "px": 64,
    "py": 284,
    "photos": [
      {
        "key": "cer_site",
        "cap": "Площадка",
        "pos": "50% 60%"
      },
      {
        "key": "m_podium",
        "cap": "Подиум в цветах",
        "pos": "50% 60%"
      }
    ]
  },
  {
    "n": 5,
    "title": "Пристань и баня",
    "text": "баня 150 р за 4 часа, выход к Неману",
    "x": 337,
    "y": 390,
    "px": 404,
    "py": 380,
    "photos": [
      {
        "key": "m_pontoon",
        "cap": "Понтон на Немане",
        "pos": "50% 55%"
      },
      {
        "key": "sauna_river",
        "cap": "Баня-бочка",
        "pos": "75% 60%"
      }
    ]
  }
]

export const MAP_SVG = "<svg viewBox=\"0 0 708 460\" width=\"100%\" height=\"100%\" focusable=\"false\" aria-hidden=\"true\"><rect x=\"0\" y=\"18\" width=\"708\" height=\"28\" fill=\"#DCCFB4\"></rect><path d=\"M0 364C120 344 240 384 380 362S600 340 708 352V460H0Z\" fill=\"#CBD8D2\"></path><g fill=\"none\" stroke=\"#1E3328\" stroke-width=\"1.4\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path d=\"M0 18H708M0 46H708\"></path><path d=\"M92 32H708\" stroke=\"#3C5A48\" stroke-dasharray=\"10 10\"></path><path d=\"M276 46V80M304 46V80\"></path><rect x=\"150\" y=\"66\" width=\"440\" height=\"276\" rx=\"22\" stroke=\"#3C5A48\" stroke-dasharray=\"2 7\"></rect><path d=\"M290 120C288 150 250 160 238 190M304 120C352 150 470 180 506 224M226 252C232 268 246 276 254 280M280 318C298 330 308 334 316 340M330 277H432\" stroke=\"#3C5A48\" stroke-dasharray=\"4 6\" stroke-width=\"1.2\"></path><path d=\"M40 72L28 90.7H34L24.4 106H55.6L46 90.7H52Z M40 106V114\"></path><path d=\"M80 58L65.6 80.44H72.8L61.28 98.8H98.72L87.2 80.44H94.4Z M80 98.8V108.4\"></path><path d=\"M122 88L111.2 104.83H116.6L107.96 118.6H136.04L127.4 104.83H132.8Z M122 118.6V125.8\"></path><path d=\"M56 124L44 142.7H50L40.4 158H71.6L62 142.7H68Z M56 158V166\"></path><path d=\"M104 146L94.4 160.96H99.2L91.52 173.2H116.48L108.8 160.96H113.6Z M104 173.2V179.6\"></path><path d=\"M28 176L17.2 192.83H22.6L13.96 206.6H42.04L33.4 192.83H38.8Z M28 206.6V213.8\"></path><path d=\"M84 188L70.8 208.57H77.4L66.84 225.4H101.16L90.6 208.57H97.2Z M84 225.4V234.2\"></path><path d=\"M628 72L616 90.7H622L612.4 106H643.6L634 90.7H640Z M628 106V114\"></path><path d=\"M668 58L653.6 80.44H660.8L649.28 98.8H686.72L675.2 80.44H682.4Z M668 98.8V108.4\"></path><path d=\"M646 128L632.8 148.57H639.4L628.84 165.4H663.16L652.6 148.57H659.2Z M646 165.4V174.2\"></path><path d=\"M690 150L680.4 164.96H685.2L677.52 177.2H702.48L694.8 164.96H699.6Z M690 177.2V183.6\"></path><path d=\"M620 196L610.4 210.96H615.2L607.52 223.2H632.48L624.8 210.96H629.6Z M620 223.2V229.6\"></path><path d=\"M672 224L660 242.7H666L656.4 258H687.6L678 242.7H684Z M672 258V266\"></path><path d=\"M634 280L623.2 296.83H628.6L619.96 310.6H648.04L639.4 296.83H644.8Z M634 310.6V317.8\"></path><path d=\"M690 296L680.4 310.96H685.2L677.52 323.2H702.48L694.8 310.96H699.6Z M690 323.2V329.6\"></path><ellipse cx=\"336\" cy=\"262\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"352\" cy=\"262\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"368\" cy=\"262\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"384\" cy=\"262\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"400\" cy=\"262\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"416\" cy=\"262\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"336\" cy=\"292\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"352\" cy=\"292\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"368\" cy=\"292\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"384\" cy=\"292\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"400\" cy=\"292\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><ellipse cx=\"416\" cy=\"292\" rx=\"5\" ry=\"11\" fill=\"#F4ECDC\"></ellipse><rect x=\"262\" y=\"80\" width=\"56\" height=\"40\" rx=\"10\" fill=\"#F4ECDC\"></rect><path d=\"M284 110V90H294A6 6 0 0 1 294 102H284\"></path><path d=\"M192 252V216L226 192L260 216V252Z\" fill=\"#F4ECDC\"></path><path d=\"M218 252V236H234V252M244 206V196H252V212\"></path><path d=\"M462 256L492 226L522 256L552 226L582 256V296H462Z\" fill=\"#F4ECDC\"></path><path d=\"M492 226V296M552 226V296M514 296V276H530V296\"></path><path d=\"M246 312V292A16 16 0 0 1 278 292V312M240 312H284\"></path><path d=\"M242 322h10M258 322h10M274 322h10M242 330h10M258 330h10M274 330h10\"></path><path d=\"M300 372V352L318 340L336 352V372Z\" fill=\"#F4ECDC\"></path><path d=\"M312 336c-3-5 3-7 0-12M324 334c-3-5 3-7 0-12\"></path><path d=\"M330 372h14v40h-14z\" fill=\"#F4ECDC\"></path><path d=\"M330 380h14M330 388h14M330 396h14M330 404h14\"></path><path d=\"M352 402c10-6 34-6 44 0c-10 6-34 6-44 0z\" fill=\"#F4ECDC\"></path><path d=\"M0 372C120 352 240 392 380 370S600 348 708 360\"></path><path d=\"M60 412c14 0 14-6 28-6s14 6 28 6M200 430c14 0 14-6 28-6s14 6 28 6M470 420c14 0 14-6 28-6s14 6 28 6M600 398c14 0 14-6 28-6s14 6 28 6\"></path></g><text x=\"18\" y=\"36\" font-family=\"Golos Text, sans-serif\" font-size=\"11\" font-weight=\"600\" fill=\"#3C5A48\">дорога</text><text x=\"590\" y=\"446\" font-family=\"Prata, serif\" font-size=\"20\" font-style=\"italic\" fill=\"#3C5A48\">Неман</text></svg>"

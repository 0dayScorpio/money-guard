import { CurrencyInfo } from '@/types';

export const currencies: CurrencyInfo[] = [
  {
    code: 'EUR',
    name: 'Евро',
    symbol: '€',
    flag: '🇪🇺',
    denominations: [
      {
        value: 5,
        color: 'Сива',
        features: [
          {
            id: 'eur-5-hologram',
            name: 'Холограмна лента',
            description: 'Сребриста лента с преливащи се цветове отляво на банкнотата.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете банкнотата под светлина - лентата трябва да сменя цветовете от зелено към синьо.'
          },
          {
            id: 'eur-5-watermark',
            name: 'Воден знак',
            description: 'Портрет на Европа и стойността на банкнотата, видими при преглед срещу светлина.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'Задръжте банкнотата срещу източник на светлина и потърсете ясен образ на лице.'
          },
          {
            id: 'eur-5-thread',
            name: 'Защитна нишка',
            description: 'Вградена тъмна линия през средата на банкнотата с надпис "5 EURO".',
            imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop',
            howToCheck: 'При светлина нишката става видима като непрекъсната тъмна линия.'
          }
        ]
      },
      {
        value: 10,
        color: 'Червена',
        features: [
          {
            id: 'eur-10-hologram',
            name: 'Холограмна лента',
            description: 'Сребриста лента с преливащи се изображения на стойността и символа €.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'При накланяне се виждат различни изображения в лентата.'
          },
          {
            id: 'eur-10-emerald',
            name: 'Изумруден номер',
            description: 'Числото в долния ляв ъгъл променя цвета си от изумрудено зелено към тъмносиньо.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете банкнотата и наблюдавайте промяната на цвета на числото.'
          }
        ]
      },
      {
        value: 20,
        color: 'Синя',
        features: [
          {
            id: 'eur-20-window',
            name: 'Прозрачен прозорец',
            description: 'Прозорец с холограма на портрет на Европа в горната част.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Погледнете прозореца срещу светлина - портретът трябва да е видим от двете страни.'
          },
          {
            id: 'eur-20-feel',
            name: 'Релефен печат',
            description: 'Основното изображение и надписите имат осезаем релеф.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'Прекарайте пръст по банкнотата - трябва да усетите релефа на изображенията.'
          }
        ]
      },
      {
        value: 50,
        color: 'Оранжева',
        features: [
          {
            id: 'eur-50-portrait',
            name: 'Портретен прозорец',
            description: 'Холографски портрет на Европа в прозрачен прозорец.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'При накланяне лицето на Европа се появява и се движи дъгов светлинен ефект.'
          },
          {
            id: 'eur-50-satellite',
            name: 'Сателитни холограми',
            description: 'Малки символи € около портрета, видими само под определен ъгъл.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете банкнотата силно - малките символи ще станат видими около портрета.'
          }
        ]
      },
      {
        value: 100,
        color: 'Зелена',
        features: [
          {
            id: 'eur-100-hologram',
            name: 'Холограмен прозорец',
            description: 'Голям прозрачен прозорец с множество холографски елементи.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Наблюдавайте преливането на цветовете при различни ъгли.'
          },
          {
            id: 'eur-100-uv',
            name: 'UV флуоресценция',
            description: 'Специални влакна и елементи, видими под UV светлина.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'Под UV лампа се появяват цветни влакна и специални знаци.'
          }
        ]
      },
      {
        value: 200,
        color: 'Жълта',
        features: [
          {
            id: 'eur-200-emerald',
            name: 'Изумруден номер',
            description: 'Голям номер, който променя цвета от златисто към зелено.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете банкнотата - числото трябва да променя цвета си.'
          }
        ]
      }
    ]
  },
  {
    code: 'USD',
    name: 'Щатски долар',
    symbol: '$',
    flag: '🇺🇸',
    denominations: [
      {
        value: 1,
        color: 'Зелена',
        features: [
          {
            id: 'usd-1-paper',
            name: 'Специална хартия',
            description: 'Банкнотата е направена от памук и лен, не от обикновена хартия.',
            imageUrl: 'https://images.unsplash.com/photo-1611324795629-cc3c90fdf97f?w=400&h=300&fit=crop',
            howToCheck: 'Хартията трябва да се чувства различна на допир - по-здрава и влакнеста.'
          }
        ]
      },
      {
        value: 20,
        color: 'Зелена с цветни елементи',
        features: [
          {
            id: 'usd-20-color',
            name: 'Променящ се цвят',
            description: 'Числото 20 в долния десен ъгъл променя цвета от медено към зелено.',
            imageUrl: 'https://images.unsplash.com/photo-1611324795629-cc3c90fdf97f?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете банкнотата и наблюдавайте промяната на цвета.'
          },
          {
            id: 'usd-20-thread',
            name: 'Защитна нишка',
            description: 'Вертикална пластмасова лента вляво от портрета.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'При светлина нишката свети розово под UV и показва "USA TWENTY".'
          },
          {
            id: 'usd-20-watermark',
            name: 'Воден знак',
            description: 'Портрет на Джаксън, видим при преглед срещу светлина.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'Задръжте срещу светлина - портретът трябва да съвпада с отпечатания.'
          }
        ]
      },
      {
        value: 50,
        color: 'Зелена с розови акценти',
        features: [
          {
            id: 'usd-50-color',
            name: 'Цветопроменящо мастило',
            description: 'Числото 50 променя цвета от медено към зелено.',
            imageUrl: 'https://images.unsplash.com/photo-1611324795629-cc3c90fdf97f?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете банкнотата под различен ъгъл.'
          },
          {
            id: 'usd-50-3d',
            name: '3D защитна лента',
            description: 'Синя лента с движещи се изображения.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете банкнотата - числото 50 и камбаните се движат.'
          }
        ]
      },
      {
        value: 100,
        color: 'Зелена със синя лента',
        features: [
          {
            id: 'usd-100-ribbon',
            name: '3D защитна лента',
            description: 'Синя лента с камбани и числа 100, които се движат при накланяне.',
            imageUrl: 'https://images.unsplash.com/photo-1611324795629-cc3c90fdf97f?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете банкнотата - ще видите как камбаните и числата се движат нагоре-надолу.'
          },
          {
            id: 'usd-100-bell',
            name: 'Камбана в мастилницата',
            description: 'Медна камбана, която се появява в мастилницата.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете банкнотата - камбаната променя цвета от меден към зелен.'
          },
          {
            id: 'usd-100-portrait',
            name: 'Воден знак',
            description: 'Голям портрет на Франклин вдясно.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'Задръжте срещу светлина и потърсете втори портрет вдясно.'
          }
        ]
      }
    ]
  },
  {
    code: 'GBP',
    name: 'Британска лира',
    symbol: '£',
    flag: '🇬🇧',
    denominations: [
      {
        value: 5,
        color: 'Синьо-зелена',
        features: [
          {
            id: 'gbp-5-window',
            name: 'Прозрачен прозорец',
            description: 'Елизабет II с променящ се цвят в прозорец.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете за промяна на цвета от лилаво към зелено.'
          },
          {
            id: 'gbp-5-hologram',
            name: 'Холограмен кръг',
            description: 'Кръг с 3D изображения на корона и числа.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'Завъртете банкнотата, за да видите различни изображения.'
          }
        ]
      },
      {
        value: 10,
        color: 'Оранжева',
        features: [
          {
            id: 'gbp-10-austen',
            name: 'Портрет на Джейн Остин',
            description: 'Воден знак на Кралицата и холограма на Джейн Остин.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'При светлина се вижда воден знак, при накланяне - холограмата се движи.'
          }
        ]
      },
      {
        value: 20,
        color: 'Лилава',
        features: [
          {
            id: 'gbp-20-turner',
            name: 'Портрет на Търнър',
            description: 'Художникът J.M.W. Turner с холографски елементи.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Прозорецът сменя цвета си при накланяне.'
          },
          {
            id: 'gbp-20-foil',
            name: 'Сребърно фолио',
            description: 'Сребърен елемент с множество детайли.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'При различни ъгли се виждат 3D изображения.'
          }
        ]
      },
      {
        value: 50,
        color: 'Червена',
        features: [
          {
            id: 'gbp-50-turing',
            name: 'Портрет на Тюринг',
            description: 'Алън Тюринг с математически и компютърни символи.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Холографски елементи, които се движат при накланяне.'
          }
        ]
      }
    ]
  },
  {
    code: 'BGN',
    name: 'Български лев',
    symbol: 'лв.',
    flag: '🇧🇬',
    denominations: [
      {
        value: 2,
        color: 'Лилава',
        features: [
          {
            id: 'bgn-2-watermark',
            name: 'Воден знак',
            description: 'Портрет на Паисий Хилендарски в специална зона.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Задръжте срещу светлина, за да видите портрета.'
          },
          {
            id: 'bgn-2-thread',
            name: 'Защитна нишка',
            description: 'Метализирана нишка с текст "БНБ 2 ЛЕВА".',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'При светлина нишката става непрекъсната тъмна линия.'
          }
        ]
      },
      {
        value: 5,
        color: 'Червена',
        features: [
          {
            id: 'bgn-5-hologram',
            name: 'Кинеграма',
            description: 'Холографски елемент с герба на България.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'При накланяне се виждат различни цветове и изображения.'
          }
        ]
      },
      {
        value: 10,
        color: 'Зелена',
        features: [
          {
            id: 'bgn-10-portrait',
            name: 'Портрет на д-р Петър Берон',
            description: 'Воден знак с портрет и стойност.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Ясно видим при преглед срещу светлина.'
          },
          {
            id: 'bgn-10-latent',
            name: 'Скрито изображение',
            description: 'Числото 10 се вижда при определен ъгъл.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'Наклонете банкнотата на ниво на очите.'
          }
        ]
      },
      {
        value: 20,
        color: 'Синя',
        features: [
          {
            id: 'bgn-20-stripe',
            name: 'Цветопроменяща се лента',
            description: 'Лента, която сменя цвета при накланяне.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'От златисто към зелено при различен ъгъл.'
          }
        ]
      },
      {
        value: 50,
        color: 'Кафява',
        features: [
          {
            id: 'bgn-50-iridescent',
            name: 'Преливащ елемент',
            description: 'Специален печат с преливащи се цветове.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'При накланяне цветовете се сменят.'
          },
          {
            id: 'bgn-50-uv',
            name: 'UV защита',
            description: 'Елементи, видими само под UV светлина.',
            imageUrl: 'https://images.unsplash.com/photo-1554672723-d42a16e533db?w=400&h=300&fit=crop',
            howToCheck: 'Под UV лампа се появяват скрити символи.'
          }
        ]
      },
      {
        value: 100,
        color: 'Зелена',
        features: [
          {
            id: 'bgn-100-hologram',
            name: 'Холограма',
            description: 'Комплексен холографски елемент с множество изображения.',
            imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=300&fit=crop',
            howToCheck: 'Завъртете банкнотата, за да видите различни изображения в холограмата.'
          }
        ]
      }
    ]
  }
];

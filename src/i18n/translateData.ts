import type { Language } from './index';

// Dictionary translating fixed Bulgarian strings used in src/data/currencies.ts
// to other supported languages. Unknown strings fall back to the input.
// Denomination values are interpolated via the {N} placeholder.

type Dict = Record<string, string>;

const NAMES: Record<Exclude<Language, 'bg'>, Dict> = {
  en: {
    'Воден знак': 'Watermark',
    'Релефни линии': 'Raised lines',
    'Релефен печат': 'Raised print',
    'Холограмна лента': 'Hologram strip',
    'Холограмен елемент': 'Hologram element',
    'Холограма': 'Hologram',
    'Холограмни линии': 'Hologram lines',
    'Изумрудено число': 'Emerald number',
    'Защитна нишка': 'Security thread',
    'Прозрачен холограмен портрет': 'Transparent holographic portrait',
    'UV елементи': 'UV elements',
  },
  es: {
    'Воден знак': 'Marca de agua',
    'Релефни линии': 'Líneas en relieve',
    'Релефен печат': 'Impresión en relieve',
    'Холограмна лента': 'Tira holográfica',
    'Холограмен елемент': 'Elemento holográfico',
    'Холограма': 'Holograma',
    'Холограмни линии': 'Líneas holográficas',
    'Изумрудено число': 'Número esmeralda',
    'Защитна нишка': 'Hilo de seguridad',
    'Прозрачен холограмен портрет': 'Retrato holográfico transparente',
    'UV елементи': 'Elementos UV',
  },
  de: {
    'Воден знак': 'Wasserzeichen',
    'Релефни линии': 'Geprägte Linien',
    'Релефен печат': 'Reliefdruck',
    'Холограмна лента': 'Hologrammstreifen',
    'Холограмен елемент': 'Hologrammelement',
    'Холограма': 'Hologramm',
    'Холограмни линии': 'Hologrammlinien',
    'Изумрудено число': 'Smaragdfarbene Zahl',
    'Защитна нишка': 'Sicherheitsfaden',
    'Прозрачен холограмен портрет': 'Transparentes Hologramm-Porträt',
    'UV елементи': 'UV-Elemente',
  },
};

const COLORS: Record<Exclude<Language, 'bg'>, Dict> = {
  en: { Сива: 'Gray', Червена: 'Red', Синя: 'Blue', Оранжева: 'Orange', Зелена: 'Green', Жълта: 'Yellow', Лилава: 'Purple', Кафява: 'Brown' },
  es: { Сива: 'Gris', Червена: 'Roja', Синя: 'Azul', Оранжева: 'Naranja', Зелена: 'Verde', Жълта: 'Amarilla', Лилава: 'Morada', Кафява: 'Marrón' },
  de: { Сива: 'Grau', Червена: 'Rot', Синя: 'Blau', Оранжева: 'Orange', Зелена: 'Grün', Жълта: 'Gelb', Лилава: 'Lila', Кафява: 'Braun' },
};

const CURRENCY_NAMES: Record<Exclude<Language, 'bg'>, Dict> = {
  en: {
    'Евро - НОВО': 'Euro – New',
    'Евро - СТАРО': 'Euro – Old',
    'Български лев - НОВ': 'Bulgarian Lev – New',
    'Български лев - СТАР': 'Bulgarian Lev – Old',
  },
  es: {
    'Евро - НОВО': 'Euro – Nuevo',
    'Евро - СТАРО': 'Euro – Antiguo',
    'Български лев - НОВ': 'Lev búlgaro – Nuevo',
    'Български лев - СТАР': 'Lev búlgaro – Antiguo',
  },
  de: {
    'Евро - НОВО': 'Euro – Neu',
    'Евро - СТАРО': 'Euro – Alt',
    'Български лев - НОВ': 'Bulgarischer Lew – Neu',
    'Български лев - СТАР': 'Bulgarischer Lew – Alt',
  },
};

// Phrases that contain a denomination value use {N} as a placeholder.
const PHRASES: Record<Exclude<Language, 'bg'>, Dict> = {
  en: {
    // descriptions
    'Воден знак с лице, видим при поставяне срещу светлина.':
      'Portrait watermark visible when held up to light.',
    'Воден знак с архитектурен елемент, видим при поставяне срещу светлина.':
      'Watermark with an architectural element, visible when held up to light.',
    'Релефни линии от лявата страна на банкнотата, които се усещат изпъкнали при допир.':
      'Raised lines on the left side of the banknote that feel embossed to the touch.',
    'Релефни линии от лявата страна на банкнотата.':
      'Raised lines on the left side of the banknote.',
    'Холографски образ върху вертикална лента, променящ се при накланяне.':
      'Holographic image on a vertical strip that changes when tilted.',
    'Холографски ефекти върху вертикална лента.':
      'Holographic effects on a vertical strip.',
    'Холограма със сложни изображения.':
      'Hologram with complex images.',
    'Холограма със сложни изображения при накланяне.':
      'Hologram with complex images that appear when tilted.',
    'Холографски изображения при накланяне.':
      'Holographic images visible when tilted.',
    'Погледнете изумруденото зелено число {N} в левия ъгъл на банкнотата.':
      'Look at the emerald-green {N} in the left corner of the banknote.',
    'Вградена нишка, видима като тъмна линия при осветление.':
      'Embedded thread visible as a dark line when held up to light.',
    'Вградена нишка с микронадпис.': 'Embedded thread with microprinting.',
    'Вградена нишка с микронадпис, видима при светлина.':
      'Embedded thread with microprinting, visible when held up to light.',
    'Вградена нишка, видима като линия при светлина.':
      'Embedded thread visible as a line when held up to light.',
    'Вградена нишка, видима при осветление.':
      'Embedded thread visible when held up to light.',
    'Вградена нишка, видима при държане срещу светлина.':
      'Embedded thread visible when held up to light.',
    'Прозрачен портрет в холограмния елемент, през който преминава светлина.':
      'Transparent portrait in the hologram element that light passes through.',
    'UV елементи, под формата на драскотини и други.':
      'UV elements in the form of fibers and marks.',
    'Холограма с изображения и преливащи цветове.':
      'Hologram with images and shifting colors.',
    'Високочестотен воден знак с детайлно изображение.':
      'High-resolution watermark with detailed imagery.',
    'Високочестотен воден знак видим при светлина.':
      'High-resolution watermark visible when held up to light.',
    'Разноцветни прекъснати ивици в хартията, видими при светлина.':
      'Multicolored interrupted stripes in the paper, visible when held up to light.',
    'В средата на банкнотата на светлина се вижда тъмна лента.':
      'A dark stripe is visible across the middle of the banknote when held up to light.',
    'Холограма с променящи се изображения.': 'Hologram with changing images.',
    'Полутонов воден знак на портрета.': 'Halftone portrait watermark.',
    'Холограма с динамични изображения и преливащи цветове.':
      'Hologram with dynamic images and shifting colors.',
    'Воден знак, видим при държане срещу светлина.':
      'Watermark visible when held up to light.',
    'Холограма с птица и фигури, променящи цвят при накланяне.':
      'Hologram with a bird and figures that change color when tilted.',
    "Динамична ефектна лента, променяща цвета си при накланяне.":
      'Dynamic effect strip that changes color when tilted.',
    "3D воден знак с портрет и инициали 'БНБ'.":
      "3D watermark with a portrait and the 'BNB' initials.",
    "Вградена нишка с повторяем текст 'БНБ 10'.":
      "Embedded thread with repeating 'BNB 10' text.",
    "Вградена нишка с текст 'БНБ 20' и динамичен ефект.":
      "Embedded thread with 'BNB 20' text and a dynamic effect.",
    // howToCheck
    'Дръжте банкнотата срещу светлина и вижте водния знак.':
      'Hold the banknote up to light to see the watermark.',
    'Пипнете и усетете дали ресните са изпъкнали.':
      'Touch the edge and feel whether the lines are embossed.',
    'Пипнете и усетете дали релефът е изпъкнал.':
      'Touch and feel whether the relief is raised.',
    'Наклонете банкнотата – вижте изображението и 3D номер {N}.':
      'Tilt the banknote – the image and the 3D number {N} should appear.',
    'Наклонете банкнотата - зелената ивица на изумруденото число трябва да се мърда и да има холограмен ефект.':
      'Tilt the banknote – the green stripe on the emerald number should move with a holographic effect.',
    'Поставете срещу светлина – вижте нишката.':
      'Hold up to light to see the security thread.',
    'Погледнете банкнотата под UV светлина и сравенете елементите.':
      'Look at the banknote under UV light and compare the elements.',
    'Проверете водния знак под силна светлина.': 'Check the watermark under strong light.',
    'Изложете на светлина - портрета става прозрачен.':
      'Hold it up to light – the portrait becomes transparent.',
    'Дръжте срещу светлина – вижте водния знак.':
      'Hold up to light to see the watermark.',
    'Дръжте банкнотата срещу светлина – вижте портрета.':
      'Hold the banknote up to light to see the portrait.',
    'Дръжте срещу светлина – вижте портрета и инициали.':
      'Hold up to light to see the portrait and initials.',
    'Дръжте банкнотата срещу светлина – вижте водния знак.':
      'Hold the banknote up to light to see the watermark.',
    'Погледнете на гърба на банкнотата за холограмни прекъснати линии.':
      'Look at the back of the banknote for interrupted holographic lines.',
    'Погледнете срещу светлина за водния знак.':
      'Look at it against the light to see the watermark.',
    'Поставете срещу светлина – вижте водния знак.':
      'Hold up to light to see the watermark.',
    'Наклонете банкнотата – портретът е в прозореца.':
      'Tilt the banknote – the portrait appears in the window.',
  },
  es: {
    'Воден знак с лице, видим при поставяне срещу светлина.':
      'Marca de agua con retrato, visible al ponerlo a contraluz.',
    'Воден знак с архитектурен елемент, видим при поставяне срещу светлина.':
      'Marca de agua con un elemento arquitectónico, visible al ponerlo a contraluz.',
    'Релефни линии от лявата страна на банкнотата, които се усещат изпъкнали при допир.':
      'Líneas en relieve en el lado izquierdo del billete que se notan al tacto.',
    'Релефни линии от лявата страна на банкнотата.':
      'Líneas en relieve en el lado izquierdo del billete.',
    'Холографски образ върху вертикална лента, променящ се при накланяне.':
      'Imagen holográfica sobre una tira vertical que cambia al inclinarla.',
    'Холографски ефекти върху вертикална лента.':
      'Efectos holográficos sobre una tira vertical.',
    'Холограма със сложни изображения.': 'Holograma con imágenes complejas.',
    'Холограма със сложни изображения при накланяне.':
      'Holograma con imágenes complejas que aparecen al inclinarlo.',
    'Холографски изображения при накланяне.':
      'Imágenes holográficas visibles al inclinarlo.',
    'Погледнете изумруденото зелено число {N} в левия ъгъл на банкнотата.':
      'Mira el número {N} verde esmeralda en la esquina izquierda del billete.',
    'Вградена нишка, видима като тъмна линия при осветление.':
      'Hilo incrustado visible como una línea oscura a contraluz.',
    'Вградена нишка с микронадпис.': 'Hilo incrustado con microimpresión.',
    'Вградена нишка с микронадпис, видима при светлина.':
      'Hilo incrustado con microimpresión, visible a contraluz.',
    'Вградена нишка, видима като линия при светлина.':
      'Hilo incrustado visible como una línea a contraluz.',
    'Вградена нишка, видима при осветление.':
      'Hilo incrustado visible a contraluz.',
    'Вградена нишка, видима при държане срещу светлина.':
      'Hilo incrustado visible al poner a contraluz.',
    'Прозрачен портрет в холограмния елемент, през който преминава светлина.':
      'Retrato transparente en el elemento holográfico por el que pasa la luz.',
    'UV елементи, под формата на драскотини и други.':
      'Elementos UV en forma de fibras y marcas.',
    'Холограма с изображения и преливащи цветове.':
      'Holograma con imágenes y colores cambiantes.',
    'Високочестотен воден знак с детайлно изображение.':
      'Marca de agua de alta resolución con imagen detallada.',
    'Високочестотен воден знак видим при светлина.':
      'Marca de agua de alta resolución visible a contraluz.',
    'Разноцветни прекъснати ивици в хартията, видими при светлина.':
      'Tiras interrumpidas multicolor en el papel, visibles a contraluz.',
    'В средата на банкнотата на светлина се вижда тъмна лента.':
      'En el centro del billete se ve una franja oscura a contraluz.',
    'Холограма с променящи се изображения.': 'Holograma con imágenes cambiantes.',
    'Полутонов воден знак на портрета.': 'Marca de agua de medio tono del retrato.',
    'Холограма с динамични изображения и преливащи цветове.':
      'Holograma con imágenes dinámicas y colores cambiantes.',
    'Воден знак, видим при държане срещу светлина.':
      'Marca de agua visible al poner a contraluz.',
    'Холограма с птица и фигури, променящи цвят при накланяне.':
      'Holograma con un ave y figuras que cambian de color al inclinar.',
    'Динамична ефектна лента, променяща цвета си при накланяне.':
      'Tira dinámica de efecto que cambia de color al inclinar.',
    "3D воден знак с портрет и инициали 'БНБ'.":
      "Marca de agua 3D con retrato e iniciales 'BNB'.",
    "Вградена нишка с повторяем текст 'БНБ 10'.":
      "Hilo incrustado con texto repetido 'BNB 10'.",
    "Вградена нишка с текст 'БНБ 20' и динамичен ефект.":
      "Hilo incrustado con texto 'BNB 20' y efecto dinámico.",
    'Дръжте банкнотата срещу светлина и вижте водния знак.':
      'Pon el billete a contraluz y observa la marca de agua.',
    'Пипнете и усетете дали ресните са изпъкнали.':
      'Toca el borde y comprueba si las líneas están en relieve.',
    'Пипнете и усетете дали релефът е изпъкнал.':
      'Toca y comprueba si el relieve sobresale.',
    'Наклонете банкнотата – вижте изображението и 3D номер {N}.':
      'Inclina el billete: aparecen la imagen y el número 3D {N}.',
    'Наклонете банкнотата - зелената ивица на изумруденото число трябва да се мърда и да има холограмен ефект.':
      'Inclina el billete: la franja verde del número esmeralda debe moverse con efecto holográfico.',
    'Поставете срещу светлина – вижте нишката.':
      'Pon a contraluz para ver el hilo.',
    'Погледнете банкнотата под UV светлина и сравенете елементите.':
      'Observa el billete bajo luz UV y compara los elementos.',
    'Проверете водния знак под силна светлина.':
      'Comprueba la marca de agua con luz intensa.',
    'Изложете на светлина - портрета става прозрачен.':
      'Ponlo a contraluz: el retrato se vuelve transparente.',
    'Дръжте срещу светлина – вижте водния знак.':
      'Ponlo a contraluz para ver la marca de agua.',
    'Дръжте банкнотата срещу светлина – вижте портрета.':
      'Pon el billete a contraluz para ver el retrato.',
    'Дръжте срещу светлина – вижте портрета и инициали.':
      'Ponlo a contraluz para ver el retrato y las iniciales.',
    'Дръжте банкнотата срещу светлина – вижте водния знак.':
      'Pon el billete a contraluz para ver la marca de agua.',
    'Погледнете на гърба на банкнотата за холограмни прекъснати линии.':
      'Mira el reverso del billete: líneas holográficas interrumpidas.',
    'Погледнете срещу светлина за водния знак.':
      'Mira a contraluz para ver la marca de agua.',
    'Поставете срещу светлина – вижте водния знак.':
      'Pon a contraluz para ver la marca de agua.',
    'Наклонете банкнотата – портретът е в прозореца.':
      'Inclina el billete: el retrato aparece en la ventana.',
  },
  de: {
    'Воден знак с лице, видим при поставяне срещу светлина.':
      'Porträt-Wasserzeichen, im Gegenlicht sichtbar.',
    'Воден знак с архитектурен елемент, видим при поставяне срещу светлина.':
      'Wasserzeichen mit Architekturelement, im Gegenlicht sichtbar.',
    'Релефни линии от лявата страна на банкнотата, които се усещат изпъкнали при допир.':
      'Geprägte Linien an der linken Seite der Banknote, die sich fühlbar abheben.',
    'Релефни линии от лявата страна на банкнотата.':
      'Geprägte Linien an der linken Seite der Banknote.',
    'Холографски образ върху вертикална лента, променящ се при накланяне.':
      'Holografisches Bild auf einem senkrechten Streifen, das sich beim Kippen ändert.',
    'Холографски ефекти върху вертикална лента.':
      'Holografische Effekte auf einem senkrechten Streifen.',
    'Холограма със сложни изображения.': 'Hologramm mit komplexen Bildern.',
    'Холограма със сложни изображения при накланяне.':
      'Hologramm mit komplexen Bildern beim Kippen.',
    'Холографски изображения при накланяне.':
      'Holografische Bilder beim Kippen sichtbar.',
    'Погледнете изумруденото зелено число {N} в левия ъгъл на банкнотата.':
      'Achte auf die smaragdgrüne {N} in der linken Ecke der Banknote.',
    'Вградена нишка, видима като тъмна линия при осветление.':
      'Eingebetteter Faden, im Gegenlicht als dunkle Linie sichtbar.',
    'Вградена нишка с микронадпис.': 'Eingebetteter Faden mit Mikroschrift.',
    'Вградена нишка с микронадпис, видима при светлина.':
      'Eingebetteter Faden mit Mikroschrift, im Gegenlicht sichtbar.',
    'Вградена нишка, видима като линия при светлина.':
      'Eingebetteter Faden, im Gegenlicht als Linie sichtbar.',
    'Вградена нишка, видима при осветление.':
      'Eingebetteter Faden, im Gegenlicht sichtbar.',
    'Вградена нишка, видима при държане срещу светлина.':
      'Eingebetteter Faden, im Gegenlicht sichtbar.',
    'Прозрачен портрет в холограмния елемент, през който преминава светлина.':
      'Transparentes Porträt im Hologrammelement, durch das Licht hindurchscheint.',
    'UV елементи, под формата на драскотини и други.':
      'UV-Elemente in Form von Fasern und Markierungen.',
    'Холограма с изображения и преливащи цветове.':
      'Hologramm mit Bildern und changierenden Farben.',
    'Високочестотен воден знак с детайлно изображение.':
      'Hochauflösendes Wasserzeichen mit detaillierter Darstellung.',
    'Високочестотен воден знак видим при светлина.':
      'Hochauflösendes Wasserzeichen, im Gegenlicht sichtbar.',
    'Разноцветни прекъснати ивици в хартията, видими при светлина.':
      'Bunte unterbrochene Streifen im Papier, im Gegenlicht sichtbar.',
    'В средата на банкнотата на светлина се вижда тъмна лента.':
      'In der Mitte der Banknote ist im Gegenlicht ein dunkler Streifen sichtbar.',
    'Холограма с променящи се изображения.': 'Hologramm mit wechselnden Bildern.',
    'Полутонов воден знак на портрета.': 'Halbton-Porträt-Wasserzeichen.',
    'Холограма с динамични изображения и преливащи цветове.':
      'Hologramm mit dynamischen Bildern und changierenden Farben.',
    'Воден знак, видим при държане срещу светлина.':
      'Wasserzeichen, im Gegenlicht sichtbar.',
    'Холограма с птица и фигури, променящи цвят при накланяне.':
      'Hologramm mit Vogel und Figuren, die beim Kippen die Farbe wechseln.',
    'Динамична ефектна лента, променяща цвета си при накланяне.':
      'Dynamischer Effektstreifen, der beim Kippen die Farbe wechselt.',
    "3D воден знак с портрет и инициали 'БНБ'.":
      "3D-Wasserzeichen mit Porträt und Initialen „BNB".",
    "Вградена нишка с повторяем текст 'БНБ 10'.":
      "Eingebetteter Faden mit wiederholtem Text „BNB 10".",
    "Вградена нишка с текст 'БНБ 20' и динамичен ефект.":
      "Eingebetteter Faden mit Text „BNB 20" und dynamischem Effekt.",
    'Дръжте банкнотата срещу светлина и вижте водния знак.':
      'Halte die Banknote ins Gegenlicht und betrachte das Wasserzeichen.',
    'Пипнете и усетете дали ресните са изпъкнали.':
      'Taste den Rand ab und prüfe, ob die Linien fühlbar erhaben sind.',
    'Пипнете и усетете дали релефът е изпъкнал.':
      'Taste die Stelle ab und prüfe das spürbare Relief.',
    'Наклонете банкнотата – вижте изображението и 3D номер {N}.':
      'Kippe die Banknote – das Bild und die 3D-Zahl {N} erscheinen.',
    'Наклонете банкнотата - зелената ивица на изумруденото число трябва да се мърда и да има холограмен ефект.':
      'Kippe die Banknote – der grüne Streifen auf der Smaragdzahl muss sich bewegen und holografisch wirken.',
    'Поставете срещу светлина – вижте нишката.':
      'Ins Gegenlicht halten und den Faden betrachten.',
    'Погледнете банкнотата под UV светлина и сравенете елементите.':
      'Betrachte die Banknote unter UV-Licht und vergleiche die Elemente.',
    'Проверете водния знак под силна светлина.':
      'Prüfe das Wasserzeichen bei starkem Licht.',
    'Изложете на светлина - портрета става прозрачен.':
      'Ins Gegenlicht halten – das Porträt wird transparent.',
    'Дръжте срещу светлина – вижте водния знак.':
      'Ins Gegenlicht halten, um das Wasserzeichen zu sehen.',
    'Дръжте банкнотата срещу светлина – вижте портрета.':
      'Halte die Banknote ins Gegenlicht und betrachte das Porträt.',
    'Дръжте срещу светлина – вижте портрета и инициали.':
      'Ins Gegenlicht halten, um Porträt und Initialen zu sehen.',
    'Дръжте банкнотата срещу светлина – вижте водния знак.':
      'Halte die Banknote ins Gegenlicht, um das Wasserzeichen zu sehen.',
    'Погледнете на гърба на банкнотата за холограмни прекъснати линии.':
      'Betrachte die Rückseite – unterbrochene Hologrammlinien werden sichtbar.',
    'Погледнете срещу светлина за водния знак.':
      'Halte sie ins Gegenlicht, um das Wasserzeichen zu sehen.',
    'Поставете срещу светлина – вижте водния знак.':
      'Ins Gegenlicht halten, um das Wasserzeichen zu sehen.',
    'Наклонете банкнотата – портретът е в прозореца.':
      'Kippe die Banknote – das Porträt erscheint im Fenster.',
  },
};

const translatePhrase = (text: string, lang: Language): string => {
  if (lang === 'bg') return text;
  const dict = PHRASES[lang];
  // Exact match first.
  if (dict[text]) return dict[text];
  // Try replacing the denomination value with {N}.
  const numberMatch = text.match(/\b(\d{1,4})\b/);
  if (numberMatch) {
    const templated = text.replace(numberMatch[0], '{N}');
    const t = dict[templated];
    if (t) return t.replace('{N}', numberMatch[0]);
  }
  return text;
};

export const translateName = (name: string, lang: Language): string => {
  if (lang === 'bg') return name;
  return NAMES[lang][name] ?? name;
};

export const translateColor = (color: string, lang: Language): string => {
  if (lang === 'bg') return color;
  return COLORS[lang][color] ?? color;
};

export const translateCurrencyName = (name: string, lang: Language): string => {
  if (lang === 'bg') return name;
  return CURRENCY_NAMES[lang][name] ?? name;
};

export const translateDescription = translatePhrase;
export const translateHowToCheck = translatePhrase;

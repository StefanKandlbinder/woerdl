import './styles.scss';

let grid: HTMLElement | null = document.getElementById('grid');
let keyboardElement: HTMLElement | null = document.getElementById('keyboard');
let words: string[] = [
  'neichtl',
  'goi',
  'klappal',
  'flesserl',
  'dahoam',
  'schwanan',
  'sunbeng',
  'janker',
  'feigeln',
];

let descriptions = new Map<string, string>([
  ['goi', 'Unverkennbare Satzendung, die Zustimmung vom Zuhörer verlangt.'],
  [
    'neichtl',
    'Ungenaue Zeitangabe: Bei einem "Neichtl", kann es sich sowohl um 5 als auch um 50 Minuten handeln.',
  ],
  ['klappal', 'Sommerliches Schuhwerk oder ganz einfach "Sandalen"'],
  [
    'flesserl',
    'Das "Flesserl" ist ein oberösterreichisches Traditionsgebäck. Der zu einem Zopf geflochtene Germteig wird mit Mohn und Salz bestreut und knusprig gebacklen.',
  ],
  [
    'dahoam',
    'Daheim, also zu Hause, fühlt sich der Oberösterreicher wohl. Dieser Gedanke wurde sogar in der oö. Landeshymne verewigt.',
  ],
  [
    'schwanan',
    'Die Flunkereien rund um Weihnachten und das Christkind sind vorbei. Die Oberösterreicher schwindeln bzw. "schwanan" jetzt höchstens noch, wenn es um das Gewicht auf der Waage geht.',
  ],
  [
    'sunbeng',
    'Wenn draußen die Sonne scheint, sitzt der Oberösterreicher gern auf seiner Sunbeng. Die "Sunbeng", oder auch Sitzbank, ist ein Ort des süßen Nichtstuns und Innehaltens.',
  ],
  [
    'janker',
    'Gerade geschnittene, hüftlange Jacke aus gewalkter Schafwolle. Der Janker zählt zur Trachtenmode.',
  ],
  [
    'feigeln',
    'Das Wort ist ein Synonym für ärgern, aus der Fassung bringen. Wenn es "feigelt", dann sollte man einen gewissen Sicherheitsabstand hslten.',
  ],
]);

let row: any = [];
let rowPosition: number = 0;
let virtualKeyboard: boolean = false;
let duration: number = 400;
let keyboard = [
  ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
  ['gemma', 'y', 'x', 'c', 'v', 'b', 'n', 'm', 'zruck'],
];

function fisherYatesShuffle(arr: any) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); //random index
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
}
fisherYatesShuffle(words);

let word: string = words[0];
let delay: number = word.length * duration;

function letterEnter(e: any) {
  if (e.data !== null) {
    let element: HTMLInputElement | null = e.target as HTMLInputElement;
    let id: number = parseInt(element.getAttribute('data-id') as string, 16);
    if (id < word.length - 1) row[id + 1].focus();
  }
}

function addRow() {
  grid!.style.gridTemplateColumns = `repeat(${word.length}, 2.5rem)`;

  row = [];
  for (let i = 0; i < word.length; i++) {
    let letterDiv: HTMLElement = document.createElement('div');
    letterDiv.setAttribute('class', 'grid-element');

    let letter: HTMLInputElement = document.createElement('input');
    letter.setAttribute('class', 'grid-element-input');
    letter.setAttribute('pattern', '[A-Za-z]');
    letter.setAttribute('maxlength', '1');
    letter.setAttribute('type', 'text');
    letter.setAttribute('data-id', i.toString());
    letter.addEventListener('input', letterEnter);

    let animation: HTMLElement = document.createElement('div');
    animation.setAttribute('class', 'grid-element-animation');
    animation.setAttribute(
      'style',
      `transition-delay: calc(${duration}ms * ${i})`
    );
    letterDiv.append(letter);
    letterDiv.append(animation);
    grid!.appendChild(letterDiv);
    row.push(letter);
  }

  if (!virtualKeyboard) {
    row[0].focus();
  } else {
    rowPosition = 0;
  }

  window.scrollTo(0, document.body.scrollHeight);
}

function showSnack(
  title: string,
  description: string,
  type: string,
  delay: number
) {
  let snack: HTMLElement = document.getElementById('snack') as HTMLElement;
  snack.innerHTML = '';

  // delay the hide animation depending on the length of the description
  let readingTime: number = description!.length * 50;

  switch (type) {
    case 'success':
      snack.className = '';
      snack.classList.add('snack', 'snack-success');
      break;
    case 'warning':
      snack.className = '';
      snack.classList.add('snack', 'snack-warning');
      break;
    case 'info':
      snack.className = '';
      snack.classList.add('snack', 'snack-info');
      break;
  }

  snack.animate(
    [
      {
        transform: 'scale(0) translateX(-50%) translateY(50%)',
        transformOrigin: '0% 50%',
      },
      {
        transform: 'scale(1) translateX(-50%) translateY(50%)',
        transformOrigin: '0% 50%',
      },
    ],
    {
      duration: duration,
      iterations: 1,
      easing: 'ease-in-out',
      fill: 'both',
      delay: delay,
    }
  );

  Promise.all(
    snack.getAnimations().map(function (animation) {
      return animation.finished;
    })
  ).then(function () {
    snack.animate(
      [
        {
          transform: 'scale(1) translateX(-50%) translateY(50%)',
          transformOrigin: '0% 50%',
        },
        {
          transform: 'scale(0) translateX(-50%) translateY(50%)',
          transformOrigin: '0% 50%',
        },
      ],
      {
        duration: 100,
        iterations: 1,
        easing: 'ease-in-out',
        fill: 'both',
        delay: readingTime,
      }
    );
  });

  snack.innerHTML = title + description;
}

function done() {
  let zruck: HTMLButtonElement | null =
    document.querySelector('[data-id="zruck"');
  if (zruck) zruck!.focus();

  document.onkeydown = function (e) {
    return false;
  };

  keyboardElement!.classList.add('keyboard-disabled');
  grid!.classList.add('grid-disabled');
}

function checkRow(guess: string, word: string) {
  for (var index = 0; index < word.length; index++) {
    row[index].parentElement.classList.remove(
      'correct',
      'included',
      'not-included'
    );

    if (word[index] === guess[index]) {
      row[index].parentElement.classList.add('correct');

      let element: HTMLButtonElement | null = keyboardElement!.querySelector(
        `[data-id=${row[index].value}]`
      );
      if (element) {
        element.classList.remove('correct', 'included', 'not-included');
        element.classList.add('correct');
      }
    }

    if (word.includes(guess[index]) && word[index] !== guess[index]) {
      row[index].parentElement.classList.add('included');

      let element: HTMLButtonElement | null = keyboardElement!.querySelector(
        `[data-id=${row[index].value}]`
      );

      if (element) {
        element.classList.remove('correct', 'included', 'not-included');
        element.classList.add('included');
      }
    }

    if (!word.includes(guess[index]) && word[index] !== guess[index]) {
      row[index].parentElement.classList.add('not-included');

      let element: HTMLButtonElement | null = keyboardElement!.querySelector(
        `[data-id=${row[index].value}]`
      );
      if (element) {
        element.classList.remove('correct', 'included', 'not-included');
        element.classList.add('not-included');
      }
    }
  }

  // GREAT, yOU DID IT!
  if (guess === word) {
    let description = descriptions.get(word.toLocaleLowerCase());

    showSnack(
      '🎉 SAUWA! 🎉 <br><br>',
      `${word}: ${description}`,
      'success',
      delay
    );

    done();
    return;
  }

  // MAKES IT a LITTLE BIT EASIER
  if (!words.includes(guess.toLocaleLowerCase())) {
    showSnack(`💡 "${guess}", `, `des warat ma neich! 💡`, 'warning', delay);
    rowPosition = 0;
    addRow();
    return;
  }

  addRow();
}

function getGuess() {
  let guess: string = '';
  row.forEach((letter: HTMLInputElement) => {
    guess += letter.value;
  });
  return guess;
}

function keyboardBack() {
  if (rowPosition >= 1 && rowPosition !== row.length - 1) {
    rowPosition -= 1;
    row[rowPosition].value = '';
    return;
  }
  if (
    rowPosition >= 1 &&
    rowPosition === row.length - 1 &&
    row[row.length - 1].value !== ''
  ) {
    row[rowPosition].value = '';
    return;
  }
  if (
    rowPosition >= 1 &&
    rowPosition === row.length - 1 &&
    row[row.length - 1].value === ''
  ) {
    rowPosition -= 1;
    row[rowPosition].value = '';
  }
}

function keyboardEnter(e: any) {
  if (e.data !== null) {
    let character = e.target.dataset.id;
    virtualKeyboard = true;

    switch (character) {
      case 'zruck':
        keyboardBack();
        break;
      case 'gemma':
        rowPosition === row.length - 1 && row[row.length - 1].value !== ''
          ? checkRow(getGuess(), word)
          : null;
        break;
      default:
        row[rowPosition].value = character;
        rowPosition < row.length - 1
          ? (rowPosition += 1)
          : (rowPosition = row.length - 1);
        break;
    }
  }
}

function createKeyboard(keyboard: any) {
  for (let i = 0; i < keyboard.length; i++) {
    let keyRow: HTMLElement = document.createElement('div');
    keyRow.setAttribute('class', 'keyboard-row');

    for (let j = 0; j < keyboard[i].length; j++) {
      let key: HTMLButtonElement = document.createElement('button');
      key.setAttribute('class', 'keyboard-key');
      key.setAttribute('data-id', keyboard[i][j]);
      key.addEventListener('click', keyboardEnter);
      keyboard[i][j] === 'enter' || keyboard[i][j] === '←'
        ? key.classList.add('col-span-2')
        : '';
      key.innerHTML = keyboard[i][j];
      keyRow.appendChild(key);
    }
    keyboardElement!.appendChild(keyRow);
  }
}

createKeyboard(keyboard);

document.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    let guess = '';

    row.forEach((letter: HTMLInputElement) => {
      guess += letter.value;
    });

    if (guess.length === word.length && guess) {
      checkRow(guess.toUpperCase(), word.toUpperCase());
    }
  }
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Backspace') {
    event.preventDefault();

    // grab the element which is in focus
    let activeElement: HTMLInputElement | null =
      document.activeElement as HTMLInputElement;

    // get the id of the element in focus
    let id: number = parseInt(
      activeElement.getAttribute('data-id') as string,
      16
    );

    /*
     * if i am an entry and not the last
     * focus and clear the previous one
     */
    if (id < word.length - 1 && id > 0) {
      row[id - 1].focus();
      row[id - 1].value = '';
    }

    /*
     * if i am the last and not empty => keep the focus
     * and clear me
     */

    if (id === word.length - 1 && row[id].value !== '') {
      row[id].focus();
      row[id].value = '';
      return;
    }

    /*
     * if i am the last and empty => focus
     * and clear my brother on the left
     */
    if (id === word.length - 1 && row[id].value === '') {
      row[id - 1].focus();
      row[id - 1].value = '';
    }
  }
});

showSnack(
  `WÖRDL!<br><br>`,
  `Spielerisch die oberösterreichische Mundart kultivieren. <br>Damit es dann im "µ/4" mit der Wegbeschreibung klappt...`,
  'info',
  500
);

addRow();

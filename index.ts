import './styles.scss';

// the surrounding container
let container: HTMLElement | null = document.getElementById('container');

// the characters grid
let grid: HTMLElement | null;

// the virtual keyboard
let keyboardElement: HTMLElement | null = document.getElementById('keyboard');

// a list if all the words to guess
let words: string[] = [
  'neichtl',
  'klappal',
  'sunbeng',
  'goi',
  'schwanan',
  'flesserl',
  'dahoam',
  'janker',
  'feigeln',
  'drawig',
  'zega',
];

// the corresponding descriptions of the words
let descriptions = new Map<string, string>([
  ['goi', 'Unverkennbare Satzendung, die Zustimmung vom Zuhörer verlangt.'],
  [
    'neichtl',
    'Ungenaue Zeitangabe: Bei einem "Neichtl", kann es sich sowohl um 5 als auch um 50 Minuten handeln.',
  ],
  ['klappal', 'Sommerliches Schuhwerk oder ganz einfach "Sandalen"'],
  [
    'flesserl',
    'Das "Flesserl" ist ein oberösterreichisches Traditionsgebäck. Der zu einem Zopf geflochtene Germteig wird mit Mohn und Salz bestreut und knusprig gebacken.',
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
    'Wenn draußen die Sonne scheint, sitzt der Oberösterreicher gern auf seiner "Sunbeng". Die "Sunbeng", oder auch Sitzbank, ist ein Ort des süßen Nichtstuns und Innehaltens.',
  ],
  [
    'janker',
    'Gerade geschnittene, hüftlange Jacke aus gewalkter Schafwolle. Der Janker zählt zur Trachtenmode.',
  ],
  [
    'feigeln',
    'Das Wort ist ein Synonym für ärgern, aus der Fassung bringen. Wenn es "feigelt", dann sollte man zur jeweiligen Person einen gewissen Sicherheitsabstand halten.',
  ],
  [
    'drawig',
    'Die Zeit vor Weihnachten ist of geprägt Stress und Hektik. Der Oberösterreicher hat es dann of "drawig", also eilig. Gut, wenn das Jahr dann "gmiadli", also gemütlich beginnt.',
  ],
  [
    'zega',
    'Ein Korb oder Eimer wird häufig als "Zega" bezeichnet. Früher wurde der "Zega" oft zum Transport von Erdäpfeln verwendet.',
  ],
]);

// the active row
let row: any = [];
let addRowTimeout = null;
let addRowInit = true;

// the position of the active character
let rowPosition: number = 0;

// duration of the character animation
let duration: number = parseInt(
  getComputedStyle(document.documentElement)
    .getPropertyValue('--duration')
    .split('ms')[0]
);

// keyvoard layout
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

// the word to guess
let word: string = words[0];

// the delay when the character animation is finished
let delay: number = word.length * duration;

// add a new row to the grid
function addRow() {
  grid = document.createElement('div');
  grid.setAttribute('class', 'grid');
  grid!.style.gridTemplateColumns = `repeat(${word.length}, 2.5rem)`;
  container!.appendChild(grid);

  function doIt() {
    row = [];
    for (let i = 0; i < word.length; i++) {
      let letter: HTMLElement = document.createElement('div');
      letter.setAttribute('class', 'grid-element grid-element-animation-check');
      letter.setAttribute(
        'style',
        `transition-delay: calc(${duration}ms * ${i})`
      );
      letter.setAttribute('data-id', i.toString());

      grid!.appendChild(letter);
      row.push(letter);
    }

    const showDuration: number = 280 / word.length;

    row.map((item: any, index: number) => {
      item.animate(
        [
          {
            transform: 'scale(0.1)',
            opacity: '0.1',
          },
          {
            transform: 'scale(1.3)',
            opacity: '1',
          },
          {
            transform: 'scale(1)',
            opacity: '1',
          },
        ],
        {
          duration: showDuration,
          iterations: 1,
          easing: 'ease-in-out',
          fill: 'backwards',
          delay: index * showDuration,
        }
      );
    });

    Promise.all(
      row[row.length - 1].getAnimations().map(function (animation: any) {
        return animation.finished;
      })
    ).then(function () {
      addRowInit = false;
    });

    rowPosition = 0;

    window.scrollTo(0, document.body.scrollHeight);
  }

  if (!addRowInit) {
    addRowTimeout = window.setTimeout(() => {
      doIt();
    }, word.length * duration);
    return;
  } else {
    doIt();
    return;
  }
}

// show some information
function showSnack(
  title: string,
  description: string,
  type: string,
  delay: number,
  readingMulti: number
) {
  let snack: HTMLElement = document.getElementById('snack') as HTMLElement;
  snack.innerHTML = '';

  // delay the hide animation depending on the length of the description
  let readingTime: number = description!.length * readingMulti;

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
    case 'intro':
      snack.className = '';
      snack.classList.add('snack', 'snack-intro');
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
      duration: duration ? duration : 400,
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

// yeeeha, you got it right
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

// compare the guess to the actual word and give some hints
function checkRow(guess: string, word: string) {
  document.documentElement.style.setProperty(
    '--key-state-delay',
    `${word.length * duration}ms`
  );

  function setLetterState() {
    for (var index = 0; index < word.length; index++) {
      row[index].classList.remove('correct', 'included', 'not-included');

      if (word[index] === guess[index]) {
        row[index].classList.add('correct');

        let element: HTMLButtonElement | null = keyboardElement!.querySelector(
          `[data-id=${row[index].innerHTML}]`
        );
        if (element) {
          element.classList.remove('correct', 'included', 'not-included');
          element.classList.add('correct');
        }
      }

      if (word.includes(guess[index]) && word[index] !== guess[index]) {
        row[index].classList.add('included');

        let element: HTMLButtonElement | null = keyboardElement!.querySelector(
          `[data-id=${row[index].innerHTML}]`
        );

        if (element) {
          element.classList.remove('correct', 'included', 'not-included');
          element.classList.add('included');
        }
      }

      if (!word.includes(guess[index]) && word[index] !== guess[index]) {
        row[index].classList.add('not-included');

        let element: HTMLButtonElement | null = keyboardElement!.querySelector(
          `[data-id=${row[index].innerHTML}]`
        );
        if (element) {
          element.classList.remove('correct', 'included', 'not-included');
          element.classList.add('not-included');
        }
      }
    }
  }

  // GREAT, yOU DID IT!
  if (guess === word) {
    setLetterState();

    let description = descriptions.get(word.toLocaleLowerCase());

    showSnack(
      '🎉 SAUWA! 🎉 <br><br>',
      `${word.toUpperCase()}: ${description}`,
      'success',
      delay,
      50
    );

    done();
    return;
  }

  // MAKES IT a LITTLE BIT EASIER
  if (!words.includes(guess.toLocaleLowerCase())) {
    grid!.animate(
      [
        {
          transform: 'translateX(0)',
        },
        {
          transform: 'translateX(-3%)',
        },
        {
          transform: 'translateX(3%)',
        },
        {
          transform: 'translateX(-3%)',
        },
        {
          transform: 'translateX(0)',
        },
      ],
      {
        duration: 250,
        iterations: 1,
        easing: 'ease-in-out',
        fill: 'both',
        delay: word.length * duration,
      }
    );

    showSnack(
      `💡 "${guess.toUpperCase()}", `,
      `des warat ma gonz wos neichs! 💡`,
      'warning',
      word.length * duration,
      50
    );
    setLetterState();
    rowPosition = 0;
    addRow();
    return;
  }

  if (words.includes(guess.toLocaleLowerCase())) {
    setLetterState();
    rowPosition = 0;
    addRow();
  }
}

// grab your guess and make a word out of it
function getGuess() {
  let guess: string = '';
  row.forEach((letter: HTMLElement) => {
    guess += letter.innerHTML;
  });
  return guess;
}

// do the virtual keyboards back button
function keyboardBack() {
  if (rowPosition >= 1 && rowPosition !== row.length - 1) {
    rowPosition -= 1;
    row[rowPosition].classList.remove('grid-element-animation-input');
    row[rowPosition].innerHTML = '';
    return;
  }
  if (
    rowPosition >= 1 &&
    rowPosition === row.length - 1 &&
    row[row.length - 1].innerHTML !== ''
  ) {
    row[rowPosition].classList.remove('grid-element-animation-input');
    row[rowPosition].innerHTML = '';
    return;
  }
  if (
    rowPosition >= 1 &&
    rowPosition === row.length - 1 &&
    row[row.length - 1].innerHTML === ''
  ) {
    rowPosition -= 1;
    row[rowPosition].classList.remove('grid-element-animation-input');
    row[rowPosition].innerHTML = '';
  }
}

// manage the virtual keyboard inputs
function keyboardEnter(character: string) {
  if (character !== '') {
    switch (character) {
      case 'zruck':
      case 'Backspace':
        keyboardBack();
        break;
      case 'gemma':
      case 'Enter':
        rowPosition === row.length - 1 && row[row.length - 1].innerHTML !== ''
          ? checkRow(getGuess(), word)
          : null;
        break;
      default:
        row[rowPosition].classList.add('grid-element-animation-input');
        row[rowPosition].innerHTML = character;
        rowPosition < row.length - 1
          ? (rowPosition += 1)
          : (rowPosition = row.length - 1);
        break;
    }
  }
}

// create the virtual keyboard depending on the layout
function createKeyboard(keyboard: any) {
  for (let i = 0; i < keyboard.length; i++) {
    let keyRow: HTMLElement = document.createElement('div');
    keyRow.setAttribute('class', 'keyboard-row');

    for (let j = 0; j < keyboard[i].length; j++) {
      let key: HTMLButtonElement = document.createElement('button');
      key.setAttribute('class', 'keyboard-key');
      key.setAttribute('data-id', keyboard[i][j]);
      key.addEventListener('click', () => {
        keyboardEnter(keyboard[i][j]);
      });
      keyboard[i][j] === 'gemma' || keyboard[i][j] === 'zruck'
        ? key.classList.add('col-span-2')
        : '';
      key.innerHTML = keyboard[i][j];
      keyRow.appendChild(key);
    }
    keyboardElement!.appendChild(keyRow);
  }
}

createKeyboard(keyboard);

// handle the native enter event
document.addEventListener('keyup', function (event) {
  keyboardEnter(event.key);
});

showSnack(
  ``,
  `<div class="text-sm text-left">Spielerisch die oberösterreichische Mundart kultivieren. <br>Damit es dann im "µ/4" mit der Wegbeschreibung klappt...<br><hr>
  <p>Nach jedem Versuch ändert sich die Farbe der Kacheln.</p>
  <strong>Beispiele:</strong>
  <div class="grid" style="grid-template-columns: repeat(6, 2.5rem);">
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">K</span>
    </div>
    <div class="grid-element grid-element-animation-check grid-element-animation-input included" style="transition-delay: 0">I</div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">W</span>
    </div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">A</span>
    </div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">R</span>
    </div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">A</span>
    </div>
  </div>
  <p>Der Buchstabe I ist im Wort enthalten, aber an der falschen Stelle.</p>
  <div class="grid" style="grid-template-columns: repeat(6, 2.5rem);">
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">D</span>
    </div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">A</span>
    </div>
    <div class="grid-element grid-element-animation-check grid-element-animation-input correct" style="transition-delay: 0">H</div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">O</span>
    </div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">A</span>
    </div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">M</span>
    </div>
  </div>
  <p>Der Buchstabe H ist im Wort enthalten und an der richtigen Stelle.</p>
  <div class="grid" style="grid-template-columns: repeat(6, 2.5rem);">
    <div class="grid-element grid-element-animation-check grid-element-animation-input not-included" style="transition-delay: 0">D</div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">R</span>
    </div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">A</span>
    </div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">W</span>
    </div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">I</span>
    </div>
    <div class="grid-element">
      <span class="grid-element-input grid-element-animation-input">G</span>
    </div>
  </div>
  <p>Der Buchstabe D ist im Wort nicht enthalten.</p>
  </div>`,
  'intro',
  500,
  4.5
);

addRow();

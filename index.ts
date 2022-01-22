import './styles.scss';

let grid: HTMLElement | null = document.getElementById('grid');
let words: string[] = [
  'goi',
  'neichtl',
  'klappal',
  'flesserl',
  'dahoam',
  'schwanan',
];

let descriptions = new Map<string, string>([
  ['goi', 'Unverkennbare Satzendung, die zustimmung vom Zuhörer verlangt.'],
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
]);

let row: any = [];
let duration: number = 400;
let count: number = 0;

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
  row[0].focus();
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

function checkRow(guess: string, word: string) {
  for (var index = 0; index < word.length; index++) {
    row[index].parentElement.classList.remove(
      'correct',
      'included',
      'not-included'
    );

    if (word[index] === guess[index]) {
      row[index].parentElement.classList.add('correct');
    }

    if (word.includes(guess[index]) && word[index] !== guess[index]) {
      row[index].parentElement.classList.add('included');
    }

    if (!word.includes(guess[index]) && word[index] !== guess[index]) {
      row[index].parentElement.classList.add('not-included');
    }
  }

  // GREAT, yOU DID IT!
  if (guess === word) {
    let description = descriptions.get(word.toLocaleLowerCase());
    count += 1;

    showSnack(
      '🎉 SAUWA! 🎉 <br><br>',
      `${word}: ${description}`,
      'success',
      delay
    );

    word = words[count];
    // addRow();
    return;
  }

  // MAKES IT a LITTLE BIT EASIER
  if (!words.includes(guess.toLocaleLowerCase())) {
    showSnack(`💡 "${guess}"`, ` des sogt ma nix! 💡`, 'warning', delay);
    addRow();
    return;
  }
}

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
  `Spielerisch ein oberösterreichisches Kulturgut - die Mundart erhalten. <br>Damit es dann auch in Kollerschlag mir der Wegbeschreibug klappt...`,
  'info',
  500
);

addRow();

import { generateAIQuestions } from './aiGenerator';

// Question Service: Infinite Dynamic & Internet-Sourced Engine (Visual & Analytical Thinking)
// Strictly calibrated by age to ensure no questions exceed the child's age!

const SEEN_QUESTIONS_KEY = 'thinksheet_infinite_unseen_signatures_v3';

export const CATEGORY_DESCRIPTIONS = {
  Visual:
    'Develop your ability to analyze and/or spot visual information in order to solve a problem',
  'Analytical Thinking':
    'Develop your ability to plan and breakdown information in order to analyze and solve complex problems'
};

// Helper to shuffle an array
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Format 4 options with A, B, C, D letters and find the correct ID
function buildOptions(correctText, distractors) {
  const uniqueDistractors = Array.from(
    new Set(distractors.filter((d) => d !== correctText))
  );
  const chosenDistractors = shuffleArray(uniqueDistractors).slice(0, 3);

  while (chosenDistractors.length < 3) {
    chosenDistractors.push(`Choice ${chosenDistractors.length + 1}`);
  }

  const allChoices = shuffleArray([correctText, ...chosenDistractors]);
  const letters = ['A', 'B', 'C', 'D'];
  const correctIdx = allChoices.indexOf(correctText);

  return {
    options: allChoices.map((txt, idx) => ({ id: letters[idx], text: txt })),
    correctAnswerId: letters[correctIdx]
  };
}

// -------------------------------------------------------------
// 1. AGE-TAGGED ANALYTICAL THINKING TEMPLATES
// -------------------------------------------------------------

const ANALOGY_TEMPLATES = [
  // Age 3-4 (Preschool: Animal sounds, basic baby animals, basic opposites)
  {
    minAge: 3,
    maxAge: 4,
    item1: 'Dog 🐕',
    rel1: 'Bark 🐶',
    item2: 'Cat 🐈',
    correct: 'Meow 🐱',
    distractors: ['Roar 🦁', 'Quack 🦆', 'Moo 🐮'],
    hint: 'What sound does a cat make when asking for milk?'
  },
  {
    minAge: 3,
    maxAge: 4,
    item1: 'Puppy 🐶',
    rel1: 'Dog 🐕',
    item2: 'Kitten 🐱',
    correct: 'Cat 🐈',
    distractors: ['Cow 🐄', 'Bird 🐦', 'Duck 🦆'],
    hint: 'What does a little kitten grow into?'
  },
  {
    minAge: 3,
    maxAge: 4,
    item1: 'Duck 🦆',
    rel1: 'Quack 🦆',
    item2: 'Cow 🐄',
    correct: 'Moo 🐮',
    distractors: ['Bark 🐶', 'Meow 🐱', 'Chirp 🐦'],
    hint: 'What sound does a cow make in the farm meadow?'
  },
  {
    minAge: 3,
    maxAge: 4,
    item1: 'Cold 🧊',
    rel1: 'Ice Cube 🧊',
    item2: 'Hot 🔥',
    correct: 'Fire 🔥',
    distractors: ['Snow ❄️', 'Cold Milk 🥛', 'Ice Cream 🍦'],
    hint: 'Which one is hot and burns?'
  },
  {
    minAge: 3,
    maxAge: 4,
    item1: 'Day ☀️',
    rel1: 'Sun ☀️',
    item2: 'Night 🌙',
    correct: 'Moon 🌙',
    distractors: ['Cloud ☁️', 'Rainbow 🌈', 'Beach 🏖️'],
    hint: 'What shines brightly in the dark night sky?'
  },

  // Age 5 (Kindergarten: Body senses, clothing, nature, opposites)
  {
    minAge: 4,
    maxAge: 5,
    item1: 'Ear 👂',
    rel1: 'Headphones 🎧',
    item2: 'Eye 👁️',
    correct: 'Glasses 👓',
    distractors: ['Hat 🧢', 'Shoes 👟', 'Belt 🥋'],
    hint: 'What do you wear in front of your eyes to see better?'
  },
  {
    minAge: 4,
    maxAge: 5,
    item1: 'Foot 🦶',
    rel1: 'Shoe 👟',
    item2: 'Hand ✋',
    correct: 'Glove 🧤',
    distractors: ['Pants 👖', 'Necklace 📿', 'Socks 🧦'],
    hint: 'What do you wear over your fingers to keep hands warm?'
  },
  {
    minAge: 4,
    maxAge: 5,
    item1: 'Bird 🐦',
    rel1: 'Wings 🪽',
    item2: 'Fish 🐟',
    correct: 'Fins 🐠',
    distractors: ['Legs 🦵', 'Feathers 🪶', 'Beak 🦆'],
    hint: 'What body parts help a swimming fish steer in water?'
  },
  {
    minAge: 4,
    maxAge: 5,
    item1: 'Spider 🕷️',
    rel1: 'Web 🕸️',
    item2: 'Bee 🐝',
    correct: 'Beehive 🍯',
    distractors: ['Tree branch 🌿', 'Ocean 🌊', 'Burrow 🕳️'],
    hint: 'Where do honeybees live and make their sweet honey?'
  },
  {
    minAge: 4,
    maxAge: 5,
    item1: 'Caterpillar 🐛',
    rel1: 'Butterfly 🦋',
    item2: 'Tadpole 🏊',
    correct: 'Frog 🐸',
    distractors: ['Duck 🦆', 'Fish 🐟', 'Turtle 🐢'],
    hint: 'What hopping green animal does a baby swimming tadpole grow into?'
  },
  {
    minAge: 4,
    maxAge: 5,
    item1: 'Fast ⚡',
    rel1: 'Cheetah 🐆',
    item2: 'Slow ⏳',
    correct: 'Turtle 🐢',
    distractors: ['Rocket 🚀', 'Eagle 🦅', 'Horse 🐎'],
    hint: 'Which animal is known for moving very slowly with a hard shell?'
  },
  {
    minAge: 4,
    maxAge: 5,
    item1: 'Winter ❄️',
    rel1: 'Snowman ☃️',
    item2: 'Summer ☀️',
    correct: 'Sandcastle 🏖️',
    distractors: ['Snowflake ❄️', 'Hot heater 🔥', 'Wool coat 🧥'],
    hint: 'What fun sculpture do kids build with wet sand on a warm beach?'
  },
  {
    minAge: 4,
    maxAge: 5,
    item1: 'Good 😊',
    rel1: 'Bad ❌',
    item2: 'Up ⬆️',
    correct: 'Down ⬇️',
    distractors: ['Left ⬅️', 'Right ➡️', 'Circle ⭕'],
    hint: 'What is the opposite direction of Up?'
  },

  // Age 6+ (Early Elementary: Professions, habitats, functional tools)
  {
    minAge: 6,
    maxAge: 9,
    item1: 'Painter 🎨',
    rel1: 'Brush 🖌️',
    item2: 'Writer ✍️',
    correct: 'Pencil ✏️',
    distractors: ['Hammer 🔨', 'Fork 🍴', 'Spoon 🥄'],
    hint: 'What tool does someone write with on paper?'
  },
  {
    minAge: 6,
    maxAge: 9,
    item1: 'Doctor 🩺',
    rel1: 'Hospital 🏥',
    item2: 'Teacher 📚',
    correct: 'School 🏫',
    distractors: ['Airport ✈️', 'Park 🌳', 'Zoo 🦁'],
    hint: 'Where does a teacher teach students every day?'
  },
  {
    minAge: 6,
    maxAge: 9,
    item1: 'Car 🚗',
    rel1: 'Garage 🏠',
    item2: 'Airplane ✈️',
    correct: 'Hangar 🏢',
    distractors: ['Nest 🪺', 'Pond 🌊', 'Cave 🪨'],
    hint: 'Where do big airplanes park when they rest at the airport?'
  },
  {
    minAge: 6,
    maxAge: 9,
    item1: 'Camel 🐪',
    rel1: 'Desert 🏜️',
    item2: 'Penguin 🐧',
    correct: 'Antarctica Ice ❄️',
    distractors: ['Jungle 🌴', 'Forest 🌲', 'City 🏙️'],
    hint: 'Where do cold-loving penguins live in the snow and icy waters?'
  }
];

const ODD_ONE_OUT_TEMPLATES = [
  // Age 3-4
  {
    minAge: 3,
    maxAge: 4,
    category: 'Creatures that fly',
    odd: 'Goldfish 🐟',
    correctReason: 'A goldfish swims in water and cannot fly in the air.',
    distractors: ['Sparrow 🐦', 'Eagle 🦅', 'Butterfly 🦋']
  },
  {
    minAge: 3,
    maxAge: 4,
    category: 'Delicious fruits to eat',
    odd: 'Toy Block 🧱',
    correctReason: 'A toy block is for building, not for eating!',
    distractors: ['Red Apple 🍎', 'Sweet Banana 🍌', 'Orange 🍊']
  },
  // Age 5
  {
    minAge: 4,
    maxAge: 5,
    category: 'Things worn in the cold winter',
    odd: 'Swimming Shorts 🩳',
    correctReason: 'Swimming shorts are worn on the beach in summer, not in snowy winter.',
    distractors: ['Woolen Beanie 🧶', 'Puffer Jacket 🧥', 'Warm Mittens 🧤']
  },
  {
    minAge: 4,
    maxAge: 5,
    category: 'Four-legged walking animals',
    odd: 'Yellow Duck 🦆',
    correctReason: 'A duck is a bird that has 2 webbed feet, while others have 4 legs.',
    distractors: ['Dog 🐕', 'Cat 🐈', 'Horse 🐎']
  },
  // Age 6+
  {
    minAge: 6,
    maxAge: 9,
    category: 'Living things that grow and breathe',
    odd: 'Smartphone 📱',
    correctReason: 'A smartphone is an electronic machine, while trees and animals are living things.',
    distractors: ['Oak Tree 🌳', 'Rabbit 🐰', 'Daisy Flower 🌼']
  }
];

const CAUSE_EFFECT_TEMPLATES = [
  // Age 3-4
  {
    minAge: 3,
    maxAge: 4,
    scenario: 'You drop an ice cube 🧊 on a warm sunny table ☀️',
    correct: 'It melts into clear water 💧',
    distractors: [
      'It turns into a rock 🪨',
      'It flies up into the sky ☁️',
      'It catches fire 🔥'
    ],
    explanation: 'Heat from the warm sun turns cold solid ice into liquid water.'
  },
  // Age 5
  {
    minAge: 4,
    maxAge: 5,
    scenario: 'You plant a tiny seed in rich soil and water it every day 🌱',
    correct: 'It sprouts roots and grows into a plant 🌻',
    distractors: [
      'It disappears forever ❌',
      'It turns into a toy train 🚂',
      'It freezes into ice 🧊'
    ],
    explanation: 'Water and sunlight provide energy for seeds to grow into healthy plants.'
  },
  {
    minAge: 4,
    maxAge: 5,
    scenario: 'You let go of a helium balloon 🎈 outdoors in the park',
    correct: 'It floats high up into the sky ☁️',
    distractors: [
      'It sinks deep underground 🕳️',
      'It turns into a swimming fish 🐟',
      'It stops and freezes in place 🛑'
    ],
    explanation: 'Helium is lighter than air, making the balloon float upward.'
  }
];

// -------------------------------------------------------------
// 2. PROCEDURAL GENERATORS (AGE FILTERED)
// -------------------------------------------------------------

function generateInfiniteAnalyticalQuestion(seenSignatures, kidAge = 5) {
  const eligibleAnalogies = ANALOGY_TEMPLATES.filter(
    (t) => t.minAge <= kidAge && (t.maxAge ? t.maxAge >= kidAge : true)
  );
  const eligibleOdds = ODD_ONE_OUT_TEMPLATES.filter(
    (t) => t.minAge <= kidAge && (t.maxAge ? t.maxAge >= kidAge : true)
  );
  const eligibleCauses = CAUSE_EFFECT_TEMPLATES.filter(
    (t) => t.minAge <= kidAge && (t.maxAge ? t.maxAge >= kidAge : true)
  );

  const fallbackAnalogies = eligibleAnalogies.length > 0 ? eligibleAnalogies : ANALOGY_TEMPLATES;
  const fallbackOdds = eligibleOdds.length > 0 ? eligibleOdds : ODD_ONE_OUT_TEMPLATES;
  const fallbackCauses = eligibleCauses.length > 0 ? eligibleCauses : CAUSE_EFFECT_TEMPLATES;

  const mode = Math.floor(Math.random() * 3);

  if (mode === 0) {
    const tmpl = fallbackAnalogies[Math.floor(Math.random() * fallbackAnalogies.length)];
    const signature = `analogy_${tmpl.item1}_${tmpl.item2}_${tmpl.correct}`;
    const { options, correctAnswerId } = buildOptions(tmpl.correct, tmpl.distractors);

    return {
      id: `dyn_ana_${Date.now()}_${Math.random()}`,
      signature,
      category: 'Analytical Thinking',
      categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
      question: `If ${tmpl.item1} is to ${tmpl.rel1}, then ${tmpl.item2} is to?`,
      promptAudio: `If ${tmpl.item1} is to ${tmpl.rel1}, then ${tmpl.item2} is to what?`,
      diagramType: null,
      diagramData: null,
      options,
      correctAnswerId,
      solutionText: `Because ${tmpl.item1} pairs with ${tmpl.rel1}, ${tmpl.item2} correctly pairs with ${tmpl.correct}.`,
      solutionDiagramType: null,
      solutionDiagramData: null,
      hint: tmpl.hint
    };
  }

  if (mode === 1) {
    const tmpl = fallbackOdds[Math.floor(Math.random() * fallbackOdds.length)];
    const signature = `odd_${tmpl.category}_${tmpl.odd}`;
    const { options, correctAnswerId } = buildOptions(tmpl.odd, tmpl.distractors);

    return {
      id: `dyn_odd_${Date.now()}_${Math.random()}`,
      signature,
      category: 'Analytical Thinking',
      categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
      question: `Which one does NOT belong with the other items? (${tmpl.category})`,
      promptAudio: `Which one does not belong with the other items?`,
      diagramType: null,
      diagramData: null,
      options,
      correctAnswerId,
      solutionText: `${tmpl.odd} is the odd one out! ${tmpl.correctReason}`,
      solutionDiagramType: null,
      solutionDiagramData: null,
      hint: `Think carefully about what the other 3 items all have in common.`
    };
  }

  // Cause and effect
  const tmpl = fallbackCauses[Math.floor(Math.random() * fallbackCauses.length)];
  const signature = `cause_${tmpl.scenario}_${tmpl.correct}`;
  const { options, correctAnswerId } = buildOptions(tmpl.correct, tmpl.distractors);

  return {
    id: `dyn_cause_${Date.now()}_${Math.random()}`,
    signature,
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: `What will happen next if: "${tmpl.scenario}"?`,
    promptAudio: `What will happen next?`,
    diagramType: null,
    diagramData: null,
    options,
    correctAnswerId,
    solutionText: `${tmpl.correct} — ${tmpl.explanation}`,
    solutionDiagramType: null,
    solutionDiagramData: null,
    hint: `Imagine this happening in real life. What happens right after?`
  };
}

function generateInfiniteVisualQuestion(seenSignatures, kidAge = 5) {
  let puzzleKinds = [
    'grid-tiles',
    'pattern-shapes',
    'apple-counting',
    'scale-balance'
  ];

  if (kidAge >= 5) {
    puzzleKinds.push('block-tower', 'paper-cut', 'butterfly-symmetry', 'rocket-maze');
  }

  for (let attempt = 0; attempt < 30; attempt++) {
    const kind = puzzleKinds[Math.floor(Math.random() * puzzleKinds.length)];

    if (kind === 'grid-tiles') {
      let possibleGrids;
      if (kidAge <= 4) {
        possibleGrids = [
          { rows: 4, cols: 4, holeW: 2, holeH: 2, holeRow: 1, holeCol: 1 },
          { rows: 3, cols: 3, holeW: 1, holeH: 2, holeRow: 1, holeCol: 1 },
          { rows: 4, cols: 4, holeW: 1, holeH: 3, holeRow: 1, holeCol: 1 }
        ];
      } else if (kidAge === 5) {
        possibleGrids = [
          { rows: 4, cols: 4, holeW: 2, holeH: 2, holeRow: 1, holeCol: 1 },
          { rows: 5, cols: 5, holeW: 2, holeH: 3, holeRow: 1, holeCol: 1 },
          { rows: 5, cols: 5, holeW: 3, holeH: 2, holeRow: 2, holeCol: 1 },
          { rows: 6, cols: 6, holeW: 3, holeH: 3, holeRow: 1, holeCol: 2 }
        ];
      } else {
        possibleGrids = [
          { rows: 6, cols: 6, holeW: 4, holeH: 2, holeRow: 2, holeCol: 1 },
          { rows: 6, cols: 6, holeW: 2, holeH: 4, holeRow: 1, holeCol: 2 },
          { rows: 7, cols: 7, holeW: 3, holeH: 4, holeRow: 2, holeCol: 2 },
          { rows: 7, cols: 7, holeW: 4, holeH: 3, holeRow: 2, holeCol: 2 }
        ];
      }

      const g = possibleGrids[Math.floor(Math.random() * possibleGrids.length)];
      const count = g.holeW * g.holeH;
      const signature = `grid_${g.rows}x${g.cols}_hole_${g.holeW}x${g.holeH}_${g.holeRow}_${g.holeCol}`;

      if (!seenSignatures.has(signature) || attempt > 25) {
        seenSignatures.add(signature);
        const { options, correctAnswerId } = buildOptions(`${count}`, [
          `${count - 1}`,
          `${count + 1}`,
          `${count - 2 > 0 ? count - 2 : count + 3}`,
          `${count + 2}`
        ]);

        return {
          id: `vis_grid_${Date.now()}_${Math.random()}`,
          signature,
          category: 'Visual',
          categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
          question: `How many more tiles are needed to fill in the empty area (${g.rows}x${g.cols} grid)?`,
          promptAudio: 'How many more tiles will be needed to fill in the empty area?',
          diagramType: 'grid-tiles',
          diagramData: { ...g, count },
          options,
          correctAnswerId,
          solutionText: `${count} tiles are needed to fill the ${g.holeH} rows of ${g.holeW} tiles.`,
          solutionDiagramType: 'grid-tiles',
          solutionDiagramData: { ...g, count },
          hint: `Count the empty spaces: ${g.holeH} rows of ${g.holeW} columns = ${count} tiles.`
        };
      }
    }

    if (kind === 'pattern-shapes') {
      const itemSets = [
        ['🍎', '🍌', '🍇', '🍊', '🍓'],
        ['●', '▲', '■', '⭐', '🔷'],
        ['🚗', '✈️', '🚀', '🚂', '🚁'],
        ['🐶', '🐱', '🐰', '🐼', '🦊'],
        ['☀️', '🌙', '⭐', '☁️', '🌈']
      ];
      const items = itemSets[Math.floor(Math.random() * itemSets.length)];
      const ruleType = kidAge <= 4 ? 0 : Math.floor(Math.random() * 3); // 0: ABAB, 1: AABAAB, 2: ABCABC

      let seq = [];
      let next = '';
      if (ruleType === 0) {
        seq = [items[0], items[1], items[0], items[1], items[0]];
        next = items[1];
      } else if (ruleType === 1) {
        seq = [items[0], items[0], items[1], items[0], items[0]];
        next = items[1];
      } else {
        seq = [items[0], items[1], items[2], items[0], items[1]];
        next = items[2];
      }

      const signature = `pattern_${seq.join('_')}_next_${next}`;
      if (!seenSignatures.has(signature) || attempt > 25) {
        seenSignatures.add(signature);
        const { options, correctAnswerId } = buildOptions(next, [
          items[0],
          items[1],
          items[2] || items[3] || '⭐',
          items[4] || '🔷'
        ]);

        return {
          id: `vis_pat_${Date.now()}_${Math.random()}`,
          signature,
          category: 'Visual',
          categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
          question: 'What comes next in this repeating pattern sequence?',
          promptAudio: 'Look at the pattern sequence. What comes next?',
          diagramType: 'pattern-shapes',
          diagramData: { sequence: seq, nextItem: next },
          options,
          correctAnswerId,
          solutionText: `The pattern repeats! The next item is ${next}.`,
          solutionDiagramType: 'pattern-shapes',
          solutionDiagramData: { sequence: [...seq, next], nextItem: next },
          hint: 'Say the items out loud to hear the rhythm!'
        };
      }
    }

    if (kind === 'apple-counting') {
      const emojis = [
        { char: '🍎', name: 'red apples' },
        { char: '⭐', name: 'golden stars' },
        { char: '🎈', name: 'balloons' },
        { char: '🐠', name: 'fish' },
        { char: '💎', name: 'gems' }
      ];
      const chosen = emojis[Math.floor(Math.random() * emojis.length)];
      const maxCount = kidAge <= 4 ? 5 : kidAge === 5 ? 8 : 10;
      const minCount = kidAge <= 4 ? 3 : 4;
      const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

      const signature = `count_${chosen.char}_${count}`;
      if (!seenSignatures.has(signature) || attempt > 25) {
        seenSignatures.add(signature);
        const { options, correctAnswerId } = buildOptions(
          `${count} ${chosen.char}`,
          [
            `${count - 1} ${chosen.char}`,
            `${count + 1} ${chosen.char}`,
            `${count - 2 > 0 ? count - 2 : count + 3} ${chosen.char}`,
            `${count + 2} ${chosen.char}`
          ]
        );

        return {
          id: `vis_cnt_${Date.now()}_${Math.random()}`,
          signature,
          category: 'Visual',
          categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
          question: `How many ${chosen.name} can you spot and count in the picture?`,
          promptAudio: `How many ${chosen.name} can you count in the picture?`,
          diagramType: 'apple-counting',
          diagramData: { count, emoji: chosen.char },
          options,
          correctAnswerId,
          solutionText: `Counting each ${chosen.name} gives a total of ${count} in the picture.`,
          solutionDiagramType: 'apple-counting',
          solutionDiagramData: { count, emoji: chosen.char },
          hint: `Point your finger and count carefully 1 by 1 up to ${count}.`
        };
      }
    }

    if (kind === 'scale-balance') {
      const balancePairs = [
        {
          left: '🎈 Balloon',
          right: '🪨 Heavy Rock',
          heavy: 'right',
          ans: '🪨 Heavy Rock'
        },
        {
          left: '🐘 Big Elephant',
          right: '🐭 Little Mouse',
          heavy: 'left',
          ans: '🐘 Big Elephant'
        },
        {
          left: '🍉 Juicy Watermelon',
          right: '🍓 Tiny Strawberry',
          heavy: 'left',
          ans: '🍉 Juicy Watermelon'
        }
      ];
      const p = balancePairs[Math.floor(Math.random() * balancePairs.length)];
      const signature = `balance_${p.left}_${p.right}`;

      if (!seenSignatures.has(signature) || attempt > 25) {
        seenSignatures.add(signature);
        const { options, correctAnswerId } = buildOptions(p.ans, [
          p.heavy === 'left' ? p.right : p.left,
          'They weigh exactly the same ⚖️',
          'Cannot tell from picture ❓'
        ]);

        return {
          id: `vis_bal_${Date.now()}_${Math.random()}`,
          signature,
          category: 'Visual',
          categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
          question: 'Look at the seesaw balance scale. Which item is HEAVIER?',
          promptAudio: 'Look at the balance scale. Which item is heavier and pushes down?',
          diagramType: 'scale-balance',
          diagramData: {
            leftEmoji: p.left,
            rightEmoji: p.right,
            heavySide: p.heavy
          },
          options,
          correctAnswerId,
          solutionText: `The heavier side tips down! ${p.ans} is heavier.`,
          solutionDiagramType: 'scale-balance',
          solutionDiagramData: {
            leftEmoji: p.left,
            rightEmoji: p.right,
            heavySide: p.heavy
          },
          hint: 'The side that pushes down toward the ground has the heavier item!'
        };
      }
    }

    // Default fallback to pattern shapes
    const signature = `fallback_pattern_${Date.now()}`;
    const { options, correctAnswerId } = buildOptions('🍎', ['🍌', '🍇', '🍊']);
    return {
      id: `vis_def_${Date.now()}`,
      signature,
      category: 'Visual',
      categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
      question: 'What comes next in the pattern: 🍎 🍌 🍎 🍌 ?',
      promptAudio: 'What comes next in the pattern: Apple, Banana, Apple, Banana?',
      diagramType: 'pattern-shapes',
      diagramData: { sequence: ['🍎', '🍌', '🍎', '🍌'], nextItem: '🍎' },
      options,
      correctAnswerId,
      solutionText: 'The pattern alternates between Apple and Banana! Next is 🍎.',
      solutionDiagramType: 'pattern-shapes',
      solutionDiagramData: { sequence: ['🍎', '🍌', '🍎', '🍌', '🍎'], nextItem: '🍎' },
      hint: 'Say it out loud: Apple, Banana, Apple, Banana, ...'
    };
  }

  // Safety return
  const { options, correctAnswerId } = buildOptions('⭐', ['🔷', '●', '▲']);
  return {
    id: `vis_safe_${Date.now()}`,
    signature: `safe_${Date.now()}`,
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'Which shape is a golden star?',
    promptAudio: 'Which shape is a golden star?',
    diagramType: null,
    diagramData: null,
    options,
    correctAnswerId,
    solutionText: '⭐ is the bright golden star!',
    solutionDiagramType: null,
    solutionDiagramData: null,
    hint: 'Look for the 5-pointed star.'
  };
}

function getSeenSignatures() {
  try {
    const raw = localStorage.getItem(SEEN_QUESTIONS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveSeenSignatures(seenSet) {
  try {
    const arr = Array.from(seenSet).slice(-500);
    localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(arr));
  } catch (err) {
    console.warn('Could not save seen signatures to localStorage', err);
  }
}

// -------------------------------------------------------------
// 3. MAIN EXPORTED SESSION GENERATOR (AGE CALIBRATED)
// -------------------------------------------------------------

/**
 * Fetches exactly 10 fresh, unseen questions strictly calibrated for the child's age
 * @param {'Visual' | 'Analytical Thinking'} selectedSkill
 * @param {number} sheetNumber
 * @param {number} kidAge (e.g. 3, 4, 5, 6, 7, 8)
 */
export async function getFreshThinksheetSession(
  selectedSkill = 'Visual',
  sheetNumber = 1,
  kidAge = 5
) {
  const seenSignatures = getSeenSignatures();

  // 1. First Priority: AI-Powered Question Generation via Gemini API
  try {
    const aiQuestions = await generateAIQuestions(selectedSkill, sheetNumber, kidAge);
    if (aiQuestions && Array.isArray(aiQuestions) && aiQuestions.length >= 8) {
      aiQuestions.forEach((q) => {
        if (q.signature) seenSignatures.add(q.signature);
      });
      saveSeenSignatures(seenSignatures);
      return aiQuestions.slice(0, 10);
    }
  } catch (err) {
    console.warn('AI generator fallback activated:', err);
  }

  // 2. Secondary: Dynamic Procedural Engine (strictly age-calibrated)
  const result = [];

  if (selectedSkill === 'Analytical Thinking') {
    while (result.length < 10) {
      const dynQ = generateInfiniteAnalyticalQuestion(seenSignatures, kidAge);
      result.push(dynQ);
    }
  } else {
    while (result.length < 10) {
      const visQ = generateInfiniteVisualQuestion(seenSignatures, kidAge);
      result.push(visQ);
    }
  }

  saveSeenSignatures(seenSignatures);
  return shuffleArray(result);
}

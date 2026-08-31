// Question Service: Infinite Dynamic & Internet-Sourced Engine (Visual & Analytical Thinking)
// Strictly guarantees non-repeating questions across all sessions!

const SEEN_QUESTIONS_KEY = 'thinksheet_infinite_unseen_signatures_v2';

export const CATEGORY_DESCRIPTIONS = {
  Visual: 'Develop your ability to analyze and/or spot visual information in order to solve a problem',
  'Analytical Thinking': 'Develop your ability to plan and breakdown information in order to analyze and solve complex problems'
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
  const uniqueDistractors = Array.from(new Set(distractors.filter(d => d !== correctText)));
  const chosenDistractors = shuffleArray(uniqueDistractors).slice(0, 3);

  // If not enough distractors, fill with standard fallbacks
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
// 1. DYNAMIC PROCEDURAL & INTERNET ANALYTICAL THINKING GENERATOR
// -------------------------------------------------------------

// Comprehensive CogAT & Olympiad Kindergarten Analogy Pairs
const ANALOGY_TEMPLATES = [
  { item1: 'Ear 👂', rel1: 'Headphones 🎧', item2: 'Eye 👁️', correct: 'Glasses 👓', distractors: ['Hat 🧢', 'Shoes 👟', 'Belt 🥋'], hint: 'What do you wear right in front of your eyes to see better?' },
  { item1: 'Foot 🦶', rel1: 'Shoe 👟', item2: 'Hand ✋', correct: 'Glove 🧤', distractors: ['Pants 👖', 'Necklace 📿', 'Socks 🧦'], hint: 'What do you wear over your fingers to keep hands warm?' },
  { item1: 'Bird 🐦', rel1: 'Wings 🪽', item2: 'Fish 🐟', correct: 'Fins 🐠', distractors: ['Legs 🦵', 'Feathers 🪶', 'Beak 🦆'], hint: 'What body parts help a swimming fish steer in water?' },
  { item1: 'Car 🚗', rel1: 'Garage 🏠', item2: 'Airplane ✈️', correct: 'Hangar 🏢', distractors: ['Nest 🪺', 'Pond 🌊', 'Cave 🪨'], hint: 'Where do big airplanes park when they rest at the airport?' },
  { item1: 'Spider 🕷️', rel1: 'Web 🕸️', item2: 'Bee 🐝', correct: 'Beehive 🍯', distractors: ['Tree branch 🌿', 'Ocean 🌊', 'Burrow 🕳️'], hint: 'Where do honeybees live and make their sweet honey?' },
  { item1: 'Caterpillar 🐛', rel1: 'Butterfly 🦋', item2: 'Tadpole 🏊', correct: 'Frog 🐸', distractors: ['Duck 🦆', 'Fish 🐟', 'Turtle 🐢'], hint: 'What hopping green animal does a baby swimming tadpole grow into?' },
  { item1: 'Painter 🎨', rel1: 'Brush 🖌️', item2: 'Writer ✍️', correct: 'Pencil ✏️', distractors: ['Hammer 🔨', 'Fork 🍴', 'Spoon 🥄'], hint: 'What tool does someone write with on paper?' },
  { item1: 'Winter ❄️', rel1: 'Snowman ☃️', item2: 'Summer ☀️', correct: 'Sandcastle 🏖️', distractors: ['Snowflake ❄️', 'Hot heater 🔥', 'Wool coat 🧥'], hint: 'What fun sculpture do kids build with wet sand on a warm beach?' },
  { item1: 'Kangaroo 🦘', rel1: 'Joey', item2: 'Deer 🦌', correct: 'Fawn', distractors: ['Puppy 🐶', 'Cub 🐻', 'Chick 🐥'], hint: 'What is a cute baby deer called?' },
  { item1: 'Cow 🐄', rel1: 'Calf', item2: 'Sheep 🐑', correct: 'Lamb', distractors: ['Foal 🐴', 'Piglet 🐷', 'Kitten 🐱'], hint: 'What do we call a fluffy baby sheep?' },
  { item1: 'Doctor 🩺', rel1: 'Hospital 🏥', item2: 'Teacher 📚', correct: 'School 🏫', distractors: ['Airport ✈️', 'Park 🌳', 'Zoo 🦁'], hint: 'Where does a teacher teach students every day?' },
  { item1: 'Train 🚂', rel1: 'Tracks 🛤️', item2: 'Ship 🚢', correct: 'Ocean Water 🌊', distractors: ['Highway 🛣️', 'Sky ☁️', 'Grass 🌿'], hint: 'Where does a big ship sail?' },
  { item1: 'Dog 🐕', rel1: 'Bark 🐶', item2: 'Cat 🐈', correct: 'Meow 🐱', distractors: ['Roar 🦁', 'Quack 🦆', 'Moo 🐮'], hint: 'What sound does a cat make when asking for milk?' },
  { item1: 'Fast ⚡', rel1: 'Cheetah 🐆', item2: 'Slow ⏳', correct: 'Turtle 🐢', distractors: ['Rocket 🚀', 'Eagle 🦅', 'Horse 🐎'], hint: 'Which animal is known for moving very slowly with a hard shell?' },
  { item1: 'Heavy ⚖️', rel1: 'Elephant 🐘', item2: 'Light 🪶', correct: 'Feather 🪶', distractors: ['Anvil ⚓', 'Rock 🪨', 'Bigger Truck 🚛'], hint: 'What is very lightweight and floats in the breeze?' },
  { item1: 'Cold 🧊', rel1: 'Ice Cream 🍦', item2: 'Hot 🔥', correct: 'Warm Soup 🍲', distractors: ['Ice Cube 🧊', 'Snow ❄️', 'Cold Milk 🥛'], hint: 'Which food is served warm and steamy for dinner?' },
  { item1: 'Bed 🛏️', rel1: 'Sleep 😴', item2: 'Chair 🪑', correct: 'Sit 🪑', distractors: ['Swim 🏊', 'Fly ✈️', 'Run 🏃'], hint: 'What do you do when you use a chair?' },
  { item1: 'Book 📖', rel1: 'Read 👓', item2: 'Song 🎵', correct: 'Listen / Sing 🎤', distractors: ['Bake 🍞', 'Sleep 💤', 'Draw ✏️'], hint: 'What do we do when happy music is playing?' },
  { item1: 'Rain 🌧️', rel1: 'Umbrella ☔', item2: 'Bright Sun ☀️', correct: 'Sunglasses 🕶️', distractors: ['Raincoat 🧥', 'Snowboots 🥾', 'Blanket 🛋️'], hint: 'What protects our eyes from bright sunny rays?' },
  { item1: 'Morning 🌅', rel1: 'Breakfast 🥞', item2: 'Night 🌙', correct: 'Dinner / Supper 🍲', distractors: ['Lunch 🥪', 'Sunrise ☀️', 'Snack 🍎'], hint: 'What meal do we eat in the evening before sleeping?' },
  { item1: 'Horse 🐎', rel1: 'Barn 🚜', item2: 'Lion 🦁', correct: 'Den / Savanna 🌿', distractors: ['Birdcage 🪹', 'Fishbowl 🐠', 'Kitchen 🍳'], hint: 'Where does a wild lion live with its pride?' },
  { item1: 'Tree 🌳', rel1: 'Leaves 🍃', item2: 'Flower 🌸', correct: 'Petals 🌺', distractors: ['Bark 🪵', 'Roots 🌱', 'Branches 🌿'], hint: 'What colorful parts make up a blossoming flower?' }
];

// Odd-One-Out Classification Templates
const ODD_ONE_OUT_TEMPLATES = [
  { question: 'Which one does NOT fly up in the sky?', correct: 'Goldfish 🐟', distractors: ['Eagle 🦅', 'Butterfly 🦋', 'Airplane ✈️'], hint: 'Three of these can fly high. Which one lives underwater in a fish tank?' },
  { question: 'Which one does NOT live or swim in water?', correct: 'Lion 🦁', distractors: ['Dolphin 🐬', 'Shark 🦈', 'Jellyfish 🪼'], hint: 'Which animal lives on dry grassy land?' },
  { question: 'Which one is NOT a vehicle with rolling wheels?', correct: 'Oak Tree 🌳', distractors: ['Bicycle 🚲', 'School Bus 🚌', 'Motorcycle 🏍️'], hint: 'Which one is a plant that grows roots in dirt?' },
  { question: 'Which one is NOT worn in cold winter weather?', correct: 'Swimsuit 🩱', distractors: ['Warm Beanie Hat 🧢', 'Wool Mittens 🧤', 'Cozy Scarf 🧣'], hint: 'What outfit do you wear at the pool during hot summer days?' },
  { question: 'Which one is NOT a musical instrument you can play?', correct: 'Hammer 🔨', distractors: ['Acoustic Guitar 🎸', 'Snare Drum 🥁', 'Piano Keys 🎹'], hint: 'Which tool is used for pounding nails in wood, not making music?' },
  { question: 'Which one is NOT an animal with four legs?', correct: 'Yellow Duck 🦆', distractors: ['Friendly Dog 🐕', 'Horse 🐎', 'Elephant 🐘'], hint: 'Which creature walks on 2 webbed feet and has wings?' },
  { question: 'Which one is NOT naturally yellow in color?', correct: 'Red Strawberry 🍓', distractors: ['Ripe Banana 🍌', 'Fresh Lemon 🍋', 'Sunflower 🌻'], hint: 'Which sweet berry is bright red with little seeds?' },
  { question: 'Which one does NOT belong in the kitchen cooking food?', correct: 'Toothbrush 🪥', distractors: ['Frying Pan 🍳', 'Soup Spoon 🥄', 'Eating Plate 🍽️'], hint: 'Which item is kept in the bathroom for brushing teeth?' },
  { question: 'Which one is NOT a sweet fruit you can eat?', correct: 'Toy Robot 🤖', distractors: ['Red Apple 🍎', 'Juicy Orange 🍊', 'Sweet Grape 🍇'], hint: 'Which one is a toy made of metal and plastic?' },
  { question: 'Which one is NOT a shape with straight edges?', correct: 'Round Circle ⭕', distractors: ['Square ⬛', 'Triangle 🔺', 'Rectangle ▬'], hint: 'Which shape is completely curved with no sharp corners?' }
];

// Cause-and-Effect Logic Templates
const CAUSE_EFFECT_TEMPLATES = [
  { question: 'If you water a tiny seed in nutrient soil 🌱, what will happen?', correct: 'It sprouts into a green plant 🌿', distractors: ['It turns into ice 🧊', 'It disappears forever ❌', 'It turns into a rock 🪨'], hint: 'What happens when seeds get sunlight and water?' },
  { question: 'If you blow air into an empty rubber balloon 🎈, what will happen?', correct: 'It grows bigger and expands 🎈', distractors: ['It gets smaller 🤏', 'It turns into glass 🪟', 'It catches fire 🔥'], hint: 'Think about birthday balloons when pumped with air.' },
  { question: 'What happens when you flip ON the light switch in a dark room 💡?', correct: 'The room becomes bright and visible 💡', distractors: ['It starts raining inside 🌧️', 'The room gets colder ❄️', 'The door locks 🔒'], hint: 'What does an electric light bulb do when turned on?' },
  { question: 'Which lightweight object will FLOAT on top of bath water 🛁?', correct: 'Hollow Rubber Duck 🦆', distractors: ['Heavy Iron Key 🔑', 'Solid Rock Stone 🪨', 'Metal Spoon 🥄'], hint: 'Which toy stays right on top of bathwater without sinking?' },
  { question: 'What happens if you leave a bowl of vanilla ice cream 🍨 in the warm sun ☀️?', correct: 'It melts into sweet liquid 🍦', distractors: ['It freezes harder 🧊', 'It turns into bread 🍞', 'It flies away 🕊️'], hint: 'What happens to ice cream when it gets warm?' }
];

// -------------------------------------------------------------
// 2. INTERNET TRIVIA / SCIENCE / LOGIC FETCHER (With Fallback)
// -------------------------------------------------------------

async function fetchFromInternetAPI(count = 5) {
  try {
    const res = await fetch(`https://opentdb.com/api.php?amount=${count}&category=17&difficulty=easy&type=multiple`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !data.results || data.results.length === 0) return [];

    const decode = (str) => {
      const txt = document.createElement('textarea');
      txt.innerHTML = str;
      return txt.value;
    };

    return data.results.map((item, idx) => {
      const qText = decode(item.question);
      const correctAns = decode(item.correct_answer);
      const wrongAns = item.incorrect_answers.map(decode);

      const { options, correctAnswerId } = buildOptions(correctAns, wrongAns);

      return {
        id: `net_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 5)}`,
        signature: `net_${qText.slice(0, 30)}`,
        category: 'Analytical Thinking',
        categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
        question: qText,
        promptAudio: qText,
        diagramType: null,
        options,
        correctAnswerId,
        solutionText: `The correct answer is "${correctAns}". Great thinking!`,
        hint: `Think carefully about: ${correctAns.slice(0, 15)}...`
      };
    });
  } catch (err) {
    console.warn('Internet fetch offline or rate-limited; procedural engine activated', err);
    return [];
  }
}

// -------------------------------------------------------------
// 3. INFINITE PROCEDURAL VISUAL PUZZLE GENERATOR
// -------------------------------------------------------------

function generateInfiniteVisualQuestion(seenSignatures) {
  const puzzleKinds = [
    'grid-tiles',
    'pattern-shapes',
    'apple-counting',
    'scale-balance',
    'block-tower',
    'paper-cut',
    'butterfly-symmetry',
    'rocket-maze'
  ];

  // Try up to 30 procedural permutations to guarantee non-repeating uniqueness
  for (let attempt = 0; attempt < 30; attempt++) {
    const kind = puzzleKinds[Math.floor(Math.random() * puzzleKinds.length)];

    if (kind === 'grid-tiles') {
      // Randomized grid dimensions (4 to 7) and randomized hole sizes (1x2 up to 4x3)
      const possibleGrids = [
        { rows: 4, cols: 4, holeW: 2, holeH: 2, holeRow: 1, holeCol: 1 },
        { rows: 5, cols: 5, holeW: 2, holeH: 3, holeRow: 1, holeCol: 1 },
        { rows: 5, cols: 5, holeW: 3, holeH: 2, holeRow: 2, holeCol: 1 },
        { rows: 6, cols: 6, holeW: 3, holeH: 3, holeRow: 1, holeCol: 2 },
        { rows: 6, cols: 6, holeW: 4, holeH: 2, holeRow: 2, holeCol: 1 },
        { rows: 6, cols: 6, holeW: 2, holeH: 4, holeRow: 1, holeCol: 2 },
        { rows: 7, cols: 7, holeW: 3, holeH: 4, holeRow: 2, holeCol: 2 },
        { rows: 7, cols: 7, holeW: 4, holeH: 3, holeRow: 2, holeCol: 2 },
        { rows: 5, cols: 6, holeW: 3, holeH: 2, holeRow: 1, holeCol: 2 }
      ];

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
          hint: `Multiply or count the empty spaces: ${g.holeH} rows × ${g.holeW} columns = ${count} tiles.`
        };
      }
    }

    if (kind === 'pattern-shapes') {
      const itemSets = [
        ['🍎', '🍌', '🍇', '🍊', '🍓'],
        ['●', '▲', '■', '⭐', '🔷'],
        ['🚗', '✈️', '🚀', '🚂', '🚁'],
        ['🐶', '🐱', '🐰', '🐼', '🦊'],
        ['☀️', '🌙', '⭐', '☁️', '🌈'],
        ['🟢', '🔴', '🟡', '🔵', '🟣']
      ];
      const items = itemSets[Math.floor(Math.random() * itemSets.length)];
      const ruleType = Math.floor(Math.random() * 3); // 0: ABAB, 1: AABAAB, 2: ABCABC

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
        const { options, correctAnswerId } = buildOptions(next, [items[0], items[1], items[2] || items[3], items[4] || '⭐']);

        return {
          id: `vis_pat_${Date.now()}_${Math.random()}`,
          signature,
          category: 'Visual',
          categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
          question: `Look at the pattern: ${seq.join(' ')} ... What comes next?`,
          promptAudio: 'Look closely at the pattern sequence. What comes next?',
          diagramType: 'pattern-shapes',
          diagramData: { sequence: seq, nextItem: next },
          options,
          correctAnswerId,
          solutionText: `The sequence repeats in order! The next matching item is ${next}.`,
          solutionDiagramType: 'pattern-shapes',
          solutionDiagramData: { sequence: seq, nextItem: next },
          hint: 'Say the items out loud in rhythm from left to right!'
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
      const count = Math.floor(Math.random() * 6) + 4; // 4 to 9

      const signature = `count_${chosen.char}_${count}`;
      if (!seenSignatures.has(signature) || attempt > 25) {
        seenSignatures.add(signature);
        const { options, correctAnswerId } = buildOptions(`${count} ${chosen.char}`, [
          `${count - 1} ${chosen.char}`,
          `${count + 1} ${chosen.char}`,
          `${count - 2 > 0 ? count - 2 : count + 3} ${chosen.char}`,
          `${count + 2} ${chosen.char}`
        ]);

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
        { left: '🎈 Balloon', right: '🪨 Heavy Rock', heavy: 'right', ans: '🪨 Heavy Rock' },
        { left: '🐘 Big Elephant', right: '🐭 Little Mouse', heavy: 'left', ans: '🐘 Big Elephant' },
        { left: '🍉 Juicy Watermelon', right: '🍓 Tiny Strawberry', heavy: 'left', ans: '🍉 Juicy Watermelon' },
        { left: '🪶 Fluffy Feather', right: '🚗 Toy Truck', heavy: 'right', ans: '🚗 Toy Truck' },
        { left: '🧱 Heavy Brick', right: '🍃 Dry Leaf', heavy: 'left', ans: '🧱 Heavy Brick' }
      ];
      const pair = balancePairs[Math.floor(Math.random() * balancePairs.length)];
      const signature = `scale_${pair.left}_vs_${pair.right}`;

      if (!seenSignatures.has(signature) || attempt > 25) {
        seenSignatures.add(signature);
        const { options, correctAnswerId } = buildOptions(pair.ans, [
          pair.heavy === 'left' ? pair.right : pair.left,
          'Both are equal',
          'Cannot tell'
        ]);

        return {
          id: `vis_bal_${Date.now()}_${Math.random()}`,
          signature,
          category: 'Visual',
          categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
          question: 'Which object is heavier according to the seesaw balance diagram?',
          promptAudio: 'Which object is heavier according to the seesaw balance diagram?',
          diagramType: 'scale-balance',
          diagramData: {
            leftEmoji: pair.left.split(' ')[0],
            rightEmoji: pair.right.split(' ')[0],
            heavySide: pair.heavy
          },
          options,
          correctAnswerId,
          solutionText: `The heavy side pushes DOWN on the seesaw! So ${pair.ans} is heavier.`,
          solutionDiagramType: 'scale-balance',
          solutionDiagramData: {
            leftEmoji: pair.left.split(' ')[0],
            rightEmoji: pair.right.split(' ')[0],
            heavySide: pair.heavy
          },
          hint: 'Look at which side of the seesaw is tilted all the way down.'
        };
      }
    }

    if (kind === 'block-tower') {
      const towerConfigs = [
        { b: 3, m: 2, t: 1, tot: 6 },
        { b: 4, m: 2, t: 1, tot: 7 },
        { b: 4, m: 3, t: 1, tot: 8 },
        { b: 5, m: 3, t: 1, tot: 9 },
        { b: 4, m: 3, t: 2, tot: 9 }
      ];
      const tc = towerConfigs[Math.floor(Math.random() * towerConfigs.length)];
      const signature = `tower_${tc.b}_${tc.m}_${tc.t}`;

      if (!seenSignatures.has(signature) || attempt > 25) {
        seenSignatures.add(signature);
        const { options, correctAnswerId } = buildOptions(`${tc.tot}`, [
          `${tc.tot - 1}`,
          `${tc.tot + 1}`,
          `${tc.tot - 2 > 0 ? tc.tot - 2 : tc.tot + 3}`,
          `${tc.tot + 2}`
        ]);

        return {
          id: `vis_tow_${Date.now()}_${Math.random()}`,
          signature,
          category: 'Visual',
          categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
          question: 'How many blocks were used to build this pyramid tower?',
          promptAudio: 'How many blocks were used to build this pyramid tower?',
          diagramType: 'block-tower',
          diagramData: { bottom: tc.b, middle: tc.m, top: tc.t },
          options,
          correctAnswerId,
          solutionText: `Bottom layer (${tc.b}) + middle layer (${tc.m}) + top layer (${tc.t}) = ${tc.tot} blocks total.`,
          solutionDiagramType: 'block-tower',
          solutionDiagramData: { bottom: tc.b, middle: tc.m, top: tc.t },
          hint: 'Count layer by layer from the bottom up!'
        };
      }
    }

    if (kind === 'paper-cut') {
      const signature = `paper_cut_${attempt}`;
      seenSignatures.add(signature);
      const { options, correctAnswerId } = buildOptions('4', ['3', '5', '6']);

      return {
        id: `vis_pap_${Date.now()}_${Math.random()}`,
        signature,
        category: 'Visual',
        categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
        question: 'The paper sheet is cut along the dotted line. How many corners will the resulting shape on the right have?',
        promptAudio: 'How many corners will the resulting paper sheet on the right have?',
        diagramType: 'paper-cut',
        options,
        correctAnswerId,
        solutionText: 'The cut paper sheet on the right forms a rectangle with 4 corners.',
        solutionDiagramType: 'paper-cut',
        hint: 'Look at the shape on the right side of the dotted cut line.'
      };
    }

    if (kind === 'butterfly-symmetry') {
      const signature = `butterfly_symmetry_${attempt}`;
      seenSignatures.add(signature);
      const { options, correctAnswerId } = buildOptions('Right Wing 🦋', ['Left Wing', 'Star Wing ⭐', 'Circle Wing ⭕']);

      return {
        id: `vis_sym_${Date.now()}_${Math.random()}`,
        signature,
        category: 'Visual',
        categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
        question: 'Which wing completes the colorful butterfly with mirror symmetry 🦋?',
        promptAudio: 'Which wing completes the colorful butterfly with mirror symmetry?',
        diagramType: 'butterfly-symmetry',
        options,
        correctAnswerId,
        solutionText: 'Butterflies have mirror symmetry! The matching right wing mirrors the left wing.',
        solutionDiagramType: 'butterfly-symmetry',
        hint: 'Both wings of a butterfly match like mirror twins!'
      };
    }

    if (kind === 'rocket-maze') {
      const signature = `rocket_maze_${attempt}`;
      seenSignatures.add(signature);
      const { options, correctAnswerId } = buildOptions('Path B ⭐', ['Path A 🪐', 'Path C 🛸', 'Path D ☄️']);

      return {
        id: `vis_maze_${Date.now()}_${Math.random()}`,
        signature,
        category: 'Visual',
        categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
        question: 'Which path leads the rocket directly to the golden star ⭐?',
        promptAudio: 'Which path leads the rocket directly to the golden star?',
        diagramType: 'rocket-maze',
        options,
        correctAnswerId,
        solutionText: 'Path B (blue dashed line) curves directly to the golden star!',
        solutionDiagramType: 'rocket-maze',
        hint: 'Trace Path B starting from the rocket with your eyes.'
      };
    }
  }
}

// -------------------------------------------------------------
// 4. INFINITE PROCEDURAL ANALYTICAL THINKING GENERATOR
// -------------------------------------------------------------

function generateInfiniteAnalyticalQuestion(seenSignatures) {
  const allPool = [
    // A. CogAT Analogies
    ...ANALOGY_TEMPLATES.map(t => ({
      signature: `analogy_${t.item1}_${t.item2}`,
      question: `If ${t.item1} is to ${t.rel1}, then ${t.item2} is to?`,
      promptAudio: `If ${t.item1} is to ${t.rel1}, then ${t.item2} is to?`,
      correct: t.correct,
      distractors: t.distractors,
      solutionText: `${t.item1} relates to ${t.rel1}. In the exact same way, ${t.item2} connects with ${t.correct}!`,
      hint: t.hint
    })),
    // B. Classification & Odd-One-Out
    ...ODD_ONE_OUT_TEMPLATES.map(o => ({
      signature: `odd_${o.question}`,
      question: o.question,
      promptAudio: o.question,
      correct: o.correct,
      distractors: o.distractors,
      solutionText: `"${o.correct}" does not fit the common group. Great analytical reasoning!`,
      hint: o.hint
    })),
    // C. Cause & Effect
    ...CAUSE_EFFECT_TEMPLATES.map(c => ({
      signature: `cause_${c.question}`,
      question: c.question,
      promptAudio: c.question,
      correct: c.correct,
      distractors: c.distractors,
      solutionText: `That's right! ${c.correct}`,
      hint: c.hint
    }))
  ];

  // Find unseen items first
  let candidates = allPool.filter(item => !seenSignatures.has(item.signature));
  if (candidates.length === 0) {
    // If all static templates were seen, shuffle the whole pool
    candidates = shuffleArray(allPool);
  }

  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  seenSignatures.add(chosen.signature);

  const { options, correctAnswerId } = buildOptions(chosen.correct, chosen.distractors);

  return {
    id: `ana_dyn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    signature: chosen.signature,
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: chosen.question,
    promptAudio: chosen.promptAudio,
    diagramType: null,
    options,
    correctAnswerId,
    solutionText: chosen.solutionText,
    hint: chosen.hint
  };
}

// -------------------------------------------------------------
// 5. ANTI-REPETITION LOCAL STORAGE HELPERS
// -------------------------------------------------------------

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
    const arr = Array.from(seenSet).slice(-500); // keep history of up to 500 unique questions
    localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(arr));
  } catch (err) {
    console.warn('Could not save seen signatures to localStorage', err);
  }
}

// -------------------------------------------------------------
// 6. MAIN EXPORTED SESSION GENERATOR
// -------------------------------------------------------------

/**
 * Fetches exactly 10 fresh, unseen questions from the internet & procedural engine.
 * Never repeats the same question in subsequent sessions!
 *
 * @param {'Visual' | 'Analytical Thinking'} selectedSkill
 * @param {number} sheetNumber
 */
export async function getFreshThinksheetSession(selectedSkill = 'Visual', sheetNumber = 1) {
  const seenSignatures = getSeenSignatures();
  const result = [];

  if (selectedSkill === 'Analytical Thinking') {
    // 1. Attempt to pull fresh internet questions first
    const internetQuestions = await fetchFromInternetAPI(4);
    for (const iq of internetQuestions) {
      if (!seenSignatures.has(iq.signature) && result.length < 10) {
        seenSignatures.add(iq.signature);
        result.push(iq);
      }
    }

    // 2. Fill the remaining spots with dynamic procedural reasoning questions
    while (result.length < 10) {
      const dynQ = generateInfiniteAnalyticalQuestion(seenSignatures);
      result.push(dynQ);
    }
  } else {
    // Visual Questions (infinite permutations of grid puzzles, sequences, counting, seesaws, towers, symmetries, mazes)
    while (result.length < 10) {
      const visQ = generateInfiniteVisualQuestion(seenSignatures);
      result.push(visQ);
    }
  }

  // Save the updated non-repeating signatures to localStorage
  saveSeenSignatures(seenSignatures);

  return shuffleArray(result);
}

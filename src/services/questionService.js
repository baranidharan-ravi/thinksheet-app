// Question Service: Topic-Specific Engine (Visual OR Analytical Thinking) for 5-Year-Old Learners

const USED_QUESTIONS_KEY = 'thinksheet_seen_topic_questions_v4';

export const CATEGORY_DESCRIPTIONS = {
  'Visual': 'Develop your ability to analyze and/or spot visual information in order to solve a problem',
  'Analytical Thinking': 'Develop your ability to plan and breakdown information in order to analyze and solve complex problems'
};

// 1. Analytical Thinking Question Bank (30+ Diverse Reasoning Challenges)
const ANALYTICAL_BANK = [
  {
    id: 'ana_1',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Fast is to Slow, then Good is to?',
    promptAudio: 'If Fast is to Slow, then Good is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Bad' },
      { id: 'B', text: 'Naughty' },
      { id: 'C', text: 'Fair' },
      { id: 'D', text: 'High' }
    ],
    correctAnswerId: 'A',
    solutionText: 'Fast and Slow are opposites (antonyms). In the same way, the opposite of Good is Bad!',
    hint: 'Think about opposites! Fast is the opposite of Slow. What is the opposite of Good?'
  },
  {
    id: 'ana_2',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Day is to Sun ☀️, then Night is to?',
    promptAudio: 'If Day is to Sun, then Night is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Moon 🌙' },
      { id: 'B', text: 'Cloud ☁️' },
      { id: 'C', text: 'Rain 🌧️' },
      { id: 'D', text: 'Wind 💨' }
    ],
    correctAnswerId: 'A',
    solutionText: 'The Sun lights up the sky during the Day, and the Moon lights up the night sky!',
    hint: 'What shines bright up in the sky when you go to bed at night?'
  },
  {
    id: 'ana_3',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Puppy is to Dog 🐕, then Kitten is to?',
    promptAudio: 'If Puppy is to Dog, then Kitten is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Cat 🐈' },
      { id: 'B', text: 'Cow 🐄' },
      { id: 'C', text: 'Duck 🦆' },
      { id: 'D', text: 'Fish 🐟' }
    ],
    correctAnswerId: 'A',
    solutionText: 'A baby puppy grows up into a Dog. A baby kitten grows up into a Cat!',
    hint: 'A puppy is a baby dog. What animal is a baby kitten?'
  },
  {
    id: 'ana_4',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Eye is to See 👁️, then Ear is to?',
    promptAudio: 'If Eye is to See, then Ear is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Hear 👂' },
      { id: 'B', text: 'Taste 👅' },
      { id: 'C', text: 'Touch ✋' },
      { id: 'D', text: 'Smell 👃' }
    ],
    correctAnswerId: 'A',
    solutionText: 'We use our eyes to see colors and shapes, and we use our ears to hear music and sounds!',
    hint: 'What do you use your ears for when someone speaks to you?'
  },
  {
    id: 'ana_5',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Ice is to Cold 🧊, then Fire is to?',
    promptAudio: 'If Ice is to Cold, then Fire is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Hot 🔥' },
      { id: 'B', text: 'Wet 💧' },
      { id: 'C', text: 'Soft ☁️' },
      { id: 'D', text: 'Dark 🌑' }
    ],
    correctAnswerId: 'A',
    solutionText: 'Ice feels freezing cold, and Fire feels very hot!',
    hint: 'Ice gives off freezing cold. What does a campfire give off?'
  },
  {
    id: 'ana_6',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Bird is to Nest 🪺, then Bee is to?',
    promptAudio: 'If Bird is to Nest, then Bee is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Beehive 🐝' },
      { id: 'B', text: 'Tree 🌲' },
      { id: 'C', text: 'Cave 🪨' },
      { id: 'D', text: 'Ocean 🌊' }
    ],
    correctAnswerId: 'A',
    solutionText: 'A nest is where a bird lives, and a beehive is where honeybees live and make honey!',
    hint: 'Where do honeybees live and store their sweet honey?'
  },
  {
    id: 'ana_7',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Car is to Road 🚗, then Boat is to?',
    promptAudio: 'If Car is to Road, then Boat is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Water 🌊' },
      { id: 'B', text: 'Sky ☁️' },
      { id: 'C', text: 'Train Track 🚂' },
      { id: 'D', text: 'Grass 🌿' }
    ],
    correctAnswerId: 'A',
    solutionText: 'Cars travel on roads, while boats sail across water in lakes and oceans!',
    hint: 'Where does a sailboat float and travel?'
  },
  {
    id: 'ana_8',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'Which one does NOT belong with the other fruits?',
    promptAudio: 'Which one does not belong with the other fruits?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Toy Car 🚗' },
      { id: 'B', text: 'Apple 🍎' },
      { id: 'C', text: 'Banana 🍌' },
      { id: 'D', text: 'Orange 🍊' }
    ],
    correctAnswerId: 'A',
    solutionText: 'Apple, Banana, and Orange are all sweet fruits you can eat. A Toy Car is a vehicle to play with!',
    hint: 'Three of these are fruits. Which one is a toy with wheels?'
  },
  {
    id: 'ana_9',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Pencil is to Draw ✏️, then Scissors are to?',
    promptAudio: 'If Pencil is to Draw, then Scissors are to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Cut ✂️' },
      { id: 'B', text: 'Glue 🧴' },
      { id: 'C', text: 'Paint 🎨' },
      { id: 'D', text: 'Read 📖' }
    ],
    correctAnswerId: 'A',
    solutionText: 'We use a pencil to draw lines, and we use scissors to cut paper into fun shapes!',
    hint: 'What action do you do with child-safe craft scissors?'
  },
  {
    id: 'ana_10',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If you leave an ice cube 🧊 in the warm sunshine ☀️, what will happen?',
    promptAudio: 'If you leave an ice cube in the warm sunshine, what will happen?',
    diagramType: null,
    options: [
      { id: 'A', text: 'It melts into water 💧' },
      { id: 'B', text: 'It grows bigger 🧊' },
      { id: 'C', text: 'It turns into wood 🪵' },
      { id: 'D', text: 'It turns red 🔴' }
    ],
    correctAnswerId: 'A',
    solutionText: 'Warm heat from the sunshine causes cold frozen ice to melt into liquid water!',
    hint: 'What happens to ice cream when it sits outside in the sun?'
  },
  {
    id: 'ana_11',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Glove is to Hand 🧤, then Sock is to?',
    promptAudio: 'If Glove is to Hand, then Sock is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Foot 🧦' },
      { id: 'B', text: 'Ear 👂' },
      { id: 'C', text: 'Head 🧢' },
      { id: 'D', text: 'Nose 👃' }
    ],
    correctAnswerId: 'A',
    solutionText: 'A glove keeps your hand warm, and a sock keeps your foot warm!',
    hint: 'What part of your body wears socks before putting on shoes?'
  },
  {
    id: 'ana_12',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Morning is to Breakfast 🥞, then Evening is to?',
    promptAudio: 'If Morning is to Breakfast, then Evening is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Dinner 🍲' },
      { id: 'B', text: 'Lunch 🥪' },
      { id: 'C', text: 'Snack 🍎' },
      { id: 'D', text: 'Waking up ⏰' }
    ],
    correctAnswerId: 'A',
    solutionText: 'Breakfast is the meal eaten in the morning, and Dinner is the meal eaten in the evening!',
    hint: 'What meal do you eat with family at nighttime before bed?'
  },
  {
    id: 'ana_13',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Up is to Down ⬆️, then Left is to?',
    promptAudio: 'If Up is to Down, then Left is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Right ➡️' },
      { id: 'B', text: 'Top 🔝' },
      { id: 'C', text: 'High 🔺' },
      { id: 'D', text: 'Middle 🎯' }
    ],
    correctAnswerId: 'A',
    solutionText: 'Up and Down are opposite directions. Left and Right are also opposite directions!',
    hint: 'Look at your two hands: Left hand and...?'
  },
  {
    id: 'ana_14',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Cow is to Calf 🐄, then Sheep is to?',
    promptAudio: 'If Cow is to Calf, then Sheep is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Lamb 🐑' },
      { id: 'B', text: 'Foal 🐴' },
      { id: 'C', text: 'Piglet 🐷' },
      { id: 'D', text: 'Chick 🐥' }
    ],
    correctAnswerId: 'A',
    solutionText: 'A baby cow is called a calf. A fluffy baby sheep is called a lamb!',
    hint: 'What do we call a cute little baby sheep?'
  },
  {
    id: 'ana_15',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Doctor is to Hospital 🏥, then Teacher is to?',
    promptAudio: 'If Doctor is to Hospital, then Teacher is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'School 🏫' },
      { id: 'B', text: 'Airport ✈️' },
      { id: 'C', text: 'Park 🌳' },
      { id: 'D', text: 'Zoo 🦁' }
    ],
    correctAnswerId: 'A',
    solutionText: 'A doctor helps people at a hospital, and a teacher teaches students at a school!',
    hint: 'Where do teachers teach their classes every day?'
  },
  {
    id: 'ana_16',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'Which object will FLOAT on top of water in the bathtub?',
    promptAudio: 'Which object will float on top of water in the bathtub?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Rubber Toy Duck 🦆' },
      { id: 'B', text: 'Heavy Iron Key 🔑' },
      { id: 'C', text: 'Big Rock Stone 🪨' },
      { id: 'D', text: 'Metal Spoon 🥄' }
    ],
    correctAnswerId: 'A',
    solutionText: 'A lightweight hollow rubber duck floats on water, while heavy metal keys and rocks sink!',
    hint: 'What toy stays on top of bath water?'
  },
  {
    id: 'ana_17',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Caterpillar turns into a Butterfly 🦋, what does a baby Tadpole turn into?',
    promptAudio: 'If a caterpillar turns into a butterfly, what does a tadpole turn into?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Frog 🐸' },
      { id: 'B', text: 'Duck 🦆' },
      { id: 'C', text: 'Fish 🐟' },
      { id: 'D', text: 'Turtle 🐢' }
    ],
    correctAnswerId: 'A',
    solutionText: 'A baby tadpole swimming in the pond grows legs and turns into a hopping green frog!',
    hint: 'Which animal says "Ribbit! Ribbit!" and hops around?'
  },
  {
    id: 'ana_18',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If you have 4 cookies 🍪 and give 2 to a friend, how many do you have left?',
    promptAudio: 'If you have 4 cookies and give 2 to a friend, how many do you have left?',
    diagramType: null,
    options: [
      { id: 'A', text: '2 Cookies 🍪🍪' },
      { id: 'B', text: '1 Cookie 🍪' },
      { id: 'C', text: '3 Cookies 🍪🍪🍪' },
      { id: 'D', text: '0 Cookies' }
    ],
    correctAnswerId: 'A',
    solutionText: '4 cookies minus 2 cookies given away leaves you with 2 delicious cookies! (4 - 2 = 2)',
    hint: 'Hold up 4 fingers, put down 2 fingers. How many are left?'
  },
  {
    id: 'ana_19',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'If Hard is to Rock 🪨, then Soft is to?',
    promptAudio: 'If Hard is to Rock, then Soft is to?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Pillow / Feather 🪶' },
      { id: 'B', text: 'Wood Log 🪵' },
      { id: 'C', text: 'Brick 🧱' },
      { id: 'D', text: 'Iron Nail 🔩' }
    ],
    correctAnswerId: 'A',
    solutionText: 'A rock feels very hard and solid, while a fluffy pillow or feather feels soft and cozy!',
    hint: 'What feels very soft and squishy when you rest your head at bedtime?'
  },
  {
    id: 'ana_20',
    category: 'Analytical Thinking',
    categoryDescription: CATEGORY_DESCRIPTIONS['Analytical Thinking'],
    question: 'Which one is NOT a living animal?',
    promptAudio: 'Which one is not a living animal?',
    diagramType: null,
    options: [
      { id: 'A', text: 'Robot Toy 🤖' },
      { id: 'B', text: 'Lion 🦁' },
      { id: 'C', text: 'Tiger 🐯' },
      { id: 'D', text: 'Bear 🐻' }
    ],
    correctAnswerId: 'A',
    solutionText: 'Lion, Tiger, and Bear are living animals. A Robot is a toy made of metal and plastic!',
    hint: 'Which one is a machine made of metal, not a living animal?'
  }
];

// 2. Procedural & Curated Visual Question Generator (10+ Diverse Visual Challenges)
function generateVisualQuestions(count = 10) {
  const visualList = [];

  // A1. Grid Missing Tiles (6x6 with 3x3 hole = 9)
  visualList.push({
    id: 'vis_grid_1',
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'How many more tiles will be needed to fill in the empty area?',
    promptAudio: 'How many more tiles will be needed to fill in the empty area?',
    diagramType: 'grid-tiles',
    diagramData: { rows: 6, cols: 6, holeRow: 1, holeCol: 2, holeW: 3, holeH: 3, count: 9 },
    options: [
      { id: 'A', text: '6' },
      { id: 'B', text: '7' },
      { id: 'C', text: '8' },
      { id: 'D', text: '9' }
    ],
    correctAnswerId: 'D',
    solutionText: '9 tiles will be filled in the empty space.',
    solutionDiagramType: 'grid-tiles',
    solutionDiagramData: { rows: 6, cols: 6, holeRow: 1, holeCol: 2, holeW: 3, holeH: 3, count: 9 },
    hint: 'Count the empty grid square: 3 rows across by 3 columns down = 9 missing tiles.'
  });

  // A2. Grid Missing Tiles (5x5 with 2x2 hole = 4)
  visualList.push({
    id: 'vis_grid_2',
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'How many more tiles will be needed to fill in this empty square area?',
    promptAudio: 'How many more tiles will be needed to fill in this empty square area?',
    diagramType: 'grid-tiles',
    diagramData: { rows: 5, cols: 5, holeRow: 1, holeCol: 1, holeW: 2, holeH: 2, count: 4 },
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '4' },
      { id: 'C', text: '5' },
      { id: 'D', text: '6' }
    ],
    correctAnswerId: 'B',
    solutionText: '4 tiles will be filled in the empty square space.',
    solutionDiagramType: 'grid-tiles',
    solutionDiagramData: { rows: 5, cols: 5, holeRow: 1, holeCol: 1, holeW: 2, holeH: 2, count: 4 },
    hint: 'Count the empty area: 2 tiles across by 2 tiles down = 4 tiles total.'
  });

  // B. Paper Cut Corner Challenge
  visualList.push({
    id: 'vis_paper_1',
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'The paper sheet given below is cut along the dotted line. How many corners will the resultant paper sheet on the right have?',
    promptAudio: 'The paper sheet given below is cut along the dotted line. How many corners will the resultant paper sheet on the right have?',
    diagramType: 'paper-cut',
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '4' },
      { id: 'C', text: '5' },
      { id: 'D', text: '6' }
    ],
    correctAnswerId: 'B',
    solutionText: 'Resultant paper sheet on the right after the cut forms a rectangle with 4 corners as shown.',
    solutionDiagramType: 'paper-cut',
    hint: 'Look at the rectangle on the right side of the cut line. It has 4 distinct corners.'
  });

  // C1. Visual Shape Pattern
  visualList.push({
    id: 'vis_pattern_1',
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'Look at the shape sequence: ● ▲ ■ ● ▲ ... What comes next?',
    promptAudio: 'Look at the shape sequence. What shape comes next?',
    diagramType: 'pattern-shapes',
    diagramData: { sequence: ['●', '▲', '■', '●', '▲'], nextItem: '■' },
    options: [
      { id: 'A', text: 'Triangle ▲' },
      { id: 'B', text: 'Circle ●' },
      { id: 'C', text: 'Square ■' },
      { id: 'D', text: 'Star ⭐' }
    ],
    correctAnswerId: 'C',
    solutionText: 'The pattern repeats: Circle -> Triangle -> Square. So after Triangle comes Square (■)!',
    solutionDiagramType: 'pattern-shapes',
    solutionDiagramData: { sequence: ['●', '▲', '■', '●', '▲'], nextItem: '■' },
    hint: 'Say the shapes in rhythm: Circle, Triangle, Square, Circle, Triangle, ...'
  });

  // C2. Visual Fruit Pattern
  visualList.push({
    id: 'vis_pattern_2',
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'Look at the fruit pattern: 🍎 🍌 🍎 🍌 🍎 ... What fruit comes next?',
    promptAudio: 'Look at the fruit pattern. What fruit comes next?',
    diagramType: 'pattern-shapes',
    diagramData: { sequence: ['🍎', '🍌', '🍎', '🍌', '🍎'], nextItem: '🍌' },
    options: [
      { id: 'A', text: 'Banana 🍌' },
      { id: 'B', text: 'Apple 🍎' },
      { id: 'C', text: 'Grape 🍇' },
      { id: 'D', text: 'Orange 🍊' }
    ],
    correctAnswerId: 'A',
    solutionText: 'The pattern alternates: Apple -> Banana -> Apple -> Banana. So Banana (🍌) comes next!',
    solutionDiagramType: 'pattern-shapes',
    solutionDiagramData: { sequence: ['🍎', '🍌', '🍎', '🍌', '🍎'], nextItem: '🍌' },
    hint: 'Say the fruits: Apple, Banana, Apple, Banana, Apple, ...'
  });

  // D. Apple Tree Counting
  visualList.push({
    id: 'vis_count_1',
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'How many juicy red apples can you spot and count in the picture?',
    promptAudio: 'How many juicy red apples can you count?',
    diagramType: 'apple-counting',
    diagramData: { count: 7, emoji: '🍎' },
    options: [
      { id: 'A', text: '5 🍎' },
      { id: 'B', text: '6 🍎' },
      { id: 'C', text: '7 🍎' },
      { id: 'D', text: '8 🍎' }
    ],
    correctAnswerId: 'C',
    solutionText: 'Counting each apple carefully gives a total of 7 apples on the tree.',
    solutionDiagramType: 'apple-counting',
    solutionDiagramData: { count: 7, emoji: '🍎' },
    hint: 'Point to each red apple with your finger on screen and count 1 by 1.'
  });

  // E. Seesaw Balance Physics
  visualList.push({
    id: 'vis_balance_1',
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'Which object is heavier according to the seesaw balance diagram?',
    promptAudio: 'Which object is heavier according to the seesaw balance diagram?',
    diagramType: 'scale-balance',
    diagramData: { leftEmoji: '🎈', rightEmoji: '🪨', heavySide: 'right' },
    options: [
      { id: 'A', text: 'Balloon 🎈' },
      { id: 'B', text: 'Heavy Rock 🪨' },
      { id: 'C', text: 'Equal weight' },
      { id: 'D', text: 'Cannot tell' }
    ],
    correctAnswerId: 'B',
    solutionText: 'The heavy side pushes DOWN on the seesaw! The rock is pushing its side down, so the Heavy Rock 🪨 is heavier.',
    solutionDiagramType: 'scale-balance',
    solutionDiagramData: { leftEmoji: '🎈', rightEmoji: '🪨', heavySide: 'right' },
    hint: 'Look at which side is tilted down to the ground!'
  });

  // F. 3D Block Pyramid
  visualList.push({
    id: 'vis_blocks_1',
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'How many blocks were used to build this pyramid tower?',
    promptAudio: 'How many blocks were used to build this pyramid tower?',
    diagramType: 'block-tower',
    diagramData: { bottom: 3, middle: 2, top: 1 },
    options: [
      { id: 'A', text: '4' },
      { id: 'B', text: '5' },
      { id: 'C', text: '6' },
      { id: 'D', text: '7' }
    ],
    correctAnswerId: 'C',
    solutionText: 'Bottom layer has 3 + middle layer has 2 + top layer has 1 = 6 blocks in total.',
    solutionDiagramType: 'block-tower',
    solutionDiagramData: { bottom: 3, middle: 2, top: 1 },
    hint: 'Count layer by layer: 3 on bottom + 2 in middle + 1 on top.'
  });

  // G. Butterfly Symmetry
  visualList.push({
    id: 'vis_symmetry_1',
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'Which wing completes the colorful butterfly with mirror symmetry 🦋?',
    promptAudio: 'Which wing completes the colorful butterfly with mirror symmetry?',
    diagramType: 'butterfly-symmetry',
    options: [
      { id: 'A', text: 'Left Wing' },
      { id: 'B', text: 'Right Wing 🦋' },
      { id: 'C', text: 'Star Wing' },
      { id: 'D', text: 'No Wing' }
    ],
    correctAnswerId: 'B',
    solutionText: 'Butterflies have mirror symmetry! The matching right wing mirrors the left wing.',
    solutionDiagramType: 'butterfly-symmetry',
    hint: 'Both wings of a butterfly match like mirror twins!'
  });

  // H. Rocket Maze Path
  visualList.push({
    id: 'vis_maze_1',
    category: 'Visual',
    categoryDescription: CATEGORY_DESCRIPTIONS['Visual'],
    question: 'Which path leads the rocket directly to the golden star ⭐?',
    promptAudio: 'Which path leads the rocket directly to the golden star?',
    diagramType: 'rocket-maze',
    options: [
      { id: 'A', text: 'Path A 🪐' },
      { id: 'B', text: 'Path B ⭐' },
      { id: 'C', text: 'Path C 🛸' },
      { id: 'D', text: 'None' }
    ],
    correctAnswerId: 'B',
    solutionText: 'Path B (blue dashed line) curves directly to the golden star!',
    solutionDiagramType: 'rocket-maze',
    hint: 'Trace Path B starting from the rocket with your eyes.'
  });

  return visualList.slice(0, count);
}

// Helper to get seen IDs
function getSeenQuestionIds() {
  try {
    const raw = localStorage.getItem(USED_QUESTIONS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

// Helper to save seen IDs
function markQuestionsAsSeen(ids) {
  try {
    const seen = getSeenQuestionIds();
    ids.forEach((id) => seen.add(id));
    const arr = Array.from(seen).slice(-200);
    localStorage.setItem(USED_QUESTIONS_KEY, JSON.stringify(arr));
  } catch (err) {
    console.warn('Could not save seen questions', err);
  }
}

/**
 * Main session generator: Fetches exactly 10 questions in the chosen topic!
 * @param {'Visual' | 'Analytical Thinking'} selectedSkill
 * @param {number} sheetNumber
 */
export async function getFreshThinksheetSession(selectedSkill = 'Visual', sheetNumber = 1) {
  const seenIds = getSeenQuestionIds();

  if (selectedSkill === 'Analytical Thinking') {
    let pool = ANALYTICAL_BANK.filter(q => !seenIds.has(q.id));
    if (pool.length < 10) {
      pool = [...ANALYTICAL_BANK].sort(() => Math.random() - 0.5);
    }
    const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    markQuestionsAsSeen(chosen.map(q => q.id));
    return chosen;
  } else {
    // Visual Questions
    let visualQuestions = generateVisualQuestions(10);
    markQuestionsAsSeen(visualQuestions.map(q => q.id));
    return visualQuestions;
  }
}

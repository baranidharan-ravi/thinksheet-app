# 🚀 Skill Thinksheet - Playful Learning for 5-Year-Old Explorers

An engaging, visual-first React.js application designed specifically for 5-year-old children, faithfully replicating the cosmic space-themed Thinksheet layout with rich interactive animations, sounds, persistent state, and celebratory feedback.

---

## ✨ Key Features

1. **Space-Themed Interactive UI**:
   - Deep cosmic starry background with twinkling particles.
   - Header with a **10-segment dynamic progress bar** turning green for correct answers and coral-red for incorrect answers.
   - Live XP counter that increments smoothly.
   - Live timer with clock animation.

2. **Visual-First & Kid-Friendly Questions**:
   - Visual grid tile counting puzzles with step-by-step numbered solution overlays.
   - Paper fold and cut corner counting puzzles with labeled corners.
   - Pattern completion, tree apple counting, seesaw balance physics, 3D pyramid block counting, and rocket maze navigation.
   - Age-appropriate analogies and vocabulary.

3. **Pure Web Audio API Sound Engine (Zero Latency, No Broken Links)**:
   - Joyful, sparkling major-chord chime for correct answers.
   - Gentle, encouraging cartoon "uh-oh" boing for incorrect answers.
   - Pop clicks on option taps and starry chimes on results.
   - Built-in **Text-to-Speech (TTS) Voice Narrator** to read aloud questions and solutions for early learners.

4. **Instant Feedback & Solution Walkthroughs**:
   - Option cards highlight orange on selection, transition to vibrant green or red upon submission.
   - Side solution card with visual annotations and "? Ask Doubt" helper tutor.

5. **State Persistence & Resilience**:
   - Automatic background syncing to `localStorage` prevents accidental lost progress on browser refresh.
   - Export/Download progress as a `.json` file for parent/educator review.

6. **Celebration & Results System**:
   - 3D `COMPLETED` ribbon banner and animated glowing stars.
   - Space Cadet League leaderboard with ranked avatars and XP points.
   - Question Summary accordion breakdown of all 10 questions with answer comparisons and visual diagrams.
   - One-click button to load a brand new Thinksheet with fresh randomized questions.

---

## 🛠️ Tech Stack

- **React 18** (Modern functional components & hooks)
- **Vite 6** (Blazing fast HMR and build tool)
- **Tailwind CSS 3** (Custom space theme palette and animations)
- **Lucide Icons** (Clean, child-friendly iconography)
- **Canvas Confetti** (Celebratory particle effects)
- **Web Audio API & Web Speech API** (Zero-asset sound synthesis and voice narration)

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Local Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 3. Build for Production

```bash
npm run build
```

The optimized production build will be generated in the `dist/` directory.

---

## 🎨 Design Reference

Matched to the Skill Thinksheet UI specifications:

- Question 1: 6x6 Grid with 3x3 empty center (9 missing tiles)
- Question 2: Analytical Thinking analogy ("Fast is to Slow, then Good is to Bad")
- Question 3: Paper cut corner logic (4 corners)
- Results & Space Cadet Leaderboard Overview

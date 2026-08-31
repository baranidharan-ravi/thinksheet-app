# 🚀 Skill Thinksheet - Playful Learning for 5-Year-Old Explorers

An engaging, visual-first React.js application designed specifically for 5-year-old children, faithfully replicating the cosmic space-themed Thinksheet layout with rich interactive animations, sounds, persistent state, AI-powered generation, and celebratory feedback.

---

## ✨ Key Features

1. **Space-Themed Interactive UI**:
   - Deep cosmic starry background with twinkling particles.
   - Header with a **10-segment dynamic progress bar** turning green for correct answers and coral-red for incorrect answers.
   - Live XP counter that increments smoothly.
   - Live timer with clock animation.

2. **AI-Powered & Kid-Friendly Question Engine**:
   - **Google Gemini API Integration** (`gemini-2.5-flash`) generates fresh, age-appropriate questions tailored for 5-year-olds on each session.
   - Dual-skill challenges: **Visual** (grid tile counting, folded paper cuts, patterns, seesaws, 3D towers, symmetries) and **Analytical Thinking** (CogAT analogies, odd-one-out classification, cause-and-effect).
   - Multi-tiered reliability with instant fallback to live internet trivia and procedural anti-repetition engine.

3. **Pure Web Audio API Sound Engine (Zero Latency, No Broken Links)**:
   - Joyful, sparkling major-chord chime for correct answers.
   - Gentle, encouraging cartoon "uh-oh" boing for incorrect answers.
   - Pop clicks on option taps and starry chimes on results.
   - Built-in **Text-to-Speech (TTS) Voice Narrator** to read aloud questions and solutions for early learners.

4. **Instant Feedback & Solution Walkthroughs**:
   - Option cards highlight orange on selection, transition to vibrant green or red upon submission.
   - Side solution card with visual annotations and "? Ask Doubt" helper tutor.
   - Confetti star bursts and glowing `+5 XP` badges on correct answers.

5. **State Persistence & Skill Progress**:
   - Solved sheet counters, dynamic level tracks (`LV1` to `LV5`), and session history automatically sync to `localStorage`.
   - Export/Download progress as a `.json` file for parent/educator review.

6. **Celebration & Results System**:
   - 3D `COMPLETED` ribbon banner and animated glowing stars.
   - Space Cadet League leaderboard with ranked avatars and XP points.
   - Question Summary accordion breakdown of all 10 questions with answer comparisons and visual diagrams.

---

## 🔑 How to Get a Google Gemini API Key (Step-by-Step)

The application uses Google Gemini to generate fresh, intelligent questions dynamically. Follow these steps to obtain a free API key:

### Step 1: Open Google AI Studio
1. Navigate to [Google AI Studio](https://aistudio.google.com/app/apikey) in your web browser.
2. Sign in with your Google account.

### Step 2: Create Your API Key
1. Click the **"Create API Key"** (or **"Get API Key"**) button.
2. Select an existing Google Cloud project or choose **"Create API key in new project"**.
3. Copy the generated API key (it starts with `AIzaSy...`).

---

## ⚙️ How to Configure the API Key in the Project

You can configure your API key using either of the following two methods:

### Option A: Enter via the Web Interface (Easiest)
1. Launch the app (`npm run dev`) and open `http://localhost:3000`.
2. On the **Skill Selection Hub** screen, click the **`AI Setup`** button in the top right corner.
3. Paste your Gemini API key into the input field and click **"Save & Apply"**.
4. The key is securely saved in your browser's local storage and used for subsequent sessions.

### Option B: Configure via `.env` File
1. In the root directory of the project (`h:\Shraddha_Project`), create a file named `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
2. Restart the Vite development server (`npm run dev`).

> **Note**: If no API key is provided, the application will automatically use its built-in internet trivia and infinite procedural generation engine, so it remains 100% playable even without a key!

---

## 🛠️ Tech Stack

- **React 18** (Modern functional components & hooks)
- **Google Gen AI SDK** (`@google/genai` / `gemini-2.5-flash`)
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

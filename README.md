# 🚀 Skill Thinksheet - 100% Live AI-Powered Cosmic Learning for Early Explorers

An engaging, visual-first React.js educational platform designed for early childhood and young learners (Ages 2–14), featuring cosmic space-themed Thinksheets, interactive animations, sound effects, on-demand voice narration, **100% real-time direct AI question generation via Google Gemini API (Mandatory API Key with Live Validation)**, configurable auto-advance question pacing, customizable per-question countdown timers, streamlined exit workflows, and strict age-calibrated difficulty with zero offline/cached questions.

---

## ✨ Key Features & Architecture

### 1. ⚙️ Dedicated Full-Screen Settings & Preferences Page

- **Full-Page Configuration Experience**: Replaced popup modals with a dedicated full-screen configuration interface:
  1. **Child's Name** _(Required)_: Personalized explorer name.
  2. **Child's Age** _(Required)_: Quick age selector pills (`3`–`8`) + custom stepper supporting ages `2` to `14`.
  3. **Google Gemini API Key** _(Mandatory 🔑 with Live Validation)_: Features an **Eye (`👁️`) visibility toggle** to easily show or mask your API key, with a direct link to get a free key from Google AI Studio.
  4. **Gemini AI Model Selection** _(Selectable 🤖)_: Choose between `gemini-3.5-flash-lite` _(Recommended)_, `gemini-3.5-flash`, `gemini-3-flash-preview`, and `gemini-2.5-flash`.
  5. **Per-Question Time Limit** _(Optional ⏱️)_: Toggle ON/OFF, select preset limits (`45s`, `60s`, `90s`, `2m`, `3m`), or set a custom duration (`15s`–`300s`).
  6. **Next Question Auto-Advance Delay** _(Optional ⏩)_: Toggle Auto-Advance ON/OFF, select preset delay (`3s`, `5s`, `7s Default`, `10s`, `15s`), or set a custom delay (`2s`–`30s`).
- **Live Verification on Save**: When clicking **"Save & Launch 🚀"**, the app sends an asynchronous test ping to Google Gemini API. If the key is invalid or expired, a clear red error is shown and the settings page remains open until a valid key is provided.
- **Skill Selection Auto-Launch Flow**: If a user clicks a skill card without having entered an API key, the app transitions directly to the Settings page while remembering the targeted skill. Upon successful validation, it immediately launches the selected skill thinksheet.

---

### 2. ⚡ 100% Direct Live Generation (Zero In-Memory Caching)

- **Fresh Generation on Every Request**: Questions are never cached into memory; every time a child starts a new sheet or advances to the next sheet, fresh questions are synthesized live from the Google Gemini API.
- **Skillset-Injected AI Prompts**:
  - The AI prompt explicitly injects the **Selected Skillset Name**, **Detailed Pedagogical Description**, and **Core Learning Objective**:
    - **Visual**: _Visual observation, recognizing geometric & color pattern progressions (AB, AAB, ABC), spatial rotations, object counting, missing grid tiles, isometric 3D block projections, and balance scale weight logic._
    - **Analytical Thinking**: _Logical deduction, relational analogies (A : B :: C : D), everyday cause-and-effect science & nature riddles, categorical classification (odd-one-out), deductive logic riddles, and multi-step critical thinking._
  - Questions in Batch 1 (Q1–Q5) and Batch 2 (Q6–Q10) are assigned distinct sub-topic domains to guarantee high cognitive variety.
- **Strict Non-Repetition & De-duplication**:
  - Normalized string matching (`normalizeText`) ensures all 10 questions in a thinksheet are 100% distinct with zero duplicates in concept, wording, or numbers.
  - Seen question signatures are tracked in browser storage across consecutive sessions to prevent repetition.

---

### 3. 🤖 Active Google Gemini Models Support & Resilient Multi-Model Fallback

- **Active Model Chain**:
  1. `gemini-3.5-flash-lite` _(Primary, ultra-fast endpoint recommended by Google)_
  2. `gemini-3.5-flash`
  3. `gemini-3-flash-preview`
  4. `gemini-2.5-flash`
- **Automatic JSON Sanitizer & Repair**: Automatically cleans parenthesized tuple-style syntax, Python constants (`True`/`False`/`None`), and trailing commas from LLM output.

#### 🧠 Strict 4-Tier Age-Calibrated Pedagogy (Ages 2 to 14)

The AI dynamically adapts prompt personas, vocabulary, and cognitive complexity based on the child's exact age:

| Age Tier                              | Cognitive Level                     | Visual Skill Examples                                                                            | Analytical Thinking Examples                                                                                  |
| :------------------------------------ | :---------------------------------- | :----------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| **Ages 2–4** (Preschool)              | Foundational recognition & counting | Counting 1–5 objects (apples 🍎, stars ⭐), simple AB color patterns (🔴 🔵 🔴 🔵)               | Parent/baby animals (_Puppy : Dog :: Kitten : Cat_), animal sounds & basic colors                             |
| **Ages 5–7** (Early Elementary)       | Early reasoning & arithmetic        | Counting 4–12 items, AAB / ABC patterns, grid tile gaps, balance scales                          | Functional analogies (_Bird : Nest :: Bee : Hive_), everyday cause-and-effect (_Ice in sun -> melts_)         |
| **Ages 8–10** (Upper Elementary)      | Multi-step logic & STEM deduction   | Number sequences (`3, 6, 12, 24, ?`), 3D block projections, grid area matrices                   | Higher-order analogies (_Author : Book :: Sculptor : Statue_), scientific states of matter                    |
| **Ages 11–14** (Middle School / Teen) | Advanced analytical problem-solving | Algebraic & non-linear sequences (`2, 5, 10, 17, 26, ?`), rotational symmetry, isometric volumes | Abstract analogies (_Microscope : Cell :: Telescope : Galaxy_), deductive syllogisms, physics & circuit logic |

---

### 4. 🎨 Rich Visual Representations & Lazy-Loaded Diagram System

- **Comprehensive Visual Support for All Questions**: Every question is accompanied by an intuitive visual representation to enhance comprehension:
  - **Analogy Maps (`analogy-map`)**: Interactive relation cards (`Item A ➔ Item B :: Item C ➔ ?`).
  - **Cause-and-Effect Flow (`cause-effect`)**: Process chains visualizing actions and their results.
  - **Sequence Ladders (`sequence-ladder`)**: Number lines and progression steps with interval rules.
  - **Grid Tiles (`grid-tiles`)**: Missing tile matrices with numbered solution overlays.
  - **Block Towers (`block-tower`)**: 3D isometric block towers and volume stacks.
  - **Pattern Shapes (`pattern-shapes`)**: Sequence cards for shapes, colors, and emoji progressions.
  - **Object Counting (`apple-counting`)**: High-contrast, friendly countable item arrays.
  - **Scale Balance (`scale-balance`)**: Physics lever scales showing heavier/lighter weights.
- **Lazy Image Loading (`loading="lazy"`)**:
  - Direct image diagrams load asynchronously using native browser lazy loading (`loading="lazy"` and `decoding="async"`).
  - Features an animated skeleton shimmer placeholder and smooth fade-in transitions on load for optimal rendering performance and zero layout shift.

---

### 5. ⏩ Configurable Next Question Auto-Advance Pacing

- **Independent Learning Pace Control**: Works whether the per-question timer challenge is enabled or disabled:
  - **When Auto-Advance is Enabled (Default `7s`)**:
    - After an answer is submitted or time expires, the solution is displayed for the configured delay duration with a real-time countdown badge (`Next in 7s... 6s... 5s...`).
    - Automatically advances to the next question when the countdown reaches zero.
    - Includes an immediate `Next (7s) ➔` button to skip waiting anytime.
  - **When Auto-Advance is Disabled (Manual Next Mode)**:
    - The solution and visual diagram remain on screen indefinitely.
    - The student or parent clicks the `Next Question ➔` button when ready to proceed.

---

### 5. 📐 Symmetrical Layout & Live Timer on Submit Button

- **Equal-Height Cards**: The left Question Card and right Options Section share identical vertical heights (`items-stretch` & `h-full`), keeping prompts and visual diagrams neatly centered.
- **Expanding Options Grid**: Option buttons dynamically expand (`flex-1 h-full`) to fill available vertical space.
- **Bottom-Anchored Submit Button with Live Countdown**: The Submit button and Hint power-up are anchored to the bottom of the card/page (`mt-auto border-t border-white/10`).
- **Real-Time Countdown on Submit**: When the timer challenge is active, the Submit button displays the remaining countdown badge (e.g. `Submit ⏱️ 01:30`) with animated color urgency alerts:
  - **Normal (> 15s)**: Dark translucent pill (`bg-black/30 text-white/90`).
  - **Warning (<= 15s)**: Pulsating amber alert (`bg-amber-950/80 text-amber-300`).
  - **Critical (<= 5s)**: Bouncing red urgent indicator (`bg-rose-950 text-rose-300`).

---

### 6. 🚪 Exit Confirmation Workflow

- **Distraction-Free Header**: Clean top bar featuring live XP, timer, voice/sound toggles, fullscreen, and an **`Exit` button**.
- **Interactive Exit Options**: Clicking **Exit** opens a dialog with three choices:
  1. **📥 End Sheet & Download**: Saves the session progress JSON report and returns to the Skill Selection Hub.
  2. **🚪 Exit Without Downloading**: Discards the session and returns directly to the Skill Selection Hub.
  3. **🚀 Continue Sheet**: Resumes the current question seamlessly.

---

### 7. 🎬 ThinkSheet Intro Animation & Clean Dashboard

- **Center Stage Splash**: On opening the dashboard, the green **ThinkSheet** banner starts in the center of the viewport with a glowing bold font and cosmic sparkles (`✨` & `🚀`).
- **Smooth Shrink-to-Top Glide**: Scales down smoothly and glides into its docked position in the top header using an organic spring transition (`cubic-bezier(0.34, 1.3, 0.64, 1)`).
- **Streamlined Skill Cards**: Clean, focused action cards (`Start Visual Sheet ➔` & `Start Analytical Sheet ➔`) without cluttered level badges.

---

### 8. 🗣️ Smart Emoji-Aware Voice Narration (Web Speech API)

- **No Duplicate Reading**: Intelligently strips emoji characters from sentences when reading text aloud, preventing speech synthesis from redundantly repeating the word and emoji name (e.g. _"How many shiny red apples are in the basket?"_ instead of _"shiny red apples red apple"_).
- **Emoji-Only Sequences**: For pattern puzzles composed of emojis (e.g. `🍎 🍌 🍎 🍌`), each emoji is translated into a clean child-friendly word (_"apple banana apple banana"_).
- **On-Demand Only**: Questions and solutions are read aloud only when clicking the speaker button (`🔊`).

---

### 9. 🏆 Space Cadet Leaderboard & Results System

- **Celebratory Feedback**: 3D `COMPLETED` ribbon banner, glowing star ratings (1 to 3 stars), and confetti particle bursts.
- **Question Summary Breakdown**: Detailed accordion review comparing the child's selected answers against correct solutions, with clear `⏱️ Timed Out` indicators for unanswered questions.

---

## 🔑 How to Get a Google Gemini API Key (Step-by-Step)

A Gemini API key is mandatory for generating questions in real time. Follow these simple steps to obtain a free key:

### Step 1: Open Google AI Studio

1. Navigate to [Google AI Studio](https://aistudio.google.com/app/apikey) in your web browser.
2. Sign in with your Google account.

### Step 2: Create Your API Key

1. Click the **"Create API Key"** (or **"Get API Key"**) button.
2. Select an existing Google Cloud project or choose **"Create API key in new project"**.
3. Copy the generated API key (it starts with `AIzaSy...`).

---

## ⚙️ How to Configure the API Key

You can configure your API key using either of the following two methods:

### Option A: Enter in the App Settings Page (Easiest & Validated Live)

1. Launch the app (`npm run dev`) and open `http://localhost:3000`.
2. Navigate to **Settings** (or click any skill card).
3. Enter your child's Name, Age, and paste your Gemini API Key.
4. Click **"Save Settings 🚀"**.
5. The key is verified live with Google Gemini API and securely saved in your browser's local storage for all subsequent sessions.

### Option B: Configure via `.env` File

1. In the root directory of the project, create a `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
2. Restart the Vite development server (`npm run dev`).

---

## 🌐 Deploying to GitHub Pages

### Method 1: Automated Deployment via GitHub Actions (Recommended)

An automated deployment workflow (`.github/workflows/deploy.yml`) is included:

1. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```
2. In your GitHub repository, go to **Settings** ➔ **Pages**.
3. Under **Build and deployment** ➔ **Source**, select **`GitHub Actions`**.
4. Your site will automatically be built and published at:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

### Method 2: Single-Command Deployment via `gh-pages`

```bash
npm run deploy
```

---

## 🛠️ Tech Stack

- **React 18** (Modern functional components & hooks)
- **Google Gemini API** (`gemini-3.5-flash-lite`, `gemini-3.5-flash`, `gemini-3-flash-preview`, `gemini-2.5-flash` via browser-native REST API with live key validation)
- **Vite 6** (Blazing fast HMR and build tool)
- **Tailwind CSS 3** (Custom space theme palette, animations, and responsive design)
- **Lucide Icons** (Clean, child-friendly iconography)
- **Canvas Confetti** (Celebratory particle effects)
- **Web Audio API & Web Speech API** (Zero-asset sound synthesis and sanitized voice narration)

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

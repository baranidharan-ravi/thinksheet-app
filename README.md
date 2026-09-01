# 🚀 Skill Thinksheet - 100% AI-Powered Cosmic Learning for Early Explorers

An engaging, visual-first React.js educational platform designed for early childhood learners (Ages 3–14), featuring cosmic space-themed Thinksheets, interactive animations, sound effects, on-demand voice narration, **100% real-time AI question generation via Google Gemini API**, customizable per-question countdown timers, and strict age-calibrated difficulty with zero offline/hardcoded questions.

---

## ✨ Key Features

### 1. 🤖 100% Real-Time AI Generation (Google Gemini API)
- **Real-Time Synthesis**: Every single question, analogy, option, and visual spatial puzzle is synthesized on demand via the **Google Gemini REST API** (`gemini-3.5-flash-lite` / `gemini-3.6-flash` / `gemini-3.7-flash`).
- **High-Throughput Parallel Batching**: Fetches questions in concurrent batches in ~2 seconds for rapid generation.
- **Mathematical & Diagram Synchronization**: Automated validation ensures SVG visual puzzles (apple counting, pattern shapes, grid tiles, block towers) match the exact numeric count and sequence of the correct answer.
- **No Hardcoded/Static Questions**: The codebase contains zero offline questions or pre-recorded question banks.

### 2. 🎬 ThinkSheet Intro Animation
- **Center Stage Splash**: On opening the dashboard, the green **ThinkSheet** banner starts in the center of the viewport with a huge, glowing bold font (`text-4xl` to `text-7xl`) and cosmic space sparkles (`✨` & `🚀`).
- **Smooth Shrink-to-Top Glide**: Scales down smoothly and glides into its docked position in the top header using an organic spring transition (`cubic-bezier(0.34, 1.3, 0.64, 1)`).
- **Deferred Welcome Prompt**: The Kid Profile dialog (Name & Age) pops up smoothly right after the header animation finishes docking.

### 3. ⏱️ Optional & Customizable Question Timer Limit
- **Configurable on Skill Selection Hub**: Easily toggle the timer challenge **ON** or **OFF** (default is `OFF` for the original relaxed, untimed learning experience).
- **Quick Presets**: `45s`, `60s`, **`90s (Default)`**, `2m`, `3m`.
- **Custom Stepper (`Custom ✍️`)**: Adjust seconds using `+` / `-` buttons from 15s to 300s.
- **Live Countdown & Urgency Visuals**: Real-time timer in the header (`⏱️ 01:30`) with cyan, pulsating amber (<= 15s), and bouncing red (<= 5s) urgency states.
- **5-Second Solution Reveal & Auto-Advance**: If the timer runs out on a question:
  - The question is marked as **Timed Out (Not Answered)**.
  - The **Solution Panel immediately opens and highlights the correct answer for 5 seconds** (`Next in 5s... 4s... 3s...`).
  - Includes a `Next ➔` button so the user can immediately advance without waiting.
  - Automatically advances to the next question when the 5 seconds expire.

### 4. 🗣️ Smart Emoji-Aware Voice Narration (Web Speech API)
- **No Duplicate Reading**: Intelligently strips emoji characters from sentences when reading text aloud, preventing speech synthesis from redundantly repeating the word and emoji name (e.g. *"How many shiny red apples are in the basket?"* instead of *"shiny red apples red apple"*).
- **Emoji-Only Sequences**: For pattern puzzles composed of emojis (e.g. `🍎 🍌 🍎 🍌`), each emoji is translated into a clean child-friendly word (*"apple banana apple banana"*).
- **On-Demand Only**: Questions and solutions are read aloud only when clicking the speaker button (`🔊`).

### 5. 🎂 Personalized Kid Profile & Custom Age Calibration
- **Startup Name & Age Prompt**: Welcomes the child and asks for their **Name** and **Age**.
- **Quick-Select & Custom Age Stepper**: Quick buttons for ages **3, 4, 5, 6, 7, 8** plus an **`Edit ✍️` Custom Stepper** supporting any age from **2 to 14 years old**.
- **Strict Age Calibration**: The AI prompt strictly limits vocabulary, counting ranges, and reasoning complexity to the child's exact age with zero overshoot.
- **Header Profile Badge**: Displays `👋 [Name] (Age [X])` in the top header with one-tap editing anytime.

### 6. 🧠 Dual Skill Learning Tracks
- **Visual Puzzles**:
  - Missing grid tiles (scaled by age with numbered step-by-step overlays).
  - Fruit & shape pattern completions (AB, AAB, and ABC repeating sequences).
  - Object counting (apples, stars, fish, balloons, gems) calibrated to age.
  - Seesaw balance scale physics, 3D block pyramids, paper cuts, mirror symmetry, and rocket mazes.
- **Analytical Thinking**:
  - Age-appropriate analogies with emojis (*Ear : Headphones :: Eye : Glasses*, *Puppy : Dog :: Kitten : Cat*).
  - Picture classification and Odd-One-Out categories.
  - Everyday cause-and-effect reasoning (melting ice in sunshine, seeds sprouting, floating toys).

### 7. 🏆 Space Cadet Leaderboard & Results System
- **Celebratory Feedback**: 3D `COMPLETED` ribbon banner, glowing star ratings (1 to 3 stars), and confetti particle bursts.
- **Space Cadet League**: Dynamic leaderboard featuring the child as `[Name] (You)` with accumulated XP.
- **Question Summary Breakdown**: Detailed accordion review comparing the child's selected answers against correct solutions, with clear `⏱️ Timed Out` indicators for unanswered questions.
- **Skill Progress Tracking**: Tracks solved sheets and dynamic proficiency levels (`LV1 Beginner` to `LV5 Master`).

---

## 🔑 How to Get a Google Gemini API Key (Step-by-Step)

The application uses Google Gemini to generate fresh questions dynamically. Follow these steps to obtain a free API key:

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

### Option A: Enter via the Web Interface (Easiest)
1. Launch the app (`npm run dev`) and open `http://localhost:3000`.
2. On the **Skill Selection Hub** screen, click the **`AI Setup`** button in the top right corner (or click **Configure Gemini API Key** on the AI setup screen).
3. Paste your Gemini API key and click **"Save & Connect 🚀"**.
4. The key is securely saved in your browser's local storage and used for subsequent sessions.

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
- **Google Gemini API** (`gemini-3.5-flash-lite` via browser-native REST API)
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

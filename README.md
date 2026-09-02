# 🚀 Skill Thinksheet - 100% AI-Powered Cosmic Learning for Early Explorers

An engaging, visual-first React.js educational platform designed for early childhood learners (Ages 2–14), featuring cosmic space-themed Thinksheets, interactive animations, sound effects, on-demand voice narration, **100% real-time AI question generation via Google Gemini API (Mandatory API Key with Live Validation)**, customizable per-question countdown timers, streamlined exit workflows, and strict age-calibrated difficulty with zero offline/hardcoded questions.

---

## ✨ Key Features

### 1. 🪟 Unified Explorer & AI Setup Window (with Live Gemini Key Validation)
- **All-in-One Configuration**: A single, clean setup window combines all settings on startup:
  1. **Child's Name** *(Required)*: Personalized explorer name.
  2. **Child's Age** *(Required)*: Quick age selector pills (`3`–`8`) + custom +/- stepper supporting ages `2` to `14`.
  3. **Google Gemini API Key** *(Mandatory 🔑 with Live Validation)*: Features an **Eye (`👁️`) visibility toggle** to easily show or mask your API key, with a direct link to get a free key from Google AI Studio.
  4. **Question Timer Challenge** *(Optional ⏱️)*: Toggle ON/OFF, select preset limits (`45s`, `60s`, `90s`, `2m`, `3m`), or set a custom duration.
- **Live Verification on Save**: When clicking **"Launch Thinksheet 🚀"**, the app makes an instant test ping to Google Gemini API. If the key is invalid or expired, a clear red error is shown and the dialog stays open until a valid key is provided.
- **Skill Selection Auto-Launch**: If a user clicks a skill without having entered an API key, the setup dialog opens, validates the key on save, and automatically launches the selected skill questions seamlessly.

### 2. 🤖 100% Real-Time AI Generation (Mandatory Gemini API Key)
- **Zero Offline / Hardcoded Questions**: The app synthesizes every single question, analogy, and visual puzzle live on demand via the **Google Gemini REST API** (`gemini-3.5-flash-lite`).
- **High-Throughput Parallel Batching**: Fetches 10 questions in parallel batches in ~2 seconds for near-instant loading.
- **Strict Age-Tiered Pedagogy**: AI prompts are dynamically calibrated across 4 distinct cognitive tiers (Preschool 2–4, Early Elementary 5–7, Upper Elementary 8–10, and Teen 11–14).
- **Mathematical & Diagram Synchronization**: Automated validation ensures SVG visual puzzles (apple counting, pattern shapes, grid tiles, scale balance) match the exact numeric count and sequence of the correct answer.

### 3. 📐 Symmetrical Layout & Live Timer on Submit Button
- **Equal-Height Cards**: The left Question Card and right Options Section share identical vertical heights (`items-stretch` & `h-full`), keeping prompts and visual diagrams neatly centered.
- **Expanding Options Grid**: Option buttons dynamically expand (`flex-1 h-full`) to fill available vertical space.
- **Bottom-Anchored Submit Button with Live Countdown**: The Submit button and Hint power-up are anchored to the bottom of the card/page (`mt-auto border-t border-white/10`). When the timer challenge is active, the Submit button displays the real-time remaining countdown badge (e.g. `Submit ⏱️ 01:30`) with animated color urgency alerts.

### 4. 🚪 Exit Confirmation Workflow
- **Distraction-Free Header**: Clean top bar featuring live XP, timer, voice/sound toggles, fullscreen, and an **`Exit` button**.
- **Interactive Exit Options**: Clicking **Exit** opens a dialog with three choices:
  1. **📥 End Sheet & Download**: Saves the session progress JSON report and returns to the Skill Selection Hub.
  2. **🚪 Exit Without Downloading**: Discards the session and returns directly to the Skill Selection Hub.
  3. **🚀 Continue Sheet**: Resumes the current question seamlessly.

### 5. ⏱️ Optional & Customizable Question Timer Limit
- **Configurable in Setup Window & Hub**: Turn Timer Challenge **ON** or **OFF** (default is `OFF` for relaxed, untimed learning).
- **Quick Presets**: `45s`, `60s`, **`90s (Default)`**, `2m`, `3m`, plus `Custom ✍️` stepper (`15s`–`300s`).
- **Live Countdown & Urgency Visuals**: Real-time timer in the header (`⏱️ 01:30`) and on the Submit button with cyan, pulsating amber (<= 15s), and bouncing red (<= 5s) urgency states.
- **7-Second Solution Reveal & Auto-Advance**: If the timer runs out on a question:
  - The question is marked as **Timed Out (Not Answered)** with red wrong-answer styling.
  - The **Solution Panel immediately opens and highlights the correct answer for 7 seconds** (`Next in 7s... 6s... 5s...`).
  - Voice narration announces that time expired and the next question will load automatically.
  - Includes an immediate `Next ➔` button to skip waiting.

### 6. 🎬 ThinkSheet Intro Animation
- **Center Stage Splash**: On opening the dashboard, the green **ThinkSheet** banner starts in the center of the viewport with a huge, glowing bold font (`text-4xl` to `text-7xl`) and cosmic space sparkles (`✨` & `🚀`).
- **Smooth Shrink-to-Top Glide**: Scales down smoothly and glides into its docked position in the top header using an organic spring transition (`cubic-bezier(0.34, 1.3, 0.64, 1)`).
- **Deferred Welcome Prompt**: The Unified Setup Modal pops up smoothly right after the header animation finishes docking.

### 7. 🗣️ Smart Emoji-Aware Voice Narration (Web Speech API)
- **No Duplicate Reading**: Intelligently strips emoji characters from sentences when reading text aloud, preventing speech synthesis from redundantly repeating the word and emoji name (e.g. *"How many shiny red apples are in the basket?"* instead of *"shiny red apples red apple"*).
- **Emoji-Only Sequences**: For pattern puzzles composed of emojis (e.g. `🍎 🍌 🍎 🍌`), each emoji is translated into a clean child-friendly word (*"apple banana apple banana"*).
- **On-Demand Only**: Questions and solutions are read aloud only when clicking the speaker button (`🔊`).

### 8. 🧠 Dual Skill Learning Tracks
- **Visual Puzzles**:
  - Missing grid tiles (scaled by age with numbered step-by-step overlays).
  - Fruit & shape pattern completions (AB, AAB, and ABC repeating sequences).
  - Object counting (apples, stars, fish, balloons, gems) calibrated to age.
  - Seesaw balance scale physics, 3D block pyramids, paper cuts, mirror symmetry, and rocket mazes.
- **Analytical Thinking**:
  - Age-appropriate analogies with emojis (*Ear : Headphones :: Eye : Glasses*, *Puppy : Dog :: Kitten : Cat*).
  - Picture classification and Odd-One-Out categories.
  - Everyday cause-and-effect reasoning (melting ice in sunshine, seeds sprouting, floating toys).

### 9. 🏆 Space Cadet Leaderboard & Results System
- **Celebratory Feedback**: 3D `COMPLETED` ribbon banner, glowing star ratings (1 to 3 stars), and confetti particle bursts.
- **Space Cadet League**: Dynamic leaderboard featuring the child as `[Name] (You)` with accumulated XP.
- **Question Summary Breakdown**: Detailed accordion review comparing the child's selected answers against correct solutions, with clear `⏱️ Timed Out` indicators for unanswered questions.
- **Skill Progress Tracking**: Tracks solved sheets and dynamic proficiency levels (`LV1 Beginner` to `LV5 Master`).

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

### Option A: Enter in the App Setup Window (Easiest & Validated Live)
1. Launch the app (`npm run dev`) and open `http://localhost:3000`.
2. Enter your child's Name, Age, and paste your Gemini API Key in the **Explorer & AI Setup** window.
3. Click **"Launch Thinksheet 🚀"**.
4. The key is verified live with Google Gemini API and securely saved in your browser's local storage for all subsequent sessions.

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
- **Google Gemini API** (`gemini-3.5-flash-lite` via browser-native REST API with live key validation)
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

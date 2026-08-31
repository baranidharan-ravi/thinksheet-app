# 🚀 Skill Thinksheet - Cosmic Learning & Reasoning for Early Explorers

An engaging, visual-first React.js educational platform designed for early childhood learners (Ages 3–8), featuring cosmic space-themed Thinksheets, interactive animations, sound effects, voice narration, AI-powered generation with Google Gemini, and strict age-calibrated difficulty.

---

## ✨ Key Features

### 1. 🎂 Personalized Kid Profile & Age Calibration
- **Initial Launch Prompt**: Greets the child and asks for their **Name** and **Age** (selectable from 3 to 8+ years old).
- **Strict Age Calibration**: Both AI generation and the offline procedural engine strictly tailor challenge complexity, grid dimensions, item counting, and vocabulary to the child's exact age.
- **Zero Overshoot**: Never presents questions or concepts above the child's configured age.
- **Profile Header Pill**: Displays `👋 [Name] (Age [X])` in the top header with one-tap editing anytime.

### 2. 🧠 Dual Skill Learning Tracks
- **Visual Puzzles**:
  - Grid missing tile counting (3x3 up to 7x7 grids with numbered step-by-step overlays).
  - Fruit & shape pattern completions (AB, AAB, and ABC repeating sequences).
  - Object counting (apples, stars, fish, balloons, gems) scaled by age.
  - Seesaw balance scale physics, 3D block pyramids, paper cuts, mirror symmetry, and rocket mazes.
- **Analytical Thinking**:
  - CogAT-style analogies with emojis (*Ear : Headphones :: Eye : Glasses*, *Puppy : Dog :: Kitten : Cat*).
  - Picture classification and Odd-One-Out categories.
  - Everyday cause-and-effect reasoning (melting ice, seed sprouting, floating toys).

### 3. 🤖 AI-Powered Question Synthesis (Google Gemini API)
- **Direct REST Integration**: Uses lightweight, browser-native Gemini REST API with multi-model fallback (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`).
- **Dynamic & Non-Repeating**: Generates 10 fresh, unique questions every time a skill is selected.
- **Multi-Tiered Reliability**: Seamlessly falls back to our live internet trivia and procedural anti-repetition engine if offline or if no API key is provided.
- **Client-Side Option Shuffling**: Guarantees randomized, balanced distribution across options A, B, C, and D.

### 4. 🔊 Zero-Asset Web Audio & Voice Narrator
- **Pure Web Audio API**: Joyful major-chord chimes for correct answers, gentle cartoon "uh-oh" boings for incorrect answers, and pop clicks on taps.
- **Built-in Voice Narrator (Web Speech API)**: Automatically reads aloud questions and solutions for young learners.

### 5. 🏆 Space Cadet Leaderboard & Results System
- **Celebratory Feedback**: 3D `COMPLETED` ribbon banner, glowing star ratings (1 to 3 stars), and confetti bursts.
- **Space Cadet League**: Dynamic leaderboard featuring the child as `[Name] (You)` with accumulated XP.
- **Question Summary Breakdown**: Detailed accordion review comparing the child's answers against correct solutions.
- **Skill Progress Tracking**: Tracks solved sheets and dynamic proficiency levels (`LV1 Beginner` to `LV5 Master`).

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

## ⚙️ How to Configure the API Key

You can configure your API key using either of the following two methods:

### Option A: Enter via the Web Interface (Easiest)
1. Launch the app (`npm run dev`) and open `http://localhost:3000`.
2. On the **Skill Selection Hub** screen, click the **`AI Setup`** button in the top right corner.
3. Paste your Gemini API key and click **"Save & Apply"**.
4. The key is securely saved in your browser's local storage and used for subsequent sessions.

### Option B: Configure via `.env` File
1. In the root directory of the project, create a `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
2. Restart the Vite development server (`npm run dev`).

> **Note**: If no API key is provided, the application will automatically use its built-in procedural and internet question engine, so it remains 100% playable even without an API key!

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
- **Google Gemini API** (`gemini-2.5-flash` via browser-native REST)
- **Vite 6** (Blazing fast HMR and build tool)
- **Tailwind CSS 3** (Custom space theme palette and responsive design)
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

// Progress Tracker & Profile Manager for Skill Thinksheets

const PROFILE_KEY = 'thinksheet_kid_profile_v4';
const KID_NAME_KEY = 'thinksheet_custom_kid_name_v2';
const KID_AGE_KEY = 'thinksheet_custom_kid_age_v2';

export const INITIAL_PROFILE = {
  visualSolved: 0,
  analyticalSolved: 0,
  visualScores: [],
  analyticalScores: [],
  thinksheetsRemaining: 10,
  expiryDate: '31st October, 2026',
  studentName: '',
  studentAge: 5
};

export function getStoredKidName() {
  try {
    return localStorage.getItem(KID_NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function getStoredKidAge() {
  try {
    const raw = localStorage.getItem(KID_AGE_KEY);
    return raw ? parseInt(raw, 10) || 5 : 5;
  } catch {
    return 5;
  }
}

export function saveStoredKidProfile(name, age) {
  try {
    if (name) {
      localStorage.setItem(KID_NAME_KEY, name.trim());
    } else {
      localStorage.removeItem(KID_NAME_KEY);
    }
    if (age) {
      localStorage.setItem(KID_AGE_KEY, String(age));
    }
  } catch (err) {
    console.warn('Could not save kid profile to localStorage', err);
  }
}

export function loadProfileStats() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    const kidName = getStoredKidName();
    const kidAge = getStoredKidAge();
    if (!raw) return { ...INITIAL_PROFILE, studentName: kidName, studentAge: kidAge };
    return { ...INITIAL_PROFILE, ...JSON.parse(raw), studentName: kidName, studentAge: kidAge };
  } catch {
    return INITIAL_PROFILE;
  }
}

export function saveProfileStats(stats) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn('Could not save profile stats', err);
  }
}

export function resetProfileStats() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(KID_NAME_KEY);
    localStorage.removeItem(KID_AGE_KEY);
  } catch (err) {
    console.warn('Could not clear profile stats', err);
  }
  return INITIAL_PROFILE;
}

/**
 * Record a completed Thinksheet session and update stats
 */
export function recordCompletedSheet(skill, scorePercent) {
  const profile = loadProfileStats();

  if (skill === 'Visual') {
    profile.visualSolved = (profile.visualSolved || 0) + 1;
    profile.visualScores = [...(profile.visualScores || []), scorePercent];
  } else {
    profile.analyticalSolved = (profile.analyticalSolved || 0) + 1;
    profile.analyticalScores = [...(profile.analyticalScores || []), scorePercent];
  }

  if (profile.thinksheetsRemaining > 0) {
    profile.thinksheetsRemaining = Math.max(0, profile.thinksheetsRemaining - 1);
  }

  saveProfileStats(profile);
  return profile;
}

/**
 * Calculate skill level (LV1 to LV5) and title based on solved count & score
 */
export function calculateSkillLevel(solvedCount, scores = []) {
  if (solvedCount === 0) {
    return {
      levelNumber: 1,
      levelTitle: 'Beginner',
      progressPercent: 0,
      avgScore: 0
    };
  }

  const avg = scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 100;

  let levelNumber = 1;
  let levelTitle = 'Learner';
  let progressPercent = 20;

  if (solvedCount >= 20 && avg >= 85) {
    levelNumber = 5;
    levelTitle = 'Master';
    progressPercent = 100;
  } else if (solvedCount >= 12 && avg >= 75) {
    levelNumber = 4;
    levelTitle = 'Proficient';
    progressPercent = 80;
  } else if (solvedCount >= 8 && avg >= 70) {
    levelNumber = 3;
    levelTitle = 'Capable';
    progressPercent = 60;
  } else if (solvedCount >= 4) {
    levelNumber = 2;
    levelTitle = 'Explorer';
    progressPercent = 40;
  } else {
    levelNumber = 1;
    levelTitle = 'Learner';
    progressPercent = 20;
  }

  return {
    levelNumber,
    levelTitle,
    progressPercent,
    avgScore: Math.round(avg)
  };
}

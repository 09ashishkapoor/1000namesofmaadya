// Normalize text (lowercase, remove accents)
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[-–—]/g, ""); // remove hyphens
}

// Simple tokenizer (like VS Code splitting words)
function tokenize(query) {
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean);
}

function wordMatchScore(text, token, weight) {
  if (!text) return 0;

  // extract clean words (removes punctuation like "(Om)", "Om," etc.)
  const words = text.match(/\b\w+\b/g) || [];

  for (const w of words) {
    if (w === token) return weight * 4;        // exact word
    if (w.startsWith(token)) return weight * 2.5;
  }

  return 0;
}

// Fuzzy match: characters in order (sh -> shiva)
function fuzzyMatch(text, token) {
  let t = 0;
  let matches = 0;

  for (let i = 0; i < token.length; i++) {
    t = text.indexOf(token[i], t);
    if (t === -1) return false;
    matches++;
    t++;
  }

  // require at least 70% of characters to match meaningfully
  return matches / token.length >= 0.7;
}

// Score a single field
function scoreField(text, tokens, weight, isBody = false) {
  let score = 0;

  for (const token of tokens) {
    if (!text) continue;

    const index = text.indexOf(token);

    // 1. word-level priority
    const wordScore = wordMatchScore(text, token, weight);
    if (wordScore > 0) {
      score += wordScore;
      continue;
    }

    // 2. contains logic
    if (index !== -1) {

      // BODY behavior (controlled)
      if (isBody) {
        const wordBoundary = new RegExp(`\\b${token}\\b`, 'i');

        // IMPORTANT: only count FIRST occurrence
        if (token.length <= 2) {
          if (wordBoundary.test(text)) {
            score += weight * 1.0;   // standalone "Om" for example → strong
          } else {
            score += weight * 0.05;  // inside words → VERY weak
          }
        } else {
          const positionFactor = 1 - Math.min(index / text.length, 0.95);

          // exponential boost for early matches
          score += weight * (0.5 + positionFactor * positionFactor * 2);
        }

        // prevent stacking from multiple matches
        break;
      }

      // TITLE stays strong always
      score += weight * 1.5;
      continue;
    }

    // 3. fuzzy ONLY for titles
    if (!isBody && weight === 100 && token.length >= 2 && fuzzyMatch(text, token)) {
      score += weight * 0.2;
    }
  }

  return score;
}

function hasWholeWord(text, token) {
  if (!text) return false;
  return new RegExp(`\\b${token}\\b`, "i").test(text);
}

function hasWordPrefix(text, token) {
  if (!text) return false;
  return new RegExp(`\\b${token}`, "i").test(text);
}

// Main search function
export function searchEntries(data, query, language = "english") {
  if (!query) return data;

  const tokens = tokenize(query);

  return data
    .map(entry => {
      const name = normalize(
        language === "hindi" ? entry.hindi_name : entry.english_name
      );

      const oneLine = normalize(
        language === "hindi" ? entry.hindi_one_line : entry.english_one_line
      );

      const elaboration = normalize(
        language === "hindi"
          ? entry.hindi_elaboration
          : entry.english_elaboration
      );

      const hasStrictMatch = tokens.some(t => {
        // only allow matches that align with real word structure

        const nameMatch =
          hasWholeWord(name, t) ||
          hasWordPrefix(name, t);

        const bodyMatch =
          hasWholeWord(oneLine, t) ||
          hasWordPrefix(oneLine, t) ||
          hasWholeWord(elaboration, t) ||
          hasWordPrefix(elaboration, t);

        return nameMatch || bodyMatch;
      });
      
      const hasFuzzyMatch = tokens.some(t =>
        t.length >= 2 && fuzzyMatch(name, t)
      );

      if (!hasStrictMatch && !hasFuzzyMatch) {
        return null;
      }

      let score = 0;
      let bucket = 99;

      for (const token of tokens) {
        const titleHasWhole = hasWholeWord(name, token);
        const titleHasPrefix = hasWordPrefix(name, token);
        const bodyHasWhole =
          hasWholeWord(oneLine, token) || hasWholeWord(elaboration, token);

        const bodyHasContains =
          oneLine.includes(token) || elaboration.includes(token);

        // Bucket 0: ANY title match (keep this strong)
        if (titleHasWhole || titleHasPrefix || name.includes(token)) {
          bucket = Math.min(bucket, 0);
        }

        // Bucket 1: ONLY real standalone word in body
        else if (bodyHasWhole) {
          bucket = Math.min(bucket, 1);
        }

        // Bucket 2: everything else (omniscient etc.)
        else if (bodyHasContains) {
          bucket = Math.min(bucket, 2);
        }

        // keep your scoring, but bucket decides major ordering
        score += scoreField(name, [token], 100, false);
        score += scoreField(oneLine, [token], 40, false);
        score += scoreField(elaboration, [token], 10, true);
      }

      return { entry, score, bucket };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.bucket !== b.bucket) return a.bucket - b.bucket;
      return b.score - a.score;
    })
    .map(x => x.entry);
}
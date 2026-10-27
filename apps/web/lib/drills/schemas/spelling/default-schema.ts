export const spellingChallengeDefaultSchema = `{
  "id": "spelling_challenge",
  "title": "Spelling Challenge",
  "description": "Listen to each word and type the correct spelling.",
  "version": 1,
  "category": "Listening",
  "skills": ["Listening", "Spelling"],

  "audio": {
    "provider": "browser_tts",
    "language": "en-GB",
    "rate": 0.9,
    "pitch": 1,
    "volume": 1
  },

  "levels": [
    {
      "id": 1,
      "title": "Everyday Words",
      "description": "Simple everyday English words.",
      "difficulty": "easy",
      "settings": {
        "questions": 5,
        "replayLimit": -1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "hotel" },
        { "id": 2, "type": "spell_word", "word": "garden" },
        { "id": 3, "type": "spell_word", "word": "doctor" },
        { "id": 4, "type": "spell_word", "word": "student" },
        { "id": 5, "type": "spell_word", "word": "library" }
      ]
    },
    {
      "id": 2,
      "title": "Travel",
      "description": "Common travel vocabulary.",
      "difficulty": "easy",
      "settings": {
        "questions": 5,
        "replayLimit": 3,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "airport" },
        { "id": 2, "type": "spell_word", "word": "passport" },
        { "id": 3, "type": "spell_word", "word": "journey" },
        { "id": 4, "type": "spell_word", "word": "luggage" },
        { "id": 5, "type": "spell_word", "word": "boarding" }
      ]
    },
    {
      "id": 3,
      "title": "Education",
      "description": "School and university vocabulary.",
      "difficulty": "easy",
      "settings": {
        "questions": 5,
        "replayLimit": 3,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "university" },
        { "id": 2, "type": "spell_word", "word": "lecture" },
        { "id": 3, "type": "spell_word", "word": "assignment" },
        { "id": 4, "type": "spell_word", "word": "research" },
        { "id": 5, "type": "spell_word", "word": "certificate" }
      ]
    },
    {
      "id": 4,
      "title": "Work",
      "description": "Vocabulary related to jobs and careers.",
      "difficulty": "medium",
      "settings": {
        "questions": 5,
        "replayLimit": 2,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "employee" },
        { "id": 2, "type": "spell_word", "word": "manager" },
        { "id": 3, "type": "spell_word", "word": "interview" },
        { "id": 4, "type": "spell_word", "word": "promotion" },
        { "id": 5, "type": "spell_word", "word": "experience" }
      ]
    },
    {
      "id": 5,
      "title": "Health",
      "description": "Health and medical vocabulary.",
      "difficulty": "medium",
      "settings": {
        "questions": 5,
        "replayLimit": 2,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "medicine" },
        { "id": 2, "type": "spell_word", "word": "hospital" },
        { "id": 3, "type": "spell_word", "word": "exercise" },
        { "id": 4, "type": "spell_word", "word": "nutrition" },
        { "id": 5, "type": "spell_word", "word": "appointment" }
      ]
    },
    {
      "id": 6,
      "title": "Environment",
      "description": "Environmental vocabulary commonly seen in IELTS.",
      "difficulty": "medium",
      "settings": {
        "questions": 5,
        "replayLimit": 2,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "environment" },
        { "id": 2, "type": "spell_word", "word": "pollution" },
        { "id": 3, "type": "spell_word", "word": "recycling" },
        { "id": 4, "type": "spell_word", "word": "wildlife" },
        { "id": 5, "type": "spell_word", "word": "conservation" }
      ]
    },
    {
      "id": 7,
      "title": "Technology",
      "description": "Technology and communication vocabulary.",
      "difficulty": "medium",
      "settings": {
        "questions": 5,
        "replayLimit": 2,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "computer" },
        { "id": 2, "type": "spell_word", "word": "software" },
        { "id": 3, "type": "spell_word", "word": "internet" },
        { "id": 4, "type": "spell_word", "word": "database" },
        { "id": 5, "type": "spell_word", "word": "application" }
      ]
    },
    {
      "id": 8,
      "title": "Academic Vocabulary",
      "description": "Frequently used academic words.",
      "difficulty": "hard",
      "settings": {
        "questions": 5,
        "replayLimit": 1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "analysis" },
        { "id": 2, "type": "spell_word", "word": "significant" },
        { "id": 3, "type": "spell_word", "word": "methodology" },
        { "id": 4, "type": "spell_word", "word": "assessment" },
        { "id": 5, "type": "spell_word", "word": "evaluation" }
      ]
    },
    {
      "id": 9,
      "title": "Commonly Misspelled Words",
      "description": "Words that IELTS learners often misspell.",
      "difficulty": "hard",
      "settings": {
        "questions": 5,
        "replayLimit": 1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "accommodation" },
        { "id": 2, "type": "spell_word", "word": "necessary" },
        { "id": 3, "type": "spell_word", "word": "government" },
        { "id": 4, "type": "spell_word", "word": "recommend" },
        { "id": 5, "type": "spell_word", "word": "restaurant" }
      ]
    },
    {
      "id": 10,
      "title": "Master Challenge",
      "description": "A mixed review of everything you've learned.",
      "difficulty": "hard",
      "settings": {
        "questions": 5,
        "replayLimit": 1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "spell_word", "word": "entrepreneur" },
        { "id": 2, "type": "spell_word", "word": "questionnaire" },
        { "id": 3, "type": "spell_word", "word": "temperature" },
        { "id": 4, "type": "spell_word", "word": "opportunity" },
        { "id": 5, "type": "spell_word", "word": "responsibility" }
      ]
    }
  ]
}`
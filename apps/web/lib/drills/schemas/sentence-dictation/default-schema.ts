export const sentenceDictationDefaultSchema = `{
  "id": "sentence_dictation",
  "title": "Sentence Dictation",
  "description": "Listen to a sentence and type exactly what you hear.",
  "version": 1,
  "category": "Listening",
  "skills": ["Listening", "Dictation"],

  "audio": {
    "provider": "browser_tts",
    "language": "en-GB",
    "rate": 0.85,
    "pitch": 1,
    "volume": 1
  },

  "levels": [
    {
      "id": 1,
      "title": "Simple Sentences",
      "description": "Short, clear sentences with basic vocabulary.",
      "difficulty": "easy",
      "settings": {
        "questions": 5,
        "replayLimit": -1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "The cat sat on the mat." },
        { "id": 2, "type": "dictate_sentence", "sentence": "I like to read books." },
        { "id": 3, "type": "dictate_sentence", "sentence": "She goes to school every day." },
        { "id": 4, "type": "dictate_sentence", "sentence": "The weather is nice today." },
        { "id": 5, "type": "dictate_sentence", "sentence": "We have a small garden." }
      ]
    },
    {
      "id": 2,
      "title": "Daily Routines",
      "description": "Sentences about everyday activities.",
      "difficulty": "easy",
      "settings": {
        "questions": 5,
        "replayLimit": 3,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "I wake up at seven o'clock every morning." },
        { "id": 2, "type": "dictate_sentence", "sentence": "She drinks a cup of coffee before work." },
        { "id": 3, "type": "dictate_sentence", "sentence": "He takes the bus to the office." },
        { "id": 4, "type": "dictate_sentence", "sentence": "We usually have dinner at six." },
        { "id": 5, "type": "dictate_sentence", "sentence": "They watch television in the evening." }
      ]
    },
    {
      "id": 3,
      "title": "Descriptions",
      "description": "Sentences describing people, places, and things.",
      "difficulty": "easy",
      "settings": {
        "questions": 5,
        "replayLimit": 3,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "The tall building has many windows." },
        { "id": 2, "type": "dictate_sentence", "sentence": "My brother is taller than my sister." },
        { "id": 3, "type": "dictate_sentence", "sentence": "The red car is parked outside." },
        { "id": 4, "type": "dictate_sentence", "sentence": "She wore a beautiful blue dress." },
        { "id": 5, "type": "dictate_sentence", "sentence": "The restaurant serves excellent food." }
      ]
    },
    {
      "id": 4,
      "title": "Travel and Places",
      "description": "Sentences about traveling and different locations.",
      "difficulty": "medium",
      "settings": {
        "questions": 5,
        "replayLimit": 2,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "The airport is about thirty minutes from the city centre." },
        { "id": 2, "type": "dictate_sentence", "sentence": "We need to book our hotel reservation before the trip." },
        { "id": 3, "type": "dictate_sentence", "sentence": "She packed her suitcase with all the essentials." },
        { "id": 4, "type": "dictate_sentence", "sentence": "The train departs from platform five at nine." },
        { "id": 5, "type": "dictate_sentence", "sentence": "They visited several museums during their holiday." }
      ]
    },
    {
      "id": 5,
      "title": "Work and Career",
      "description": "Sentences related to professional life.",
      "difficulty": "medium",
      "settings": {
        "questions": 5,
        "replayLimit": 2,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "The manager held a meeting with all the employees." },
        { "id": 2, "type": "dictate_sentence", "sentence": "She submitted her application before the deadline." },
        { "id": 3, "type": "dictate_sentence", "sentence": "The company is planning to expand into new markets." },
        { "id": 4, "type": "dictate_sentence", "sentence": "He received a promotion after five years of service." },
        { "id": 5, "type": "dictate_sentence", "sentence": "The interview went very well and she got the job." }
      ]
    },
    {
      "id": 6,
      "title": "Health and Lifestyle",
      "description": "Sentences about health, fitness, and wellbeing.",
      "difficulty": "medium",
      "settings": {
        "questions": 5,
        "replayLimit": 2,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "Regular exercise is important for maintaining good health." },
        { "id": 2, "type": "dictate_sentence", "sentence": "The doctor recommended eating more fruits and vegetables." },
        { "id": 3, "type": "dictate_sentence", "sentence": "She goes to the gym three times a week." },
        { "id": 4, "type": "dictate_sentence", "sentence": "Getting enough sleep is essential for concentration." },
        { "id": 5, "type": "dictate_sentence", "sentence": "He decided to quit smoking for the sake of his health." }
      ]
    },
    {
      "id": 7,
      "title": "Environment",
      "description": "Sentences about nature and environmental issues.",
      "difficulty": "medium",
      "settings": {
        "questions": 5,
        "replayLimit": 2,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "Climate change is one of the biggest challenges we face today." },
        { "id": 2, "type": "dictate_sentence", "sentence": "Recycling plastic helps reduce pollution in our oceans." },
        { "id": 3, "type": "dictate_sentence", "sentence": "The government introduced new regulations to protect wildlife." },
        { "id": 4, "type": "dictate_sentence", "sentence": "Solar energy is becoming increasingly popular around the world." },
        { "id": 5, "type": "dictate_sentence", "sentence": "Deforestation has a significant impact on biodiversity." }
      ]
    },
    {
      "id": 8,
      "title": "Education and Learning",
      "description": "Sentences about education systems and academic life.",
      "difficulty": "hard",
      "settings": {
        "questions": 5,
        "replayLimit": 1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "The university offers a wide range of undergraduate and postgraduate programmes." },
        { "id": 2, "type": "dictate_sentence", "sentence": "Students are required to submit their assignments by the end of the semester." },
        { "id": 3, "type": "dictate_sentence", "sentence": "Critical thinking is an essential skill for academic success." },
        { "id": 4, "type": "dictate_sentence", "sentence": "The research findings were published in a reputable scientific journal." },
        { "id": 5, "type": "dictate_sentence", "sentence": "She decided to pursue a career in environmental science after graduating." }
      ]
    },
    {
      "id": 9,
      "title": "Complex Structures",
      "description": "Sentences with complex grammar and advanced vocabulary.",
      "difficulty": "hard",
      "settings": {
        "questions": 5,
        "replayLimit": 1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "Although the experiment was conducted several times, the results remained inconclusive." },
        { "id": 2, "type": "dictate_sentence", "sentence": "The committee decided to postpone the project until additional funding could be secured." },
        { "id": 3, "type": "dictate_sentence", "sentence": "Notwithstanding the challenges they faced, the team managed to complete the assignment on time." },
        { "id": 4, "type": "dictate_sentence", "sentence": "The phenomenon has been extensively studied by researchers in numerous countries." },
        { "id": 5, "type": "dictate_sentence", "sentence": "It is imperative that the regulations be implemented without further delay." }
      ]
    },
    {
      "id": 10,
      "title": "Master Dictation",
      "description": "The ultimate test of your listening and transcription skills.",
      "difficulty": "hard",
      "settings": {
        "questions": 5,
        "replayLimit": 1,
        "passingScore": 80
      },
      "questions": [
        { "id": 1, "type": "dictate_sentence", "sentence": "The juxtaposition of traditional and modern architectural styles creates a fascinating visual contrast throughout the city." },
        { "id": 2, "type": "dictate_sentence", "sentence": "Despite the numerous obstacles encountered during the investigation, the detectives remained steadfast in their pursuit of the truth." },
        { "id": 3, "type": "dictate_sentence", "sentence": "The implementation of comprehensive educational reforms necessitated a substantial reallocation of government resources." },
        { "id": 4, "type": "dictate_sentence", "sentence": "Contemporary environmental challenges demand unprecedented levels of international cooperation and collective responsibility." },
        { "id": 5, "type": "dictate_sentence", "sentence": "The ramifications of the economic downturn were felt across virtually every sector of the global marketplace." }
      ]
    }
  ]
}`

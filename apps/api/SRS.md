# 🧠 SRS for Api

> 🟡 Guest users can **take tests only**
> 🔵 Logged-in users can **submit + evaluate + get scores**

---

## 🟡 Guest User

Can:

- View test
- Attempt test
- Select answers

Cannot:

- Submit for scoring
- Get band score
- Save history

---

## 🔵 Logged-in User (Google via Better Auth)

Can:

- Take test
- Submit answers
- Get score + band
- Save attempt history
- View analytics

---

# 🏗️ SIMPLIFIED ARCHITECTURE

We remove guest accounts entirely from backend logic.

```txt id="arch1"
USER (Google only)
   ↓
TEST
   ↓
ATTEMPT (only for logged-in users)
```

---

# 📘 FINAL API SRS (SIMPLIFIED VERSION)

---

# 1. AUTH (handled by frontend Better Auth)

Backend does NOT implement auth.

You only receive:

```txt id="auth1"
Authorization: Bearer <JWT>
```

Or user info from middleware.

---

# 2. BOOK APIs

## Get Books

```http id="b1"
GET /api/books
```

---

## Get Tests in Book

```http id="b2"
GET /api/books/:bookId/tests
```

---

# 3. TEST APIs

## Get Full Test (PUBLIC)

```http id="t1"
GET /api/tests/:testId
```

✔ No login required
✔ Used for rendering exam UI

---

## Get Module (PUBLIC)

```http id="t2"
GET /api/tests/:testId/module/:type
```

---

## Get Part (PUBLIC)

```http id="t3"
GET /api/tests/:testId/module/:type/part/:partNumber
```

---

# 4. ATTEMPT SYSTEM (LOGIN REQUIRED FOR SCORING)

---

## 4.1 Start Attempt

```http id="a1"
POST /api/attempts/start
```

### Middleware:

✔ Must be logged in

### Body:

```json id="a2"
{
  "testId": "123",
  "mode": "FULL_TEST"
}
```

---

### Response:

```json id="a3"
{
  "attemptId": "abc123"
}
```

---

## 4.2 Submit Attempt (SCORING ENDPOINT)

```http id="a4"
POST /api/attempts/:attemptId/submit
```

### Middleware:

✔ LOGIN REQUIRED (VERY IMPORTANT RULE)

---

### Body:

```json id="a5"
{
  "answers": [
    { "questionNumber": 1, "answer": "Tuesday" },
    { "questionNumber": 2, "answer": "London" }
  ]
}
```

---

### Response:

```json id="a6"
{
  "score": 32,
  "band": 7.5,
  "correct": 32,
  "total": 40
}
```

---

## 4.3 Get Attempt History

```http id="a7"
GET /api/attempts/my
```

✔ Logged-in only

---

# 5. ATTEMPT SCHEMA (SIMPLIFIED)

No guest logic anymore.

```js id="s1"
const AttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    mode: {
      type: String,
      enum: ["FULL_TEST", "MODULE", "PART"],
    },

    moduleType: String,
    partNumber: Number,

    answers: [
      {
        questionNumber: Number,
        answer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
      },
    ],

    score: Number,
    band: Number,

    startedAt: Date,
    submittedAt: Date,
  },
  { timestamps: true }
)
```

---

# 6. AUTH MIDDLEWARE (IMPORTANT)

You only need one middleware:

```txt id="m1"
requireAuth
```

Used ONLY for:

- submit attempt
- start attempt (optional but recommended)
- view history

---

# 7. BUSINESS RULES

---

## Rule 1: Test access

```txt id="r1"
Anyone can load test
```

---

## Rule 2: Scoring restriction

```txt id="r2"
Only logged-in users can submit answers
```

---

## Rule 3: No scoring for guests

Frontend behavior:

```txt id="r3"
Guest:
  - can answer
  - cannot submit (button disabled or login modal)

Logged-in:
  - can submit
  - gets score
```

---

# 8. SIMPLE SYSTEM FLOW

---

## 🟡 Guest Flow

```txt id="f1"
Open test
→ answer questions
→ try submit
→ "Login required to evaluate"
```

---

## 🔵 Logged-in Flow

```txt id="f2"
Login (Better Auth)
→ open test
→ answer questions
→ submit
→ score returned
→ attempt saved
```

---

# 9. CLEAN ARCHITECTURE

```txt id="final"
USER (Google only)
   ↓
TEST (public access)
   ↓
ATTEMPT (only logged-in users)
```



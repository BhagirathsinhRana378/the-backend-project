# 🧠 Backend Error-Solving Playbook


---

## 1️⃣ Golden Rule (READ FIRST)

> **Errors are messages, not enemies.**
> The terminal is telling me *what went wrong*, *where*, and *why*.

❌ Do NOT panic
❌ Do NOT randomly change code
✅ Slow down and read

---

## 2️⃣ The ONLY Order to Read Errors (VERY IMPORTANT)

Whenever an error appears, read it in this exact order:

### ✅ Step 1: Error TYPE

Example:

```
ReferenceError
```

👉 Tells me **what kind of mistake** I made.

---

### ✅ Step 2: Error MESSAGE

Example:

```
app is not defined
```

👉 Tells me **WHAT exactly is broken**.

---

### ✅ Step 3: File & Line Number

Example:

```
src/index.js:10:5
```

👉 Tells me **WHERE to look**.

⚠️ Always jump to this line FIRST.

---

### ❌ Ignore these at first

* nodemon spam
* MongoDB success logs
* dotenv tips
* long stack traces

---

## 3️⃣ Core JavaScript / Node Error Types (MEMORIZE)

### 🔴 ReferenceError

**Human Meaning:**

> I am using something that does not exist.

**Common Causes:**

* Variable not declared
* Forgot to import
* Used before definition

**Example:**

```js
console.log(app);
```

**Fix Checklist:**
✔ Is it declared?
✔ Is it imported?
✔ Is it declared BEFORE use?

---

### 🔴 TypeError

**Human Meaning:**

> This exists, but I’m using it the wrong way.

**Common Causes:**

* Calling something that isn’t a function
* Accessing properties on `undefined` or `null`

**Example:**

```js
user.map(); // user is not an array
```

**Fix Checklist:**
✔ Check data type
✔ console.log before using
✔ Validate inputs

---

### 🔴 SyntaxError

**Human Meaning:**

> JavaScript grammar is broken.

**Common Causes:**

* Missing `}` `)` `]`
* Extra comma
* Wrong import/export syntax

**Example:**

```js
if (true { console.log("hi") }
```

**Fix Checklist:**
✔ Match brackets
✔ Check previous line
✔ Restart server

---

### 🔴 Module Not Found

**Human Meaning:**

> Node cannot find the file/package I asked for.

**Common Causes:**

* Wrong path
* Missing file extension
* Package not installed

**Example:**

```js
import user from "./user";
```

**Fix Checklist:**
✔ File exists
✔ Correct relative path
✔ Add `.js` extension (ESM)

---

## 4️⃣ Very Common Backend Errors (Node + Express)

### 🟠 `app is not defined`

**Meaning:** Express app not created or imported

**Fix:**

```js
const app = express();
```

---

### 🟠 `process.env.X is undefined`

**Meaning:** Environment variable not loaded

**Fix Checklist:**
✔ `.env` file exists
✔ `dotenv.config()` is called
✔ Server restarted

---

### 🟠 MongoDB connects but server crashes

**Meaning:** DB connected, Express failed

**Likely Causes:**

* `app.listen()` error
* `app` missing
* async error not handled

---

## 5️⃣ The 5-Question Debugging Loop (USE EVERY TIME)

Ask these **in order**:

1️⃣ What is the ERROR TYPE?
2️⃣ What variable/function is mentioned?
3️⃣ Where is it used (file + line)?
4️⃣ Where is it defined or imported?
5️⃣ Am I using it BEFORE it exists?

---

## 6️⃣ My Personal Error Log Template

Whenever I hit an error, write it like this:

```
Error:
ReferenceError: app is not defined

Where:
src/index.js:10

Cause:
Used app before creating it

Fix:
const app = express();

Lesson:
Always initialize before use
```

---

## 7️⃣ Daily Training Rule (IMPORTANT)

✔ Break code on purpose
✔ Predict the error
✔ Read it calmly
✔ Fix it once
✔ Write the lesson here

---

## 8️⃣ Final Reminder (READ WHEN FRUSTRATED)

> I am not bad at debugging.
> I am TRAINING my pattern recognition.

Every error I solve makes the next one easier.

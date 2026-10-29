# evpp109coyotesgohunting
# EVPP Predator-Prey Simulation Lab

Interactive predator-prey simulation for EVPP courses.

Students observe the first four predetermined generations and then complete
their own simulation from Generations 5–20.

The simulation automatically:

- Tracks mouse and coyote populations
- Generates unique results for each student
- Records completion in Firebase Firestore
- Generates a unique Run ID
- Exports data as CSV
- Creates a completion certificate
- Displays a live population graph

Students submit:

1. Generation 10 screenshot
2. Completion certificate
3. Completed workbook with graph and reflection questions

---

# Setup Instructions

## Step 1: Create a Firebase Project

Go to Firebase Console

Create a project named:

EVPP Predator Prey Lab

No analytics required.

---

## Step 2: Enable Firestore

Build → Firestore Database

Create database.

Select:

Production Mode

---

## Step 3: Register a Web App

Project Settings → Add App → Web

Firebase will generate:

firebaseConfig

Copy the contents into:

firebase-config.js

---

## Step 4: Publish Firestore Rules

Open:

Firestore → Rules

Replace contents with:

firestore.rules

Click Publish.

---

## Step 5: Upload Files to GitHub

Create repository:

predator-prey-lab

Upload:

index.html
style.css
app.js
firebase-config.js
firestore.rules
README.md

---

## Step 6: Enable GitHub Pages

Repository Settings → Pages

Deploy from:

Main Branch

Root

Save.

GitHub will generate a URL.

---

## Canvas Instructions

Students must:

1. Enter Name and GMU Email.
2. Complete simulation through Generation 20.
3. Take screenshot at Generation 10.
4. Download CSV data.
5. Download completion certificate.
6. Submit required files through Canvas.

---

## Firestore Collection

labSubmissions

Each completed simulation stores:

- Student Name
- Student Email
- Run ID
- Completion Timestamp
- Generation Data
- Final Mouse Population
- Final Coyote Population

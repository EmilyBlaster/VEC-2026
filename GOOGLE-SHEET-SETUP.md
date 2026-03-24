# Google Sheet Setup Instructions

## Step 1: Create the Sheet
1. Go to https://sheets.google.com
2. Create a new blank spreadsheet
3. Name it "VEC Review Comments"
4. In Row 1, add these column headers (one per cell, A through K):

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| timestamp | id | author | text | pageX | pageY | sectionId | xPercent | yOffsetInSection | viewportWidth | resolved |

## Step 2: Add the Apps Script
1. In the sheet, click **Extensions > Apps Script**
2. Delete any existing code in Code.gs
3. Paste the entire contents of the file `apps-script-code.js` from this project folder
4. Save (Ctrl+S)

## Step 3: Deploy
1. Click **Deploy > New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set:
   - Description: "VEC Review API"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** and follow the prompts (allow access to your sheet)
6. Copy the **Web app URL** -- it looks like: `https://script.google.com/macros/s/LONG_ID/exec`

## Step 4: Give the URL to Claude
Paste the URL back in the chat so I can add it to the review-overlay.js file.

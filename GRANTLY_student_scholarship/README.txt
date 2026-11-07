GRANTLY – Student Profile Update
================================

WHAT CHANGED
- Removed the pre-filled Ananya Sharma student profile.
- Removed sample uploaded documents, sample applications and sample shortlist entries.
- Added a full-name field to onboarding.
- Added education-level-specific class/year choices:
  * Higher Secondary: Class 11 or Class 12
  * Undergraduate: 1st to 4th / Final Year
  * Postgraduate: 1st or 2nd Year
- Added required-field checks for the main onboarding steps.
- Added an Edit student profile link in the sidebar.
- Changed browser storage key to grantly.v4 so old grantly.v3 demo data does not load.

HOW TO RUN
1. Extract this ZIP file.
2. Open the extracted folder.
3. Double-click index.html to open it in a browser.
4. Click Find my scholarships / Get started and complete the onboarding steps.
5. Your profile is saved in that browser using localStorage.
6. To edit details later, use Edit student profile in the left sidebar.

IMPORTANT LIMITATIONS
- This is still a frontend-only prototype. It does not have real accounts, login, a backend or a database.
- Profile information is saved only in the browser/device where it was entered.
- Document uploads are prototype browser storage, not secure cloud storage. Do not upload real Aadhaar, bank, income or other sensitive documents.
- Scholarship records and matching rules are demo data and should be verified against official scholarship provider websites before real use.
- Application statuses are not connected to government or provider portals.

RESET DEMO DATA
If you want to start again, open the website, press F12, go to Console and run:
localStorage.removeItem('grantly.v4'); location.reload();

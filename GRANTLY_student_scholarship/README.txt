GRANTLY — Student Scholarship Discovery & Guidance Prototype

WHAT'S INCLUDED
- index.html: the React-powered GRANTLY application.
- Smart Scholarship Match: compares a student's saved profile against the demo scholarship criteria and explains each check.
- What-If Scholarship Simulator: lets students test hypothetical income, CGPA, study stream and education-level scenarios without changing their saved profile.
- Document Readiness Scanner: supports document uploads, issue/expiry dates, missing/expired/expiring states and a readiness checklist.

RUN LOCALLY
1. Extract this folder.
2. Open index.html in a modern browser, or use VS Code Live Server.
3. Complete student onboarding first so matching has profile details.
4. Student profile and application data are stored in that browser's localStorage.

DEPLOY ON VERCEL
This version is a single-page React prototype that loads React and Babel from CDNs; it does not require npm build commands.
- Framework preset: Other
- Root directory: the folder containing index.html (GRANTLY_student_scholarship if the repository has this folder)
- Build command: empty
- Output directory: .
- Install command: empty

IMPORTANT LIMITATIONS
- Scholarship records and criteria are illustrative demo data. Confirm all current eligibility rules, amounts and deadlines with official providers before relying on them.
- Eligibility matching is a screening aid, not a probability or guarantee of receiving an award.
- The What-If simulator does not modify the student's real saved profile and must not be used to misrepresent application details.
- Uploaded documents are stored in browser storage where possible. This is not secure cloud storage; do not upload real Aadhaar, bank or other sensitive documents in this prototype.
- The document scanner checks completeness, file format and dates. It does not authenticate documents.
- Application status is student-managed; there is no live government portal integration.

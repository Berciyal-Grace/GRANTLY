# GRANTLY — React + Vite

This is the proper React project version of GRANTLY. It removes React/Babel CDN scripts that were previously compiled inside the browser. Vite now compiles the JSX before the site runs, avoiding the in-browser Babel setup.

## Run on Windows (VS Code)

1. Install Node.js LTS (20 or newer) from https://nodejs.org/ if it is not installed.
2. Extract this ZIP.
3. In VS Code, choose **File → Open Folder** and open the extracted `GRANTLY_student_profile_update` folder (the folder containing `package.json`).
4. Choose **Terminal → New Terminal**. Make sure the terminal path ends in `GRANTLY_student_profile_update`.
5. Run these commands one at a time:

   ```powershell
   npm install
   npm run dev
   ```

6. Open the local URL Vite prints, usually http://localhost:5173. Do not double-click `index.html` and do not use `py -m http.server` for this Vite project.
7. Keep the terminal open while using the site. Press `Ctrl+C` in the terminal to stop it.

## Production build

```powershell
npm run build
```

Vite creates the production website in `dist/`.

## Important prototype limitations

- The Sign in link is a demo shortcut to the dashboard; this project does not yet have real account/password authentication or a server-side user database.
- Student profile and application data are stored in the current browser using localStorage.
- Scholarship examples and deadlines are illustrative; confirm official scheme rules before applying.
- Do not upload real Aadhaar, bank, or other sensitive documents to this prototype.

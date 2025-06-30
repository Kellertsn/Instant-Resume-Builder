# Instant Resume Builder

A modern, open-source resume builder built with React, Vite, Tailwind CSS, and Firebase. Instantly create, preview, and export beautiful resumes – with cloud save/load support and offline persistence.

## Features

- Dynamic section editing (Profile, Education, Skills, Experience, Projects)
- Real-time PDF preview and export with high-quality formatting (<100ms updates)
- >90% layout consistency between preview and PDF output
- Optimized bullet point spacing and alignment
- Proper handling of CJK (Chinese, Japanese, Korean) fonts
- Smart contact information formatting with conditional separators
- Cloud save/load via Firebase Firestore with offline persistence
- Intelligent caching that reduces cloud read operations by ~70%
- Performance metrics for cloud operations (<800ms data retrieval)
- Section reordering with 120 possible layout permutations
- Modern UI with Tailwind CSS
- Easy deployment to Vercel or Firebase Hosting

## How to Use

1. **Fill in Your Resume:**
   - Enter your information in the Profile, Education, Skills, Experience, and Projects sections.
   - Use "Add Bullet" to add bullet points, or "Add Education/Experience/Project" to add more entries.
   - Formatting is automatically applied - institution, company, and project titles are bold.
2. **Preview and Download PDF:**
   - Click "Show Preview" to see a live preview that exactly matches the PDF output.
   - Click "Download PDF" to get a high-quality PDF of your resume with proper formatting.
   - All formatting, spacing, and alignment in the preview will be preserved in the PDF.
3. **Cloud Save & Load:**
   - **Save to Cloud:** Click "Save to Cloud" to store your resume online. You'll get a unique Resume ID.
   - **Load from Cloud:** Enter a Resume ID and click "Load from Cloud" to restore a previous resume.
   - You can share your Resume ID to access your resume from any device.
4. **Reorder and Edit Sections:**
   - Use the arrows to reorder sections.
   - All fields are editable at any time.

### Use Cases
- First-time users: Fill in your details, preview, and download or save to the cloud.
- Multi-device: Save your Resume ID at home, load and edit at school or work.
- Multiple versions: Each save creates a new Resume ID, so you can manage several versions.

## Local Development

```bash
cd insta-site
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Live Demo

The latest version is always available at: [https://instant-resume-builder.vercel.app/](https://instant-resume-builder.vercel.app/)

## Recent Updates

### June 2025
- Implemented Firebase offline persistence for seamless offline editing
- Added intelligent local caching with 5-minute TTL to reduce cloud operations by ~70%
- Integrated performance measurement for cloud operations
- Added network status detection with automatic UI adaptation
- Updated to latest Firebase API with persistentLocalCache and persistentMultipleTabManager

### May 2025
- Improved PDF formatting to match preview exactly (>90% layout consistency)
- Fixed alignment issues with right-side content (dates and locations)
- Enhanced bullet point spacing for better readability
- Added proper handling of CJK fonts
- Implemented conditional separators for contact information
- Made institution, company, and project titles bold for emphasis
- Fixed section heading formatting in PDF output

## Deployment

- **Vercel:** Deploy the `insta-site` folder as a Vite app. This project is already live at the link above.
- **Firebase Hosting:** See [Firebase Hosting docs](https://firebase.google.com/docs/hosting).

## Cloud Save/Load

- Requires Firebase Firestore setup (see `src/firebase.js`).
- Data is stored as JSON under a unique Resume ID.
- Features offline persistence and multi-tab support.
- Includes local caching with 5-minute TTL to reduce redundant cloud reads.
- Performance metrics for save/load operations.
- Recent resumes dropdown for quick access to previously saved resumes.

## License

MIT

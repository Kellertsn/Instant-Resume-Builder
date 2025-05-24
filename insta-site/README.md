# Instant Resume Builder
A web application to quickly assemble and style resumes from manual input, featuring live preview and one-click PDF export.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [License](#license)

## Features
- Dynamic section ordering via arrow buttons
- Real-time resume preview
- A4-compliant PDF generation using jsPDF & html2canvas
- Editable sections: Profile, Education, Skills, Experience, Projects

## Technologies
- JavaScript
- React 19
- Vite
- Tailwind CSS
- jsPDF
- html2canvas

## Installation
```bash
# Clone repository
git clone https://github.com/Kellertsn/Instant-Resume-Builder.git
# Navigate to client
cd Instant-Resume-Builder/insta-site
# Install dependencies
npm install
# Start development server
npm run dev
```

## Usage
1. Fill out the form sections on the left.
2. Click **Show Preview** to toggle live preview.
3. Click **Download PDF** to export your resume.

## Deployment
This project can be deployed quickly on Vercel. If you don’t have an account yet, sign up for a free account at https://vercel.com.

### Vercel Web Deployment
1. Push your code to a GitHub repository.
2. In the Vercel dashboard, click **Import Project**, select your GitHub repo, and follow the prompts.
3. When prompted for framework, select **Other** (or **Vite**). Ensure `vercel.json` is at the project root.
4. Click **Deploy**.

### Vercel CLI Deployment
```bash
npm install -g vercel
vercel login           # log in or create account
vercel                # follow interactive prompts to deploy
```

## License
MIT

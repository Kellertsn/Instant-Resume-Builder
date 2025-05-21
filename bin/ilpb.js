#!/usr/bin/env node
const { Command } = require('commander');
const inquirer = require('inquirer');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

async function main() {
  const answers = await inquirer.prompt([
    { name: 'name', message: 'Project name:', default: 'my-landing-page' },
    { type: 'checkbox', name: 'sections', message: 'Select sections to include:', choices: ['Hero', 'Features', 'Testimonials', 'ContactForm'] }
  ]);
  const projectDir = path.resolve(process.cwd(), answers.name);
  console.log(`\nScaffolding project in ${projectDir}...`);
  await execa('npm', ['create', 'vite@latest', answers.name, '--', '--template', 'react'], { stdio: 'inherit' });
  await execa('npm', ['install'], { cwd: projectDir, stdio: 'inherit' });
  await execa('npm', ['install', '-D', 'tailwindcss', 'postcss', 'autoprefixer'], { cwd: projectDir, stdio: 'inherit' });
  await execa('npx', ['tailwindcss', 'init', '-p'], { cwd: projectDir, stdio: 'inherit' });
  await fs.writeFile(path.join(projectDir, 'tailwind.config.cjs'), `module.exports = { content: ['./index.html', './src/**/*.{js,jsx}'], theme: { extend: {} }, plugins: [], }`);
  await fs.writeFile(path.join(projectDir, 'postcss.config.cjs'), `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, }, }`);
  await fs.writeFile(path.join(projectDir, 'src', 'index.css'), `@tailwind base;\n@tailwind components;\n@tailwind utilities;`);
  const compDir = path.join(projectDir, 'src', 'components');
  await fs.ensureDir(compDir);
  if (answers.sections.includes('Hero')) {
    await fs.writeFile(path.join(compDir, 'Hero.jsx'), `export default function Hero() { return (<section className=\"bg-blue-600 text-white py-20 text-center\"><h1 className=\"text-4xl font-bold\">Welcome to my site</h1><p className=\"mt-4\">This is a hero section.</p></section>); }`);
  }
  if (answers.sections.includes('Features')) {
    await fs.writeFile(path.join(compDir, 'Features.jsx'), `export default function Features() { return (<section className=\"py-20 text-center\"><h2 className=\"text-3xl font-bold\">Features</h2><div className=\"mt-8 grid grid-cols-1 md:grid-cols-3 gap-6\">{['Fast','Responsive','Customizable'].map(f=><div key={f} className=\"p-6 border rounded\"><h3 className=\"text-xl font-semibold\">{f}</h3></div>)}</div></section>); }`);
  }
  if (answers.sections.includes('Testimonials')) {
    await fs.writeFile(path.join(compDir, 'Testimonials.jsx'), `export default function Testimonials() { return (<section className=\"bg-gray-100 py-20 text-center\"><h2 className=\"text-3xl font-bold\">Testimonials</h2><div className=\"mt-8 space-y-6\">{['Great product','Loved it','Five stars'].map((t,i)=><blockquote key={i} className=\"italic\">{t}</blockquote>)}</div></section>); }`);
  }
  if (answers.sections.includes('ContactForm')) {
    await fs.writeFile(path.join(compDir, 'ContactForm.jsx'), `export default function ContactForm() { return (<section className=\"py-20 text-center\"><h2 className=\"text-3xl font-bold\">Contact Us</h2><form className=\"mt-8 max-w-md mx-auto space-y-4\"><input type=\"text\" placeholder=\"Name\" className=\"w-full p-2 border rounded\" /><input type=\"email\" placeholder=\"Email\" className=\"w-full p-2 border rounded\" /><textarea placeholder=\"Message\" className=\"w-full p-2 border rounded\"></textarea><button type=\"submit\" className=\"px-6 py-2 bg-blue-600 text-white rounded\">Send</button></form></section>); }`);
  }
  const appPath = path.join(projectDir, 'src', 'App.jsx');
  let appCode = await fs.readFile(appPath, 'utf8');
  const imports = answers.sections.map(s => `import ${s} from './components/${s}.jsx';`).join('\n');
  const renderOrder = answers.sections.map(s => `<${s} />`).join('\n      ');
  appCode = `import './index.css';\n${imports}\n\nfunction App() {\n  return (<div>\n      ${renderOrder}\n  </div>);\n}\n\nexport default App;`;
  await fs.writeFile(appPath, appCode);
  console.log('\nDone!');
  console.log(`\nNext steps:\n  cd ${answers.name}\n  npm run dev`);
}

main().catch(err => { console.error(err); process.exit(1); });

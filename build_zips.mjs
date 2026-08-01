import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const templates = [
  { id: 'tpl-01', sourceFile: 'src/app/rfx-links/demo/artistik/page.jsx' },
  { id: 'tpl-02', sourceFile: 'src/app/rfx-links/demo/glassmorphism/page.jsx' },
  { id: 'tpl-03', sourceFile: 'src/app/rfx-links/demo/developer/page.jsx' }
];

const privateDir = path.resolve('private/templates');
if (!fs.existsSync(privateDir)) {
  fs.mkdirSync(privateDir, { recursive: true });
}

const packageJsonContent = `{
  "name": "rfx-template",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}`;

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`;

const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;

const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

const layoutJsx = `import './globals.css'
export const metadata = {
  title: 'RFX Visual Template',
  description: 'Premium Website Template',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`;

for (const tpl of templates) {
  const tempFolder = path.resolve(`private/temp_${tpl.id}`);
  const appFolder = path.join(tempFolder, 'src/app');
  
  if (fs.existsSync(tempFolder)) {
    fs.rmSync(tempFolder, { recursive: true, force: true });
  }
  fs.mkdirSync(appFolder, { recursive: true });

  fs.writeFileSync(path.join(tempFolder, 'package.json'), packageJsonContent);
  fs.writeFileSync(path.join(tempFolder, 'tailwind.config.js'), tailwindConfig);
  fs.writeFileSync(path.join(tempFolder, 'postcss.config.js'), postcssConfig);
  fs.writeFileSync(path.join(appFolder, 'globals.css'), globalsCss);
  fs.writeFileSync(path.join(appFolder, 'layout.jsx'), layoutJsx);

  const sourceContent = fs.readFileSync(path.resolve(tpl.sourceFile), 'utf-8');
  fs.writeFileSync(path.join(appFolder, 'page.jsx'), sourceContent);
  
  // Create zip using powershell
  const zipPath = path.join(privateDir, `${tpl.id}.zip`);
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }
  
  console.log(`Zipping ${tpl.id}...`);
  try {
    execSync(`powershell.exe -Command "Compress-Archive -Path '${tempFolder}\\*' -DestinationPath '${zipPath}' -Force"`);
    console.log(`Created ${zipPath}`);
  } catch (e) {
    console.error(`Failed to zip ${tpl.id}`, e.message);
  }
  
  // Cleanup
  fs.rmSync(tempFolder, { recursive: true, force: true });
}

console.log("All templates built and zipped.");

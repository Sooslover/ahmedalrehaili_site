# Ahmed Alrehaili - Academic Portfolio

Professional academic portfolio website for Dr. Ahmed Alrehaili, showcasing research in Blockchain, IoT, Cloud Computing, and Technology Acceptance Models.

## 🌐 Live Website

**GitHub Pages**: [https://sooslover.github.io/ahmedalrehaili_site/](https://sooslover.github.io/ahmedalrehaili_site/)

**Custom Domain** (if configured): [https://ahmedalrehaili.com](https://ahmedalrehaili.com)

## ✨ Features

- **Responsive Design**: Professional academic presentation optimized for all devices
- **Automatic Scholar Metrics**: Daily updates from Google Scholar via GitHub Actions
- **Publications Management**: Full publication list with search functionality
- **Contact Form**: Integrated with Formspree for email submissions
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Academic Profiles**: Links to Google Scholar, ResearchGate, ORCID, and institutional profiles

## 🚀 Deployment

### GitHub Pages (Automatic)
The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

### Vercel (Alternative)
The site is also configured for Vercel deployment with `vercel.json`.

## 📊 Automatic Scholar Metrics

Google Scholar metrics are automatically fetched daily at 2 AM UTC via GitHub Actions.

**Manual trigger**: Go to Actions → "Update Google Scholar Metrics" → Run workflow

## 📁 Project Structure

```
ahmedalrehaili_site/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css      # All styles
│   ├── js/
│   │   └── main.js        # Interactive functionality
│   └── img/               # Images and icons
├── data/
│   ├── metrics.json       # Scholar metrics
│   └── publications.json  # Publications list
└── .github/
    └── workflows/
        ├── deploy-pages.yml           # GitHub Pages deployment
        └── update-scholar-metrics.yml # Auto-update metrics
```

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3 (Custom), Vanilla JavaScript
- **Forms**: Formspree
- **Deployment**: GitHub Pages / Vercel
- **Automation**: GitHub Actions
- **Theme**: Custom academic design with dark/light mode

## 📝 Updating Content

### Publications
Edit `data/publications.json` with new publications following the existing format.

### Metrics
Metrics update automatically via GitHub Actions, or edit `data/metrics.json` manually.

### Personal Information
Edit `index.html` to update bio, education, research areas, and contact information.

## 📄 License

© 2026 Ahmed Alrehaili. All rights reserved.

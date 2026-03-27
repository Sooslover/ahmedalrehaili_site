# How to Update Google Scholar Data

Your website displays publications and metrics from Google Scholar. Since automatic scraping is blocked by Google, here are **easy ways to keep your data current**:

---

## 🎯 Option 1: Manual Update (Easiest - 5 minutes)

### Update Metrics (data/metrics.json)

1. Visit your [Google Scholar profile](https://scholar.google.com/citations?user=tMmhq2MAAAAJ)
2. Note your current statistics:
   - Citations (total)
   - h-index
   - i10-index

3. Edit `data/metrics.json`:
```json
{
  "citations": 188,
  "h_index": 7,
  "i10_index": 6
}
```

### Update Publications (data/publications.json)

1. Visit your [Google Scholar profile](https://scholar.google.com/citations?user=tMmhq2MAAAAJ)
2. For each publication, gather:
   - Title
   - Authors
   - Venue/Conference
   - Year
   - Citation count
   - Link (right-click title → Copy link address)

3. Edit `data/publications.json` following this format:
```json
[
  {
    "title": "Your Paper Title",
    "authors": "Ahmed Alrehaili, Co-author Name",
    "venue": "Conference/Journal Name",
    "year": "2024",
    "citations": 15,
    "link": "https://scholar.google.com/citations?view_op=view_citation&..."
  },
  {
    "title": "Another Paper",
    "authors": "Ahmed Alrehaili",
    "venue": "IEEE Conference",
    "year": "2023",
    "citations": 8,
    "link": "https://scholar.google.com/citations?view_op=view_citation&..."
  }
]
```

4. Commit and push:
```bash
git add data/*.json
git commit -m "Update Google Scholar data"
git push
```

---

## 🔄 Option 2: Semi-Automatic with Browser Extension

Use the **Google Scholar Button** Chrome/Firefox extension:

1. Install [Google Scholar Button](https://chrome.google.com/webstore/detail/google-scholar-button/)
2. Visit your profile
3. Use the extension to export data
4. Update the JSON files

---

## 📊 Option 3: Use scholarlyapi.com (Paid Service)

For truly automatic updates:

1. Sign up at [scholarlyapi.com](https://scholarlyapi.com/)
2. Get an API key
3. Create a GitHub Action to fetch data monthly
4. Cost: ~$10/month for personal use

---

## ⏰ How Often Should You Update?

- **Metrics**: Every 1-3 months
- **Publications**: When you publish something new

---

## 🤖 Option 4: GitHub Actions Workflow (Advanced)

Create `.github/workflows/update-scholar.yml`:

```yaml
name: Update Scholar Data

on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly on the 1st
  workflow_dispatch:  # Allow manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Update data manually
        run: |
          # Visit Scholar and update JSON files
          echo "Please update data/metrics.json and data/publications.json"

      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add data/*.json
          git commit -m "Update Scholar data" || echo "No changes"
          git push
```

---

## 📝 Current Data Files

Your data is stored in:
- `data/metrics.json` - Citations, h-index, i10-index
- `data/publications.json` - All publications with details

## 🔗 Your Google Scholar Profile

[https://scholar.google.com/citations?user=tMmhq2MAAAAJ](https://scholar.google.com/citations?user=tMmhq2MAAAAJ)

---

## ✅ Quick Update Checklist

- [ ] Visit Google Scholar profile
- [ ] Copy latest citation metrics
- [ ] Update `data/metrics.json`
- [ ] Check for new publications
- [ ] Update `data/publications.json`
- [ ] Commit and push changes
- [ ] Verify on website

---

## 💡 Tips

1. **Set a Calendar Reminder**: Update every 3 months
2. **After Publishing**: Update immediately when you publish a new paper
3. **Before Important Events**: Update before conferences, interviews, or reviews
4. **Keep Backups**: Git tracks all changes, so you can always revert

---

## ❓ Need Help?

If you have issues:
1. Check the JSON syntax with [JSONLint](https://jsonlint.com/)
2. Make sure all commas and brackets are correct
3. Ensure links don't contain special characters
4. Test locally before pushing

The website will automatically display your updated data!

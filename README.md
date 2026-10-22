# UPSC Current Affairs prototype

A static site with three views: a daily digest, a quiz, and a progress page. Progress is stored in the browser's localStorage, so no server or account is needed.

## Files

- `index.html`, `styles.css`, `app.js`: the site
- `data/digest-sample.json`: the day's items and questions (currently sample content)
- `data/syllabus.json`: the editable syllabus taxonomy used for tagging
- `prompts/summarize-and-tag.md`: prompt for summarizing and tagging fetched items
- `prompts/generate-questions.md`: prompt for writing questions from approved items

## Run it locally

The page loads JSON with `fetch`, which browsers block on `file://`, so serve the folder:

```
cd upsc-current-affairs
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Daily workflow (intended)

1. A scheduled job fetches items from trusted sources (PIB, PRS, Supreme Court, ministry sites, Gazette, and reputable outlets).
2. Claude runs `prompts/summarize-and-tag.md` on each fetched item. Items with `needs_review: true` go to the editor first.
3. An editor approves, edits, or rejects each item.
4. Claude runs `prompts/generate-questions.md` on approved items.
5. The approved output is written to `data/digest-YYYY-MM-DD.json`, and `app.js` points at that file.

## Before going live

- Replace the sample data. The current `digest-sample.json` contains evergreen facts for testing, not news.
- Check every source link and every fact against the original text.
- Verify the syllabus taxonomy against the latest official UPSC notification.
- Keep Claude API calls on a server or scheduled job, never in browser code, so the API key stays private.
- Decide on hosting (GitHub Pages, Netlify, or Vercel) and whether the site is private or public. Public use needs a clear copyright policy: summaries in your own words, with links to originals.

## Extending it

- Add a `data/digest-YYYY-MM-DD.json` file per day and a date picker.
- Add a spaced-repetition rule so wrong answers resurface after 1, 3, and 7 days.
- Add a Mains answer evaluation step that checks a typed answer against the key points.

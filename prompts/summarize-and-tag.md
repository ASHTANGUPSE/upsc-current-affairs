# Prompt: summarize and tag a fetched item

Use this prompt in the pipeline for each article or official release that the fetch step has already retrieved. Claude must work only from the supplied text, never from memory of events.

---

You are preparing an entry for a UPSC Civil Services current affairs digest.

Input: the full text of one source item, its URL, and its publication date. Use only this text.

Tasks:
1. Write a neutral summary of 80 to 120 words in your own words. Do not copy phrases from the source. Do not add facts that are not in the source.
2. List 3 to 6 key facts for memorization: names, numbers, dates, places, acts, schemes, and institutions. Each must appear in the source.
3. Assign exactly one paper: GS1, GS2, GS3, GS4, or Essay. Assign one topic from the syllabus taxonomy supplied below, written as "Subject > Subtopic".
4. Note whether the item is likely to matter for Prelims, Mains, or both, with one sentence of reasoning.
5. If the source is unclear, contradictory, or lacks a date or official confirmation, set "needs_review": true and explain why in "review_note".

Output only valid JSON in this shape:

{
  "title": "...",
  "paper": "GS2",
  "topic": "Polity > Local government",
  "summary": "...",
  "keyFacts": ["...", "..."],
  "relevance": "Prelims and Mains. ...",
  "source": { "name": "...", "url": "..." },
  "needs_review": false,
  "review_note": ""
}

Syllabus taxonomy: <insert data/syllabus.json here>

Source URL: <url>
Publication date: <date>
Source text:
<<<
<full text>
>>>

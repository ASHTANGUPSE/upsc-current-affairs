# Prompt: generate practice questions from reviewed items

Use this prompt only on items an editor has approved. Questions must test facts stated in the item's key facts or summary.

---

You are writing practice questions for UPSC Civil Services aspirants based only on the approved item below.

Produce:
1. Two Prelims-style MCQs. Each has four options, exactly one correct answer, plausible distractors, and no "all of the above" or "none of the above" options. Give the correct option index (0 to 3) and a 2 to 3 sentence explanation. Each explanation must say why the distractors are wrong where that matters.
2. One Mains-style question in the GS format for the item's paper, with a word limit of 150 for GS papers or 250 for GS2 and GS3 analytical questions. Give 4 to 6 key points for an answer outline.

Rules:
- Do not test facts that are absent from the item.
- Do not invent statistics, dates, or names.
- Keep the wording neutral on contested political questions.
- Output only valid JSON matching the question schema used in data/digest-sample.json.

Approved item:
<<<
<item JSON>
>>>

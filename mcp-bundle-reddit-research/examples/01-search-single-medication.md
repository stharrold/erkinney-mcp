# Example 1: Search for a Single Medication

This example demonstrates how to search for discussions about a specific medication (ondansetron) in pregnancy subreddits.

---

## Goal

Find Reddit threads discussing ondansetron (an anti-nausea medication) in the r/pregnant subreddit from 2021-2023.

---

## Prerequisites

- ✅ MCP server installed and configured in Claude Desktop
- ✅ Reddit API credentials set up
- ✅ Claude Desktop restarted

---

## Steps

### 1. Open Claude Desktop

Start a new conversation.

### 2. Request the Search

Type this natural language query:

> Search for discussions about ondansetron in the pregnant subreddit from 2021 to 2023. I want threads with at least 5 comments and 50 words.

### 3. Claude Will Use the Tool

Claude will automatically call `search_reddit_threads` with these parameters:

```json
{
  "medication_name": "ondansetron",
  "subreddits": ["pregnant"],
  "start_date": "2021-01-01",
  "end_date": "2023-12-31",
  "min_comments": 5,
  "min_words": 50,
  "max_results": 100
}
```

### 4. Review Results

Claude will return search results showing:
- Thread titles
- Anonymized author hashes (e.g., `a7b3c9d2`)
- Creation dates
- Score (upvotes)
- Number of comments
- URLs to original threads

Example output:

```json
{
  "success": true,
  "medication": "ondansetron",
  "count": 45,
  "threads": [
    {
      "thread_id": "abc123",
      "title": "Taking Zofran (ondansetron) - your experiences?",
      "subreddit": "pregnant",
      "author": "a7b3c9d2",
      "created_date": "2023-05-15T14:30:00Z",
      "score": 25,
      "num_comments": 18,
      "word_count": 156,
      "url": "https://reddit.com/r/pregnant/comments/abc123/..."
    },
    ...
  ]
}
```

---

## Refining Your Search

### Search Different Date Range

> Search for ondansetron in pregnant subreddit from January 2020 to June 2020

### Search Multiple Subreddits

> Search for ondansetron in both pregnant and BabyBumps subreddits

### Adjust Quality Filters

> Search for ondansetron but only show threads with at least 10 comments and 100 words

### Get More Results

> Search for ondansetron and return up to 200 threads

---

## Common Variations

### Brand Name vs Generic Name

Search for both generic and brand names:

> Search for both "ondansetron" and "zofran" in the pregnant subreddit

### Related Terms

Include related search terms:

> Search for discussions about nausea medication, including ondansetron, zofran, morning sickness medication

---

## Expected Results

**Typical search returns**:
- 20-100 threads depending on popularity
- Threads span the date range specified
- All authors anonymized (8-character hashes)
- Threads meet minimum comment and word filters

**If no results found**:
- Try expanding date range
- Lower min_comments or min_words
- Try different medication names (generic vs brand)
- Check subreddit name spelling

---

## Next Steps

Once you have search results:

1. **Review thread titles** to identify relevant discussions
2. **Get full thread content** using thread IDs (see Example 2)
3. **Export results** for analysis (see Example 4)

---

## Tips for Researchers

### Systematic Searching

For systematic reviews, document:
- Search terms used
- Date ranges
- Inclusion/exclusion criteria
- Number of results found

### Brand Names Matter

Many users use brand names instead of generic names:
- Ondansetron → Zofran
- Sertraline → Zoloft
- Levothyroxine → Synthroid

Search for both to ensure comprehensive coverage.

### Subreddit Selection

Common pregnancy subreddits:
- `pregnant` - General pregnancy discussions
- `BabyBumps` - Pregnancy journey
- `beyondthebump` - Postpartum
- `tryingforababy` - Conception
- `PregnancyAfterLoss` - Pregnancy after loss

Choose based on your research focus.

---

## Troubleshooting

### "No threads found"

**Solution**: Expand criteria
- Increase date range
- Lower min_comments (try 3 instead of 5)
- Lower min_words (try 30 instead of 50)
- Check medication name spelling

### "Rate limit reached"

**Solution**: Wait and retry
- Tool automatically handles rate limiting
- Wait 1-2 minutes before retrying
- For large searches, expect automatic pauses

### "Cannot connect to Reddit"

**Solution**: Check connection
- Verify internet connection
- Check if reddit.com is accessible
- Tool will retry automatically with backoff

---

## Related Examples

- **[Example 2](02-batch-collection.md)** - Search multiple medications at once
- **[Example 3](03-get-thread-details.md)** - Get full thread content
- **[Example 4](04-export-to-csv.md)** - Export search results

---

**Last Updated**: 2025-11-20

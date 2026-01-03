# Example 2: Complete Research Workflow

This example demonstrates a complete end-to-end workflow from search to export for a systematic research project.

---

## Research Goal

Collect and analyze Reddit discussions about anti-nausea medications (ondansetron, metoclopramide, promethazine) used during pregnancy from 2020-2023.

---

## Complete Workflow

### Phase 1: Planning

**1. Define research questions**:
- What are patient experiences with anti-nausea medications?
- What side effects do patients report?
- How do patients make decisions about medication use?

**2. Select medications**:
- Ondansetron (Zofran)
- Metoclopramide (Reglan)
- Promethazine (Phenergan)

**3. Select target subreddits**:
- r/pregnant
- r/BabyBumps
- r/HyperemesisGravidarum

**4. Define inclusion criteria**:
- Date range: 2020-01-01 to 2023-12-31
- Minimum 5 comments
- Minimum 50 words
- Target: 50 threads per medication

---

### Phase 2: Batch Search

**In Claude Desktop, ask**:

> Search for discussions about ondansetron, metoclopramide, and promethazine in the pregnant, BabyBumps, and HyperemesisGravidarum subreddits from 2020 to 2023. Get 50 threads per medication.

**Claude will use** `batch_search_medications`:

```json
{
  "medications": ["ondansetron", "metoclopramide", "promethazine"],
  "subreddits": ["pregnant", "BabyBumps", "HyperemesisGravidarum"],
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "threads_per_medication": 50
}
```

**Expected output**:

```json
{
  "success": true,
  "total_medications": 3,
  "completed": 3,
  "failed": 0,
  "total_threads": 142,
  "medications": {
    "ondansetron": {
      "success": true,
      "count": 50,
      "threads": [...]
    },
    "metoclopramide": {
      "success": true,
      "count": 45,
      "threads": [...]
    },
    "promethazine": {
      "success": true,
      "count": 47,
      "threads": [...]
    }
  }
}
```

**Note**: The tool automatically:
- Pauses between medications to respect rate limits
- Anonymizes all usernames
- Filters by date range and quality criteria

---

### Phase 3: Review and Filter

**Ask Claude to summarize**:

> Summarize the search results. How many threads did we find for each medication? What date range do they cover?

**Review the results** to ensure:
- ✅ Adequate sample size (aim for 50+ per medication)
- ✅ Date range coverage is complete
- ✅ Threads match research focus

**If needed, refine search**:

> Search for additional threads about metoclopramide from 2019, as we only got 45 threads

---

### Phase 4: Collect Full Thread Content

**For each medication, get full thread details**:

> For the ondansetron threads, get the full content including comments for threads abc123, def456, ghi789... (provide top 20 thread IDs)

**Claude will use** `get_thread_details` for each thread:

```json
{
  "thread_id": "abc123",
  "include_comments": true,
  "max_comments": 50,
  "sort_by": "top"
}
```

**Tip**: Process in batches of 20-30 threads to avoid overwhelming the conversation.

---

### Phase 5: Export Data

**Export all threads to CSV for analysis**:

> Export all the threads we collected to CSV format with metadata. Include thread IDs: [list all thread IDs]

**Claude will use** `export_research_data`:

```json
{
  "thread_ids": ["abc123", "def456", "ghi789", ...],
  "format": "csv",
  "anonymize": true,
  "include_metadata": true,
  "include_comments": false
}
```

**For JSON export with comments**:

> Export the same threads to JSON format including comments

```json
{
  "thread_ids": ["abc123", "def456", ...],
  "format": "json",
  "anonymize": true,
  "include_metadata": true,
  "include_comments": true
}
```

**Files are saved** to `exports/` directory:
- `reddit_export_20251120_143000.csv`
- `reddit_export_20251120_143015.json`

---

### Phase 6: Data Analysis

**Import data into analysis tools**:

#### For Qualitative Analysis (NVivo, Atlas.ti)

1. Import JSON file
2. Use `author` field for participant tracking
3. Code `selftext` and `comments` content
4. Use `created_date` for temporal analysis

#### For Quantitative Analysis (SPSS, R, Python)

1. Import CSV file
2. Analyze engagement metrics (score, num_comments)
3. Temporal trends by `created_date`
4. Compare medications using `subreddit` as context

---

## Complete Example Session

### Query 1: Initial Search

**You**: "I'm researching anti-nausea medications in pregnancy. Search for ondansetron, metoclopramide, and promethazine discussions in pregnant, BabyBumps, and HyperemesisGravidarum subreddits from 2020-2023. Get 50 threads per medication."

**Claude**: [Uses batch_search_medications, returns results]

---

### Query 2: Review Results

**You**: "How many threads did we find for each medication? Are there any trends in the discussion dates?"

**Claude**: [Analyzes results, provides summary]

---

### Query 3: Get Context

**You**: "Get information about the HyperemesisGravidarum subreddit to understand the community context."

**Claude**: [Uses get_subreddit_info, provides subreddit details]

---

### Query 4: Collect Full Content

**You**: "For the top 20 ondansetron threads by score, get the full content including comments. Thread IDs: abc123, def456, ghi789..." [list IDs]

**Claude**: [Uses get_thread_details for each, returns full content]

---

### Query 5: Export for Analysis

**You**: "Export all collected threads to both CSV and JSON formats with full metadata and anonymization."

**Claude**: [Uses export_research_data, provides file paths]

---

## Documentation for Methods Section

When documenting your methodology, include:

### Data Collection

```
Data were collected from Reddit using the Reddit Research MCP Bundle
(v1.0.0). Three anti-nausea medications were searched: ondansetron,
metoclopramide, and promethazine. Searches covered three pregnancy-
related subreddits (r/pregnant, r/BabyBumps, r/HyperemesisGravidarum)
from January 1, 2020 to December 31, 2023.

Inclusion criteria:
- Minimum 5 comments
- Minimum 50 words in post
- Medication name mentioned in post or title

A total of 142 threads were collected (ondansetron: 50, metoclopramide:
45, promethazine: 47).
```

### Anonymization

```
All Reddit usernames were anonymized using SHA-256 cryptographic hashing
with 8-character truncation. The anonymization was performed automatically
during data collection to ensure participant privacy. Original usernames
were never stored or logged.
```

### Ethical Compliance

```
Data collection followed AoIR Ethics 3.0 guidelines. Only publicly
available Reddit posts were collected. No private messages or restricted
content were accessed. No interaction with participants occurred. The
study was approved by [Institution] IRB under protocol [number].
```

---

## Timeline Estimate

For a study of this scope:

- **Phase 1 (Planning)**: 1-2 hours
- **Phase 2 (Batch Search)**: 5-10 minutes
- **Phase 3 (Review)**: 30 minutes
- **Phase 4 (Full Content)**: 20-30 minutes
- **Phase 5 (Export)**: 5 minutes
- **Phase 6 (Analysis)**: Several weeks (depends on methodology)

**Total data collection time**: ~1-2 hours

---

## Tips for Success

### 1. Document Everything

Keep a research log of:
- Search queries used
- Date ranges
- Thread counts
- Any filtering or exclusion decisions

### 2. Systematic Approach

Follow a consistent process:
- Define criteria before searching
- Apply same filters to all medications
- Document deviations or refinements

### 3. Pilot Testing

Before full data collection:
- Test search on one medication
- Verify data quality
- Refine criteria if needed

### 4. Data Management

Organize your exports:
```
exports/
├── 2025-11-20_pilot_search/
├── 2025-11-25_final_collection/
│   ├── reddit_export_20251125_100000.csv
│   ├── reddit_export_20251125_100015.json
│   └── metadata.txt
└── README.txt
```

### 5. Backup Data

- Keep multiple copies of exported data
- Store on secure, institutional storage
- Document retention/destruction plan

---

## Troubleshooting Common Issues

### Issue: "Not enough threads found"

**Solutions**:
- Expand date range (e.g., 2018-2024 instead of 2020-2023)
- Include more subreddits
- Lower quality filters (min_comments, min_words)
- Search brand names in addition to generic names

### Issue: "Rate limiting delays"

**Expected behavior**: Tool pauses between medications

**Time estimate**: ~2-3 seconds between medications

**For 10 medications**: Expect 20-30 seconds of pauses total

### Issue: "Some threads deleted or removed"

**Common occurrence**: ~5-10% of threads may be deleted

**Handled automatically**: Tool skips deleted content

**Documentation**: Export metadata lists failed threads

---

## Related Documentation

- **[Example 1](01-search-single-medication.md)** - Single medication search
- **[PRIVACY.md](../PRIVACY.md)** - Privacy and ethics
- **[docs/API.md](../docs/API.md)** - Complete API reference

---

**Last Updated**: 2025-11-20

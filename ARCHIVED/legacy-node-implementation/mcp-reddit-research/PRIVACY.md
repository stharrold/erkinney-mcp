# Privacy Protection & Ethical Guidelines

## Overview

This MCP bundle implements **comprehensive privacy protection** for academic research on Reddit data. All data collection follows the **AoIR Ethics 3.0** framework and is designed to facilitate IRB approval for health communication research.

---

## Privacy Protection Mechanisms

### 1. Username Anonymization

**Method**: SHA-256 cryptographic hashing with consistent mapping

**Implementation**:
- All Reddit usernames are hashed using SHA-256 algorithm
- Truncated to 8 characters for readability (e.g., `a7b3c9d2`)
- Consistent within study: same username always produces same hash
- Configurable salt for reproducibility

**Example**:
```
Original:  JohnDoe123
Anonymized: a7b3c9d2
```

**Why SHA-256?**
- Industry-standard cryptographic hash function
- One-way transformation (cannot reverse to original username)
- Collision-resistant (different usernames produce different hashes)
- Deterministic (same input always produces same output)

### 2. Default-On Privacy

**Anonymization is enabled by default** in all tools:
- `search_reddit_threads` - Returns anonymized authors
- `get_thread_details` - Anonymizes post and comment authors
- `batch_search_medications` - All results anonymized
- `export_research_data` - Anonymization enabled by default

You must **explicitly disable** anonymization if needed (not recommended for research).

### 3. No Original Usernames

**Original usernames are never stored, logged, or exported**:
- Anonymization happens immediately upon data retrieval
- Cache stores only anonymized data
- Export files contain only anonymized hashes
- Logs do not include usernames

---

## What Data is Collected

### ✅ Data We Collect

| Data Type | Example | Purpose |
|-----------|---------|---------|
| Post titles | "Taking ondansetron during pregnancy?" | Research content |
| Post content | Discussion text from public posts | Research content |
| Public comments | Replies and discussions | Research content |
| Anonymized usernames | `a7b3c9d2` | Identify unique participants |
| Timestamps | `2023-05-15T14:30:00Z` | Temporal analysis |
| Scores | Upvotes, comment counts | Engagement metrics |
| Subreddit names | `r/pregnant` | Context |

### ❌ Data We Do NOT Collect

| Data Type | Reason |
|-----------|--------|
| Private messages | Not public data |
| Personal health information | Privacy protection |
| Email addresses | Not available/not needed |
| Real names | Not available/not needed |
| IP addresses | Not available/not needed |
| Location data | Not available/not needed |
| Restricted subreddit content | Respect privacy settings |

---

## Ethical Framework: AoIR Ethics 3.0

This tool follows the **Association of Internet Researchers (AoIR) Ethics 3.0** guidelines:

### Core Principles

1. **Public Data Only**
   - Collect data only from publicly accessible subreddits
   - No interaction with participants
   - No access to private messages or restricted content

2. **Privacy Protection**
   - Anonymize all personally identifiable information
   - No attempts to re-identify users
   - Secure data storage and handling

3. **Respect Community Norms**
   - Review subreddit rules before collecting data
   - Respect deleted/removed content
   - Do not disrupt communities

4. **Transparency**
   - Clear documentation of methodology
   - Reproducible research methods
   - Honest reporting of limitations

5. **Minimize Harm**
   - Consider potential harms to individuals and communities
   - Implement safeguards against misuse
   - Appropriate use of research findings

### Compliance Checklist

Before starting data collection, verify:

- [ ] **Public Data**: All target subreddits are public
- [ ] **No PHI**: Tool does not collect personal health information
- [ ] **Anonymization**: SHA-256 hashing is enabled (default)
- [ ] **Research Purpose**: Documented research goals and methodology
- [ ] **IRB Approval**: Obtained if required by your institution
- [ ] **Data Security**: Secure storage with access controls
- [ ] **No Re-identification**: Will not attempt to identify users
- [ ] **Ethical Use**: Research findings will be used appropriately

---

## IRB Compliance Considerations

### Pre-IRB Prototype

This tool is a **pre-IRB prototype** designed to facilitate IRB approval:

**IRB-Friendly Features**:
- ✅ Public data only (no human subjects interaction)
- ✅ Anonymization built-in by default
- ✅ No personal health information collected
- ✅ Clear ethical framework (AoIR Ethics 3.0)
- ✅ Transparent methodology
- ✅ Reproducible data collection

### IRB Approval Process

**Recommended steps**:

1. **Review with your IRB**
   - Show them this documentation
   - Explain public data collection methodology
   - Demonstrate anonymization features

2. **May qualify for exemption**
   - Some IRBs exempt publicly available data
   - Consult your institution's policies
   - Document the exemption decision

3. **Document methodology**
   - Include search criteria
   - Document anonymization method
   - Explain privacy protections

4. **Secure data storage**
   - Follow institutional data security policies
   - Implement access controls
   - Plan for data retention/destruction

**Contact your IRB early** - they can provide guidance specific to your institution.

---

## Data Security Best Practices

### Storage

**Recommended practices**:
- Store exported data on encrypted drives
- Use institutional secure storage (not personal devices)
- Implement access controls (password protection)
- Regular backups with encryption

### Access

**Limit access to**:
- Authorized research team members only
- Institutional secure networks
- Password-protected systems

### Retention

**Plan for**:
- How long data will be retained
- When/how data will be destroyed
- Archival requirements (if any)

---

## Limitations & Risks

### Technical Limitations

1. **Anonymization is One-Way**
   - Cannot reverse anonymized usernames
   - Cannot link back to original users
   - This is intentional for privacy protection

2. **Public Data Snapshot**
   - Captures data at collection time
   - Cannot track deleted content retroactively
   - Users may delete posts after collection

3. **Rate Limiting**
   - Reddit API limits: 60 requests/minute
   - Large datasets require time to collect
   - Automated retry with exponential backoff

### Ethical Considerations

1. **Context Collapse**
   - Posts may be more sensitive than authors realized
   - Handle data with care and respect

2. **Re-identification Risk**
   - While usernames are anonymized, unique details in posts might enable re-identification
   - Do not attempt to identify users
   - Report findings in aggregate when possible

3. **Community Impact**
   - Consider how research findings might affect communities
   - Avoid stigmatizing language in publications
   - Engage with communities if appropriate

---

## Frequently Asked Questions

### Q: Can I recover original usernames from the hashes?

**A: No.** SHA-256 is a one-way cryptographic hash. The original username cannot be recovered from the hash. This is intentional for privacy protection.

### Q: Why 8-character hashes instead of full SHA-256?

**A: Readability.** Full SHA-256 hashes are 64 characters (very long). We truncate to 8 characters for:
- Easier reading in datasets
- Sufficient uniqueness for research purposes
- Still provides strong anonymization

The collision risk with 8-character hashes is extremely low for typical research datasets.

### Q: What if the same person posts under multiple usernames?

**A: They will appear as different participants.** Each username gets its own unique hash. We cannot (and should not) link multiple accounts belonging to the same person.

### Q: Do I need IRB approval?

**A: Consult your institution's IRB.** Requirements vary:
- Some IRBs exempt publicly available data
- Some require approval for all human subjects research
- Some require protocol submission but may grant exemption

Contact your IRB early with this documentation.

### Q: Is this HIPAA compliant?

**A: Not applicable.** HIPAA applies to protected health information (PHI) from covered entities (healthcare providers, insurers). Reddit posts are:
- Not from covered entities
- Publicly shared by individuals
- Not medical records

However, we still protect privacy through anonymization following research ethics best practices.

### Q: Can I share the raw exported data?

**A: Only anonymized data.** Never share data with original usernames. The exported data from this tool is already anonymized (if using default settings), making it safer to share. However:
- Follow your IRB's data sharing requirements
- Use data use agreements if sharing with collaborators
- Consider additional de-identification for sensitive content

---

## References

- **AoIR Ethics 3.0**: https://aoir.org/ethics/
- **PRISMA-ScR Guidelines**: http://www.prisma-statement.org/Extensions/ScopingReviews
- **Braun & Clarke (2019)**: Reflexive Thematic Analysis

---

## Contact

**Research Questions**: emkinney@iu.edu
**Technical Questions**: samuel.harrold@gmail.com

---

**Last Updated**: 2025-11-20
**Version**: 1.0.0

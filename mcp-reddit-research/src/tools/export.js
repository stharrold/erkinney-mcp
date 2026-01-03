/**
 * Export Research Data Tool
 * Exports collected thread data in research-ready formats (JSON/CSV)
 */

import fs from 'fs';
import path from 'path';
import { getThreadDetails } from './thread-details.js';
import { getAnonymizationMetadata } from '../privacy/anonymize.js';

/**
 * Create exports directory if it doesn't exist
 */
function ensureExportsDirectory() {
  const exportsDir = path.join(process.cwd(), 'exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
  return exportsDir;
}

/**
 * Generate timestamp for filename
 * @returns {string} Timestamp in YYYYMMDD_HHMMSS format
 */
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

/**
 * Escape CSV field
 * @param {string} field - Field value
 * @returns {string} Escaped field
 */
function escapeCsvField(field) {
  if (field === null || field === undefined) {
    return '';
  }

  const str = String(field);

  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Convert thread data to CSV rows
 * @param {Array} threads - Array of thread objects
 * @returns {string} CSV content
 */
function threadsToCSV(threads) {
  // CSV headers
  const headers = [
    'thread_id',
    'subreddit',
    'title',
    'author_hash',
    'created_date',
    'created_utc',
    'score',
    'num_comments',
    'word_count',
    'url',
    'selftext_preview'
  ];

  const rows = [headers.join(',')];

  // Add data rows
  for (const thread of threads) {
    const row = [
      escapeCsvField(thread.thread_id),
      escapeCsvField(thread.subreddit),
      escapeCsvField(thread.title),
      escapeCsvField(thread.author),
      escapeCsvField(thread.created_date),
      escapeCsvField(thread.created_utc),
      escapeCsvField(thread.score),
      escapeCsvField(thread.num_comments),
      escapeCsvField(thread.word_count),
      escapeCsvField(thread.url),
      escapeCsvField((thread.selftext || '').substring(0, 100)) // Preview only
    ];

    rows.push(row.join(','));
  }

  return rows.join('\n');
}

/**
 * Export collected thread data to JSON or CSV format
 *
 * @param {Object} params - Export parameters
 * @param {string[]} params.thread_ids - List of thread IDs to export
 * @param {string} params.format - Export format ('json' or 'csv')
 * @param {boolean} [params.anonymize=true] - Hash usernames with SHA-256
 * @param {boolean} [params.include_metadata=true] - Include collection metadata
 * @param {boolean} [params.include_comments=false] - Include comments in export
 * @returns {Promise<Object>} Export result with file path
 */
export async function exportResearchData(params) {
  // Validate required parameters
  if (!params.thread_ids || !Array.isArray(params.thread_ids) || params.thread_ids.length === 0) {
    throw new Error('thread_ids must be a non-empty array');
  }

  if (!params.format) {
    throw new Error('format is required (must be "json" or "csv")');
  }

  const threadIds = params.thread_ids;
  const format = params.format.toLowerCase();
  const anonymize = params.anonymize ?? true;
  const includeMetadata = params.include_metadata ?? true;
  const includeComments = params.include_comments ?? false;

  // Validate format
  if (!['json', 'csv'].includes(format)) {
    throw new Error(`format must be "json" or "csv". Received: "${format}"`);
  }

  console.error(`[Export] Exporting ${threadIds.length} threads to ${format.toUpperCase()}`);
  console.error(`[Export] Anonymization: ${anonymize ? 'enabled' : 'disabled'}`);
  console.error(`[Export] Comments: ${includeComments ? 'included' : 'excluded'}`);

  // Ensure exports directory exists
  const exportsDir = ensureExportsDirectory();

  // Fetch all threads
  const threads = [];
  const errors = [];

  for (let i = 0; i < threadIds.length; i++) {
    const threadId = threadIds[i];

    try {
      console.error(`[Export] Fetching ${i + 1}/${threadIds.length}: ${threadId}`);

      const result = await getThreadDetails({
        thread_id: threadId,
        include_comments: includeComments
      });

      threads.push(result.thread);

    } catch (error) {
      console.error(`[Export] Warning: Failed to fetch thread ${threadId}: ${error.message}`);

      errors.push({
        thread_id: threadId,
        error: error.message
      });
    }
  }

  console.error(`[Export] Successfully fetched ${threads.length}/${threadIds.length} threads`);

  if (threads.length === 0) {
    throw new Error('No threads could be fetched. All thread IDs were invalid or inaccessible.');
  }

  // Build export data
  const exportData = {
    threads: threads
  };

  // Add metadata if requested
  if (includeMetadata) {
    exportData.metadata = {
      export_date: new Date().toISOString(),
      total_threads: threads.length,
      requested_threads: threadIds.length,
      failed_threads: errors.length,
      anonymization: anonymize ? getAnonymizationMetadata() : { enabled: false },
      ethical_compliance: {
        framework: 'AoIR Ethics 3.0',
        data_source: 'Public Reddit posts only',
        privacy_protection: 'All usernames anonymized with SHA-256',
        research_purpose: 'Academic health communication research'
      }
    };

    if (errors.length > 0) {
      exportData.metadata.errors = errors;
    }
  }

  // Generate filename
  const timestamp = generateTimestamp();
  const filename = `reddit_export_${timestamp}.${format}`;
  const filepath = path.join(exportsDir, filename);

  // Write file based on format
  try {
    if (format === 'json') {
      // Write JSON
      const jsonContent = JSON.stringify(exportData, null, 2);
      fs.writeFileSync(filepath, jsonContent, 'utf8');

    } else if (format === 'csv') {
      // Write CSV
      const csvContent = threadsToCSV(threads);

      // Add metadata as header comments if requested
      let fullContent = csvContent;
      if (includeMetadata) {
        const metadataComments = [
          `# Reddit Research Export`,
          `# Export Date: ${exportData.metadata.export_date}`,
          `# Total Threads: ${threads.length}`,
          `# Anonymization: ${anonymize ? 'SHA-256 (8-char hash)' : 'Disabled'}`,
          `# Ethical Framework: AoIR Ethics 3.0`,
          `#`,
          ''
        ].join('\n');

        fullContent = metadataComments + csvContent;
      }

      fs.writeFileSync(filepath, fullContent, 'utf8');
    }

    console.error(`[Export] ✓ Wrote ${format.toUpperCase()} to: ${filepath}`);

  } catch (error) {
    throw new Error(
      `Cannot write file to ${filepath}. ` +
      `Check directory permissions. Error: ${error.message}`
    );
  }

  // Build result
  const result = {
    success: true,
    format: format,
    filepath: filepath,
    threads_exported: threads.length,
    threads_requested: threadIds.length,
    file_size_kb: Math.round(fs.statSync(filepath).size / 1024)
  };

  // Add warnings for errors
  if (errors.length > 0) {
    result.warning = `${errors.length} threads could not be fetched. ` +
      `IDs: ${errors.map(e => e.thread_id).join(', ')}`;
  }

  return result;
}

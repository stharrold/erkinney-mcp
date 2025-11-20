/**
 * Batch Search Medications Tool
 * Searches for multiple medications across subreddits efficiently
 */

import { searchRedditThreads } from './search.js';

/**
 * Sleep utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search for multiple medications across subreddits in one operation
 *
 * @param {Object} params - Batch search parameters
 * @param {string[]} params.medications - List of medication names
 * @param {string[]} params.subreddits - Target subreddits
 * @param {string} [params.start_date] - Start date YYYY-MM-DD
 * @param {string} [params.end_date] - End date YYYY-MM-DD
 * @param {number} [params.threads_per_medication=20] - Target threads per medication
 * @returns {Promise<Object>} Batch search results
 */
export async function batchSearchMedications(params) {
  // Validate required parameters
  if (!params.medications || !Array.isArray(params.medications) || params.medications.length === 0) {
    throw new Error('medications must be a non-empty array');
  }

  if (!params.subreddits || !Array.isArray(params.subreddits) || params.subreddits.length === 0) {
    throw new Error('subreddits must be a non-empty array');
  }

  const medications = params.medications;
  const subreddits = params.subreddits;
  const threadsPerMedication = params.threads_per_medication ?? 20;
  const startDate = params.start_date;
  const endDate = params.end_date;

  console.error(`[Batch Search] Searching for ${medications.length} medications`);
  console.error(`[Batch Search] Target: ${threadsPerMedication} threads per medication`);

  const results = {
    success: true,
    total_medications: medications.length,
    completed: 0,
    failed: 0,
    medications: {},
    errors: []
  };

  // Search each medication
  for (let i = 0; i < medications.length; i++) {
    const medication = medications[i];

    console.error(`[Batch Search] Searching ${i + 1}/${medications.length}: ${medication}`);

    try {
      // Search for this medication
      const searchResult = await searchRedditThreads({
        medication_name: medication,
        subreddits: subreddits,
        start_date: startDate,
        end_date: endDate,
        max_results: threadsPerMedication
      });

      // Store results
      results.medications[medication] = {
        success: true,
        count: searchResult.count,
        threads: searchResult.threads
      };

      results.completed++;

      console.error(
        `[Batch Search] ✓ ${medication}: Found ${searchResult.count} threads`
      );

    } catch (error) {
      // Log error but continue with other medications
      console.error(`[Batch Search] ✗ ${medication}: ${error.message}`);

      results.medications[medication] = {
        success: false,
        error: error.message
      };

      results.errors.push({
        medication: medication,
        error: error.message
      });

      results.failed++;
    }

    // Add delay between medications to respect rate limits
    // (except after the last one)
    if (i < medications.length - 1) {
      const delaySeconds = 2;
      console.error(
        `[Batch Search] Pausing ${delaySeconds}s before next medication ` +
        `(${medications.length - i - 1} remaining)...`
      );
      await sleep(delaySeconds * 1000);
    }
  }

  // Summary
  console.error(
    `[Batch Search] Complete: ${results.completed} succeeded, ${results.failed} failed`
  );

  // Calculate total threads found
  results.total_threads = Object.values(results.medications)
    .filter(med => med.success)
    .reduce((sum, med) => sum + med.count, 0);

  // Add message for partial failures
  if (results.failed > 0) {
    results.message = `Completed ${results.completed}/${results.total_medications} medications. ` +
      `Failed: ${results.errors.map(e => e.medication).join(', ')}`;
  } else {
    results.message = `Successfully searched all ${results.total_medications} medications. ` +
      `Found ${results.total_threads} total threads.`;
  }

  return results;
}

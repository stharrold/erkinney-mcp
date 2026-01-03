#!/usr/bin/env node

/**
 * Reddit Research MCP Server
 * Model Context Protocol server for pregnancy medication research
 *
 * Provides 5 tools for collecting and analyzing Reddit discussions:
 * 1. search_reddit_threads - Search for medication discussions
 * 2. get_thread_details - Get full thread content with comments
 * 3. batch_search_medications - Search multiple medications at once
 * 4. export_research_data - Export data to JSON/CSV
 * 5. get_subreddit_info - Get subreddit information
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

import { searchRedditThreads } from './src/tools/search.js';
import { getThreadDetails } from './src/tools/thread-details.js';
import { batchSearchMedications } from './src/tools/batch-search.js';
import { exportResearchData } from './src/tools/export.js';
import { getSubredditInfo } from './src/tools/subreddit-info.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load JSON resource file
 * @param {string} filename - Resource filename
 * @returns {Object} Parsed JSON
 */
function loadResource(filename) {
  const filepath = path.join(__dirname, 'resources', filename);
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

/**
 * Create and configure MCP server
 */
const server = new Server(
  {
    name: 'reddit-research',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

/**
 * Handler: List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_reddit_threads',
        description: 'Search for medication-related threads in pregnancy subreddits. Returns thread metadata with anonymized authors.',
        inputSchema: {
          type: 'object',
          properties: {
            medication_name: {
              type: 'string',
              description: 'Name of medication to search for (e.g., "ondansetron", "amoxicillin")'
            },
            subreddits: {
              type: 'array',
              items: { type: 'string' },
              description: 'Target subreddits without r/ prefix (e.g., ["pregnant", "BabyBumps"])'
            },
            start_date: {
              type: 'string',
              description: 'Start date in YYYY-MM-DD format (default: 2019-01-01)'
            },
            end_date: {
              type: 'string',
              description: 'End date in YYYY-MM-DD format (default: 2023-12-31)'
            },
            min_comments: {
              type: 'integer',
              description: 'Minimum number of comments (default: 5)'
            },
            min_words: {
              type: 'integer',
              description: 'Minimum word count in post (default: 50)'
            },
            max_results: {
              type: 'integer',
              description: 'Maximum threads to return (default: 100)'
            }
          },
          required: ['medication_name', 'subreddits']
        }
      },

      {
        name: 'get_thread_details',
        description: 'Retrieve full content of a Reddit thread including comments. Authors are automatically anonymized.',
        inputSchema: {
          type: 'object',
          properties: {
            thread_id: {
              type: 'string',
              description: 'Reddit thread ID (e.g., "abc123")'
            },
            include_comments: {
              type: 'boolean',
              description: 'Include comments (default: true)'
            },
            max_comments: {
              type: 'integer',
              description: 'Maximum comments to retrieve (default: 50)'
            },
            sort_by: {
              type: 'string',
              enum: ['top', 'best', 'new'],
              description: 'Comment sort order (default: "top")'
            }
          },
          required: ['thread_id']
        }
      },

      {
        name: 'batch_search_medications',
        description: 'Search for multiple medications across subreddits in one operation. Efficient for collecting diverse medication data.',
        inputSchema: {
          type: 'object',
          properties: {
            medications: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of medication names (e.g., ["ondansetron", "amoxicillin", "levothyroxine"])'
            },
            subreddits: {
              type: 'array',
              items: { type: 'string' },
              description: 'Target subreddits without r/ prefix'
            },
            start_date: {
              type: 'string',
              description: 'Start date YYYY-MM-DD'
            },
            end_date: {
              type: 'string',
              description: 'End date YYYY-MM-DD'
            },
            threads_per_medication: {
              type: 'integer',
              description: 'Target threads per medication (default: 20)'
            }
          },
          required: ['medications', 'subreddits']
        }
      },

      {
        name: 'export_research_data',
        description: 'Export collected thread data to JSON or CSV format with anonymization and metadata.',
        inputSchema: {
          type: 'object',
          properties: {
            thread_ids: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of thread IDs to export'
            },
            format: {
              type: 'string',
              enum: ['json', 'csv'],
              description: 'Export format'
            },
            anonymize: {
              type: 'boolean',
              description: 'Hash usernames with SHA-256 (default: true, recommended)'
            },
            include_metadata: {
              type: 'boolean',
              description: 'Include collection metadata (default: true)'
            },
            include_comments: {
              type: 'boolean',
              description: 'Include comments in export (default: false)'
            }
          },
          required: ['thread_ids', 'format']
        }
      },

      {
        name: 'get_subreddit_info',
        description: 'Get information about a subreddit (subscribers, description, rules).',
        inputSchema: {
          type: 'object',
          properties: {
            subreddit_name: {
              type: 'string',
              description: 'Name of subreddit without r/ prefix (e.g., "pregnant")'
            }
          },
          required: ['subreddit_name']
        }
      }
    ]
  };
});

/**
 * Handler: Execute tool
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    console.error(`[MCP Server] Tool called: ${name}`);

    let result;

    switch (name) {
      case 'search_reddit_threads':
        result = await searchRedditThreads(args);
        break;

      case 'get_thread_details':
        result = await getThreadDetails(args);
        break;

      case 'batch_search_medications':
        result = await batchSearchMedications(args);
        break;

      case 'export_research_data':
        result = await exportResearchData(args);
        break;

      case 'get_subreddit_info':
        result = await getSubredditInfo(args);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };

  } catch (error) {
    console.error(`[MCP Server] Tool error: ${error.message}`);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

/**
 * Handler: List available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'resource://medication-templates',
        name: 'Medication Search Templates',
        description: 'Pre-configured search templates for common medication classes',
        mimeType: 'application/json'
      },
      {
        uri: 'resource://ethics-guidelines',
        name: 'Ethical Guidelines',
        description: 'AoIR Ethics 3.0 guidelines and compliance checklist',
        mimeType: 'application/json'
      }
    ]
  };
});

/**
 * Handler: Read resource
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    let content;

    switch (uri) {
      case 'resource://medication-templates':
        content = loadResource('medication-templates.json');
        break;

      case 'resource://ethics-guidelines':
        content = loadResource('ethics-guidelines.json');
        break;

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }

    return {
      contents: [
        {
          uri: uri,
          mimeType: 'application/json',
          text: JSON.stringify(content, null, 2)
        }
      ]
    };

  } catch (error) {
    throw new Error(`Failed to read resource ${uri}: ${error.message}`);
  }
});

/**
 * Start the MCP server
 */
async function main() {
  console.error('[MCP Server] Starting Reddit Research MCP Server v1.0.0');
  console.error('[MCP Server] Privacy: SHA-256 anonymization enabled by default');
  console.error('[MCP Server] Ethics: AoIR Ethics 3.0 compliant');

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[MCP Server] Server started successfully');
  console.error('[MCP Server] Available tools: 5');
  console.error('[MCP Server] Available resources: 2');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('[MCP Server] Shutting down...');
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error('[MCP Server] Shutting down...');
  await server.close();
  process.exit(0);
});

// Start server
main().catch((error) => {
  console.error('[MCP Server] Fatal error:', error);
  process.exit(1);
});

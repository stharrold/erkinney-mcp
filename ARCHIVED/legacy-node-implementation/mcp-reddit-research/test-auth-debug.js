#!/usr/bin/env node
/**
 * Debug script to test Reddit authentication
 */

import snoowrap from 'snoowrap';
import dotenv from 'dotenv';

dotenv.config();

async function testAuth() {
  console.log('Testing Reddit Authentication...\n');

  console.log('Environment variables:');
  console.log('- REDDIT_CLIENT_ID:', process.env.REDDIT_CLIENT_ID || 'NOT SET');
  console.log('- REDDIT_CLIENT_SECRET:', process.env.REDDIT_CLIENT_SECRET ? '[SET - ' + process.env.REDDIT_CLIENT_SECRET.length + ' chars]' : 'NOT SET');
  console.log('- REDDIT_USERNAME:', process.env.REDDIT_USERNAME || 'NOT SET');
  console.log('- REDDIT_PASSWORD:', process.env.REDDIT_PASSWORD ? '[SET - ' + process.env.REDDIT_PASSWORD.length + ' chars]' : 'NOT SET');
  console.log('- REDDIT_USER_AGENT:', process.env.REDDIT_USER_AGENT || 'NOT SET');
  console.log('');

  try {
    console.log('Creating snoowrap client...');
    const reddit = new snoowrap({
      userAgent: process.env.REDDIT_USER_AGENT,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD
    });

    console.log('✓ Client created');
    console.log('');
    console.log('Testing getMe()...');

    const me = await reddit.getMe();

    console.log('');
    console.log('✓✓✓ SUCCESS! ✓✓✓');
    console.log('');
    console.log('Authenticated as:', me.name);
    console.log('Link karma:', me.link_karma);
    console.log('Comment karma:', me.comment_karma);
    console.log('Account created:', new Date(me.created_utc * 1000).toISOString());

  } catch (error) {
    console.log('');
    console.log('✗✗✗ AUTHENTICATION FAILED ✗✗✗');
    console.log('');
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    console.log('');

    if (error.response) {
      console.log('HTTP Response:');
      console.log('- Status:', error.response.status);
      console.log('- Status text:', error.response.statusText);
      console.log('- Data:', JSON.stringify(error.response.data, null, 2));
    }

    if (error.stack) {
      console.log('');
      console.log('Stack trace:');
      console.log(error.stack);
    }

    console.log('');
    console.log('Common issues:');
    console.log('1. Wrong username or password');
    console.log('2. Reddit app is not type "script" (check https://www.reddit.com/prefs/apps)');
    console.log('3. 2FA is enabled (script apps don\'t support 2FA)');
    console.log('4. Client ID or secret is incorrect');
    console.log('5. Rate limiting (wait a few minutes)');

    process.exit(1);
  }
}

testAuth();

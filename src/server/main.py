# reddit-research-gemini/server/main.py
import os
from mcp.server.fastmcp import FastMCP

# Secure Injection Verification:
# The server MUST fail if REDDIT_CLIENT_ID is not provided in the environment.
# This ensures that the client is correctly injecting credentials.
if "REDDIT_CLIENT_ID" not in os.environ:
    raise RuntimeError("CRITICAL SECURITY ERROR: REDDIT_CLIENT_ID not found in environment.")

# Hardcoded compliance verification (set by client)
user_agent = os.environ.get("REDDIT_USER_AGENT", "Unknown")
print(f"Server started with User-Agent: {user_agent}")

# Initialize FastMCP Server
mcp = FastMCP("reddit-research-mock")

@mcp.tool()
def search_reddit(query: str) -> str:
    """
    Search Reddit for discussions related to pregnancy medications.
    
    Args:
        query: The search term or medication name.
    """
    # Mock data for demonstration
    return f"Mock results for '{query}': Found 3 threads in r/pregnant discussing side effects."

if __name__ == "__main__":
    mcp.run()

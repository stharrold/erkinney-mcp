# reddit-research-gemini/client/app.py
import os
import asyncio
import streamlit as st
from google import genai
from google.genai import types
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Constants
REDDIT_USER_AGENT = "ResearchBot/1.0 (IRB Approved)"
MODEL_ID = "gemini-2.0-flash"

# Page Configuration
st.set_page_config(page_title="Reddit Research Gemini", layout="wide")
st.title("🧪 Reddit Research Chatbot")

# --- SIDEBAR: SECURE CREDENTIALS ---
with st.sidebar:
    st.header("🔑 API Credentials")
    st.info("Keys are only stored in memory during this session and never saved to disk.")
    
    gemini_api_key = st.text_input("Google Gemini API Key", type="password")
    reddit_client_id = st.text_input("Reddit Client ID", type="password")
    reddit_client_secret = st.text_input("Reddit Client Secret", type="password")
    reddit_username = st.text_input("Reddit Username (Optional)", help="Required for moderation/posting")
    reddit_password = st.text_input("Reddit Password (Optional)", type="password", help="Required for moderation/posting")
    
    st.divider()
    st.markdown(f"**Compliance Agent:** `{REDDIT_USER_AGENT}`")

# --- HELPER FUNCTIONS ---

def convert_mcp_to_gemini_tool(mcp_tool):
    """
    Converts an MCP tool definition into a Gemini-compatible FunctionDeclaration.
    """
    # MCP uses JSON Schema Draft 7
    # Gemini expects a similar properties dict
    return types.FunctionDeclaration(
        name=mcp_tool.name,
        description=mcp_tool.description,
        parameters=mcp_tool.inputSchema
    )

async def run_chat():
    if not (gemini_api_key and reddit_client_id and reddit_client_secret):
        st.warning("Please provide all API keys in the sidebar to start.")
        return

    # Initialize Gemini Client
    client = genai.Client(api_key=gemini_api_key)

    # MCP Server Parameters (launching the local server)
    env = {
        **os.environ,
        "REDDIT_CLIENT_ID": reddit_client_id,
        "REDDIT_CLIENT_SECRET": reddit_client_secret,
        "REDDIT_USER_AGENT": REDDIT_USER_AGENT,
        "PYTHONPATH": os.getcwd()
    }
    
    # Add optional account credentials
    if reddit_username:
        env["REDDIT_USERNAME"] = reddit_username
    if reddit_password:
        env["REDDIT_PASSWORD"] = reddit_password

    server_params = StdioServerParameters(
        command="python",
        args=[os.path.join("src", "server", "main.py")],
        env=env
    )

    # Initialize Session State for Chat History
    if "messages" not in st.session_state:
        st.session_state.messages = []

    # Display Chat History
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Chat Input
    if prompt := st.chat_input("Ask about pregnancy medication research..."):
        # Add user message to state
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        # Start MCP Connection
        try:
            async with stdio_client(server_params) as (read, write):
                async with ClientSession(read, write) as session:
                    await session.initialize()

                    # List and Convert Tools
                    mcp_tools = await session.list_tools()
                    gemini_tools = [
                        convert_mcp_to_gemini_tool(t) for t in mcp_tools.tools
                    ]
                    
                    # Wrap in Gemini Tool object
                    tools_declaration = [types.Tool(function_declarations=gemini_tools)]

                    # Send to Gemini
                    with st.chat_message("assistant"):
                        response_placeholder = st.empty()
                        full_response = ""
                        
                        # Note: Simple non-streaming call for tool handling logic
                        # Real implementations might stream tokens
                        chat = client.chats.create(model=MODEL_ID, config=types.GenerateContentConfig(
                            tools=tools_declaration
                        ))
                        
                        res = chat.send_message(prompt)
                        
                        # Handle Tool Calls
                        while res.candidates[0].content.parts[0].function_call:
                            call = res.candidates[0].content.parts[0].function_call
                            tool_name = call.name
                            tool_args = call.args
                            
                            with st.status(f"Executing tool: `{tool_name}`...", expanded=True) as status:
                                # Call MCP tool
                                tool_result = await session.call_tool(tool_name, tool_args)
                                status.write("Result captured from MCP server.")
                                status.update(label="Tool execution complete", state="complete")
                            
                            # Send result back to Gemini
                            res = chat.send_message(
                                types.Part.from_function_response(
                                    name=tool_name,
                                    response={"result": tool_result.content}
                                )
                            )

                        full_response = res.text
                        response_placeholder.markdown(full_response)
                        st.session_state.messages.append({"role": "assistant", "content": full_response})

        except Exception as e:
            st.error(f"Error connecting to MCP server: {str(e)}")

if __name__ == "__main__":
    asyncio.run(run_chat())

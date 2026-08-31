# Page Grader MCP

The ROAS page-grader MCP server is configured for this repo in `.mcp.json` at
project scope, so anyone running Claude Code in this checkout is prompted to
approve it on first launch.

## Setup

The server needs an API key. The config reads it from the environment instead of
storing it in the repo — never commit the key.

```bash
export ROAS_MCP_API_KEY="..."   # add to your shell profile to persist
```

Then start Claude Code in this directory and approve the `page-grader` server
when prompted. Verify with:

```bash
claude mcp list
```

## Alternative: user scope

To make the server available in every project on your machine rather than just
this repo:

```bash
claude mcp add --transport http --scope user page-grader \
  https://mjaxhuehopzbsuhmseeg.supabase.co/functions/v1/page-grader-mcp \
  --header "Authorization: Bearer $ROAS_MCP_API_KEY"
```

Note this writes the literal key into `~/.claude.json`.

## Network access

The server is hosted on `*.supabase.co`. Claude Code on the web runs behind an
egress proxy whose default policy denies that host, so the server only connects
from a local Claude Code install, or from a web environment whose network policy
allows `mjaxhuehopzbsuhmseeg.supabase.co`.

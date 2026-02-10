# @dtelecom/stt-mcp

MCP (Model Context Protocol) server for [dTelecom real-time speech-to-text](https://x402stt.dtelecom.org) with x402 micropayments.

Lets AI assistants (Claude, Cursor, etc.) transcribe audio files using dTelecom STT — pay-per-use with USDC, no API keys needed.

## Tools

| Tool | Description |
|------|-------------|
| `transcribe_file` | Transcribe a WAV file (PCM16, 16kHz, mono) to text |
| `stt_pricing` | Get current pricing ($0.005/min) |
| `stt_health` | Check service health |

## Setup

### 1. Install

```bash
npm install -g @dtelecom/stt-mcp
```

### 2. Get a wallet

You need an Ethereum private key with USDC on Base mainnet. Any wallet works — MetaMask, etc.

### 3. Configure your AI assistant

**Claude Code** (`~/.claude.json`):

```json
{
  "mcpServers": {
    "dtelecom-stt": {
      "command": "dtelecom-stt-mcp",
      "env": {
        "DTELECOM_PRIVATE_KEY": "0xYOUR_PRIVATE_KEY"
      }
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "dtelecom-stt": {
      "command": "npx",
      "args": ["-y", "@dtelecom/stt-mcp"],
      "env": {
        "DTELECOM_PRIVATE_KEY": "0xYOUR_PRIVATE_KEY"
      }
    }
  }
}
```

**Cursor** (Settings > MCP Servers > Add):

```json
{
  "dtelecom-stt": {
    "command": "npx",
    "args": ["-y", "@dtelecom/stt-mcp"],
    "env": {
      "DTELECOM_PRIVATE_KEY": "0xYOUR_PRIVATE_KEY"
    }
  }
}
```

### 4. Convert audio (if needed)

The tool accepts WAV files in PCM16 16kHz mono format. Convert with:

```bash
ffmpeg -i input.mp3 -ar 16000 -ac 1 -acodec pcm_s16le output.wav
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DTELECOM_PRIVATE_KEY` | Yes | — | Ethereum private key (0x-prefixed) |
| `DTELECOM_STT_URL` | No | `https://x402stt.dtelecom.org` | STT service URL |

## Pricing

- $0.005/min, billed per session
- Minimum 5 minutes ($0.025)
- Paid in USDC on Base mainnet via x402 protocol
- No accounts, no API keys, no subscriptions

## Links

- [dTelecom STT Service](https://x402stt.dtelecom.org)
- [TypeScript SDK](https://www.npmjs.com/package/@dtelecom/stt)
- [x402 Protocol](https://x402.org)

## License

MIT

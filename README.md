# @dtelecom/stt-mcp

## Contract scope and current gateway

This package documents the legacy `x402stt.dtelecom.org` STT payment/session protocol. Its URLs, rates and automatic session-payment behavior below belong to that contract; they are not the current multi-service gateway contract. This documentation update does not verify or retire the legacy deployment.

For new integrations use [x402-client](https://github.com/dTelecom/x402-client) with [x402.dtelecom.org](https://x402.dtelecom.org/docs.md): prepaid wallet-authenticated live STT ($0.004/connected session minute), optional partials/Smart Turn, and a separate uploaded-file transcription/diarization API ($0.003/decoded minute, rounded to started seconds). This legacy client's file helper streams audio through live STT; it is not the new asynchronous batch API. Do not substitute the new base URL into this client without migrating authentication, session and event handling. The new SDK does not automatically buy credits or retry inference.


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

You need a private key with USDC. Either:
- **EVM** (Base): Ethereum private key (0x hex) with USDC on Base — MetaMask, etc.
- **Solana**: Solana private key (base58) with USDC on Solana — Phantom, Solflare, etc.

### 3. Configure your AI assistant

**Claude Code** (`~/.claude.json`):

```json
{
  "mcpServers": {
    "dtelecom-stt": {
      "command": "dtelecom-stt-mcp",
      "env": {
        "DTELECOM_PRIVATE_KEY": "YOUR_PRIVATE_KEY"
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
        "DTELECOM_PRIVATE_KEY": "YOUR_PRIVATE_KEY"
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
      "DTELECOM_PRIVATE_KEY": "YOUR_PRIVATE_KEY"
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
| `DTELECOM_PRIVATE_KEY` | Yes | — | EVM key (0x hex) or Solana key (base58) |
| `DTELECOM_STT_URL` | No | `https://x402stt.dtelecom.org` | STT service URL |

## Pricing

- $0.005/min, billed per session
- Minimum 5 minutes ($0.025)
- Paid in USDC on Base or Solana via x402 protocol
- No accounts, no API keys, no subscriptions

## Links

- [dTelecom STT Service](https://x402stt.dtelecom.org)
- [TypeScript SDK](https://www.npmjs.com/package/@dtelecom/stt)
- [x402 Protocol](https://x402.org)

## License

MIT

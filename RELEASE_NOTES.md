# Quant release notes

## LLM connection-test fix

The LLM Settings connection test no longer truncates at eight tokens. OpenAI reasoning models can consume that entire budget before emitting visible text, and local Ollama/OpenAI-compatible endpoints can truncate the probe. The shared connection-test budget is now 128 tokens for both endpoint families.

Validation: TypeScript type checking, production build, shared LLM regression check, and whitespace validation passed. The broader Quant test command remains blocked by the existing forecast Python environment because `pandas` and related fixtures are unavailable.

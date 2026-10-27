# insurance-document-agent

Minimal, from-scratch AI agent for:
- OCR text ingestion from insurance documents
- structured data extraction (policy/claim details)

## What is included

- `insurance_document_agent/agent.py`: core pipeline (`OCR -> structure -> confidence`)
- `insurance_document_agent/cli.py`: simple command line runner
- `tests/test_agent.py`: focused unit tests

## Quick start

Run tests:

```bash
python -m unittest -v
```

Run the CLI:

```bash
python -m insurance_document_agent.cli /absolute/path/to/document.txt
```

The default OCR provider is intentionally lightweight and treats input bytes as text for local development.
You can replace it with a real OCR backend by implementing the `OCRProvider` interface.
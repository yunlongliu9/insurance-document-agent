import json
import sys
from pathlib import Path

from .agent import AIInsuranceDocumentAgent


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python -m insurance_document_agent.cli /absolute/path/to/document", file=sys.stderr)
        return 1

    input_path = Path(sys.argv[1])
    if not input_path.is_file():
        print(f"File not found: {input_path}", file=sys.stderr)
        return 1

    agent = AIInsuranceDocumentAgent()
    data = agent.process_document(input_path.read_bytes())
    print(json.dumps(data, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

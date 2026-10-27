from __future__ import annotations

import re
from typing import Dict, Optional, Protocol


class OCRProvider(Protocol):
    def extract_text(self, document_bytes: bytes) -> str:
        ...


class SimpleOCRProvider:
    def extract_text(self, document_bytes: bytes) -> str:
        try:
            return document_bytes.decode("utf-8")
        except UnicodeDecodeError:
            return document_bytes.decode("latin-1", errors="ignore")


class AIInsuranceDocumentAgent:
    def __init__(self, ocr_provider: Optional[OCRProvider] = None) -> None:
        self.ocr_provider = ocr_provider or SimpleOCRProvider()

    def process_document(self, document_bytes: bytes) -> Dict[str, object]:
        text = self.ocr_provider.extract_text(document_bytes)
        data = self._extract_structured_data(text)
        data["raw_text"] = text
        return data

    def _extract_structured_data(self, text: str) -> Dict[str, object]:
        fields = {
            "policy_number": self._match_first(
                text, [r"Policy\s*(?:No|Number)\s*[:#]?\s*([A-Z0-9\-]+)"]
            ),
            "claim_number": self._match_first(
                text, [r"Claim\s*(?:No|Number)\s*[:#]?\s*([A-Z0-9\-]+)"]
            ),
            "insured_name": self._match_first(
                text, [r"Insured\s*Name\s*[:#]?\s*([A-Za-z ,.'\-]+)"]
            ),
            "date_of_loss": self._match_first(
                text,
                [
                    r"Date\s*of\s*Loss\s*[:#]?\s*([0-9]{4}-[0-9]{2}-[0-9]{2})",
                    r"Date\s*of\s*Loss\s*[:#]?\s*([0-9]{2}/[0-9]{2}/[0-9]{4})",
                ],
            ),
            "total_amount": self._parse_amount(
                self._match_first(
                    text,
                    [
                        r"Total\s*(?:Amount|Claim)\s*[:#]?\s*\$?\s*([0-9][0-9,]*(?:\.[0-9]{2})?)"
                    ],
                )
            ),
        }

        confidence_fields = ["policy_number", "claim_number", "insured_name", "date_of_loss"]
        extracted_count = sum(1 for name in confidence_fields if fields.get(name))
        fields["confidence"] = round(extracted_count / len(confidence_fields), 2)
        return fields

    @staticmethod
    def _match_first(text: str, patterns: list[str]) -> Optional[str]:
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None

    @staticmethod
    def _parse_amount(value: Optional[str]) -> Optional[float]:
        if not value:
            return None
        try:
            return float(value.replace(",", ""))
        except ValueError:
            return None

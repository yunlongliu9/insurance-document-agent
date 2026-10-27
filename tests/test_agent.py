import unittest

from insurance_document_agent.agent import AIInsuranceDocumentAgent


class FakeOCRProvider:
    def __init__(self, text: str) -> None:
        self.text = text

    def extract_text(self, document_bytes: bytes) -> str:
        return self.text


class AgentTests(unittest.TestCase):
    def test_extracts_core_fields_and_amount(self) -> None:
        text = """
        Policy Number: POL-12345
        Claim Number: CLM-8877
        Insured Name: Jane Doe
        Date of Loss: 2026-08-31
        Total Amount: $12,345.67
        """
        agent = AIInsuranceDocumentAgent(ocr_provider=FakeOCRProvider(text))
        result = agent.process_document(b"unused")

        self.assertEqual(result["policy_number"], "POL-12345")
        self.assertEqual(result["claim_number"], "CLM-8877")
        self.assertEqual(result["insured_name"], "Jane Doe")
        self.assertEqual(result["date_of_loss"], "2026-08-31")
        self.assertEqual(result["total_amount"], 12345.67)
        self.assertEqual(result["confidence"], 1.0)

    def test_missing_fields_reduce_confidence(self) -> None:
        text = "Policy Number: POL-12345"
        agent = AIInsuranceDocumentAgent(ocr_provider=FakeOCRProvider(text))
        result = agent.process_document(b"unused")

        self.assertEqual(result["policy_number"], "POL-12345")
        self.assertIsNone(result["claim_number"])
        self.assertIsNone(result["insured_name"])
        self.assertIsNone(result["date_of_loss"])
        self.assertIsNone(result["total_amount"])
        self.assertEqual(result["confidence"], 0.25)


if __name__ == "__main__":
    unittest.main()

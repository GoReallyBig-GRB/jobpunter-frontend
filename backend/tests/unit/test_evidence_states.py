import pytest
from types import SimpleNamespace

from app.domain.candidate.errors import InvalidEvidenceTransition
from app.domain.candidate.service import transition_evidence


def test_pending_review_can_be_approved():
    evidence = SimpleNamespace(
        status="PENDING_REVIEW",
        revision=1,
        verified_at=None,
        updated_at=None,
    )
    transition_evidence(evidence, "APPROVED")
    assert evidence.status == "APPROVED"
    assert evidence.revision == 2
    assert evidence.verified_at is not None


def test_draft_cannot_be_approved_directly():
    evidence = SimpleNamespace(
        status="DRAFT",
        revision=1,
        verified_at=None,
        updated_at=None,
    )
    with pytest.raises(InvalidEvidenceTransition):
        transition_evidence(evidence, "APPROVED")

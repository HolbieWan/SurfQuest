

"""
Tests for the Condition API endpoints in the SurfQuest project.

These tests ensure the ConditionViewSet provides correct data via GET endpoints.
"""

# ============================
# Third-Party Imports
# ============================
import pytest
from rest_framework.test import APIClient
from rest_framework import status

# ============================
# Django & Local Imports
# ============================
from conditions.models import Condition
from surfzones.models import SurfZone, Country, Continent
import uuid


@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def sample_country(db):
    continent = Continent.objects.create(name="Africa", code="AF")
    return Country.objects.create(name="South Africa", code="ZAF", continent=continent, slug="south-africa")

@pytest.fixture
def sample_surfzone(db, sample_country):
    return SurfZone.objects.create(name="Jeffrey’s Bay", slug="jeffreys-bay", country=sample_country)


@pytest.fixture
def sample_condition(db, sample_surfzone):
    return Condition.objects.create(
        surfzone=sample_surfzone,
        month="January",
        water_temp_c=24
    )


@pytest.mark.django_db
def test_list_conditions(api_client, sample_condition):
    """Test listing all conditions via the endpoint."""
    response = api_client.get("/api/v1/conditions/")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) >= 1
    assert any(cond["id"] == str(sample_condition.id) for cond in response.data)


@pytest.mark.django_db
def test_retrieve_condition(api_client, sample_condition):
    """Test retrieving a single condition by ID."""
    url = f"/api/v1/conditions/{sample_condition.id}/"
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["id"] == str(sample_condition.id)
    assert response.data["month"] == "January"

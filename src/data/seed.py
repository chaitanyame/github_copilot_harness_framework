# src/data/seed.py
"""Seed data generator for the mock data store."""

from datetime import datetime, timedelta, timezone
from typing import List
from uuid import uuid4

from src.models.project import Project, ProjectStatus

# Realistic project name components
ADJECTIVES = [
    "Advanced",
    "Automated",
    "Cloud",
    "Digital",
    "Dynamic",
    "Enterprise",
    "Global",
    "Innovative",
    "Intelligent",
    "Modern",
    "Next-Gen",
    "Optimized",
    "Premium",
    "Scalable",
    "Secure",
    "Smart",
    "Strategic",
    "Unified",
]

NOUNS = [
    "Analytics",
    "API",
    "Dashboard",
    "Gateway",
    "Hub",
    "Integration",
    "Manager",
    "Platform",
    "Portal",
    "Service",
    "Solution",
    "System",
    "Toolkit",
    "Workflow",
]

DOMAINS = [
    "Customer",
    "Data",
    "DevOps",
    "E-Commerce",
    "Finance",
    "Healthcare",
    "HR",
    "Inventory",
    "IoT",
    "Logistics",
    "Marketing",
    "Operations",
    "Sales",
    "Security",
    "Supply Chain",
]

OWNERS = [
    "alice.johnson",
    "bob.smith",
    "carol.williams",
    "david.brown",
    "emma.davis",
    "frank.miller",
    "grace.wilson",
    "henry.moore",
    "ivy.taylor",
    "jack.anderson",
    "kate.thomas",
    "liam.jackson",
]

DESCRIPTIONS = [
    "A comprehensive solution for streamlining business operations.",
    "Built to handle enterprise-scale workloads with high availability.",
    "Designed with security and compliance as top priorities.",
    "Enables real-time data processing and analytics.",
    "Features an intuitive user interface for maximum productivity.",
    "Integrates seamlessly with existing infrastructure.",
    "Leverages cutting-edge technology for optimal performance.",
    "Provides actionable insights through advanced analytics.",
    "Reduces operational costs while improving efficiency.",
    "Supports multi-tenant architecture for scalability.",
]


def generate_seed_data() -> List[Project]:
    """
    Generate 52 realistic seed projects.

    Returns:
        List of Project instances with varied data
    """
    projects: List[Project] = []
    base_time = datetime.now(timezone.utc)

    for i in range(52):
        # Create varied but deterministic project names
        adj = ADJECTIVES[i % len(ADJECTIVES)]
        domain = DOMAINS[i % len(DOMAINS)]
        noun = NOUNS[i % len(NOUNS)]
        name = f"{adj} {domain} {noun}"

        # Vary the status - about 80% active, 20% archived
        status = ProjectStatus.ARCHIVED if i % 5 == 0 else ProjectStatus.ACTIVE

        # Cycle through owners
        owner = OWNERS[i % len(OWNERS)]

        # Vary descriptions
        description = DESCRIPTIONS[i % len(DESCRIPTIONS)]

        # Create timestamps spread over the last 90 days
        days_ago = i * 1.7  # Spread projects over ~90 days
        created_at = base_time - timedelta(days=days_ago)

        # Updated sometime between creation and now
        update_offset = timedelta(days=days_ago * 0.3)
        updated_at = created_at + update_offset

        project = Project(
            id=uuid4(),
            name=name,
            description=description,
            status=status,
            owner=owner,
            created_at=created_at,
            updated_at=updated_at,
        )
        projects.append(project)

    return projects

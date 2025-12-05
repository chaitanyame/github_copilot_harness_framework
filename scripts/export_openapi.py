#!/usr/bin/env python3
"""Export OpenAPI specification to YAML file."""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

import yaml

from src.main import app


def export_openapi(output_path: str = "openapi.yaml") -> None:
    """Export the OpenAPI specification to a YAML file.

    Args:
        output_path: Path to the output YAML file.
    """
    openapi_schema = app.openapi()

    output_file = Path(output_path)
    with output_file.open("w", encoding="utf-8") as f:
        yaml.dump(openapi_schema, f, default_flow_style=False, sort_keys=False)

    print(f"OpenAPI specification exported to {output_file.absolute()}")


if __name__ == "__main__":
    output = sys.argv[1] if len(sys.argv) > 1 else "openapi.yaml"
    export_openapi(output)

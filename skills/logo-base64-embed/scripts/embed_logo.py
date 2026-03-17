#!/usr/bin/env python3
"""
Replace external logo URL with base64-embedded version in source files.

Usage:
    python embed_logo.py <source_file> <base64_file> [output_file]

Arguments:
    source_file: Path to source code file (HTML, JSX, TSX, etc.)
    base64_file: Path to file containing base64 string
    output_file: Optional output path (default: overwrites source_file)

Example:
    python embed_logo.py Home.tsx logo_base64.txt
    python embed_logo.py index.html logo_base64.txt output.html
"""

import sys
import re
from pathlib import Path


def embed_logo(source_path, base64_path, output_path=None):
    """Replace logo URL with base64 in source file."""
    
    source_file = Path(source_path)
    base64_file = Path(base64_path)
    
    if not source_file.exists():
        print(f"❌ Error: Source file '{source_path}' not found")
        sys.exit(1)
    
    if not base64_file.exists():
        print(f"❌ Error: Base64 file '{base64_path}' not found")
        sys.exit(1)
    
    # Read base64 string
    with open(base64_file, 'r') as f:
        base64_string = f.read().strip()
    
    # Read source file
    with open(source_file, 'r') as f:
        content = f.read()
    
    # Pattern to match image src with data:image or external URL
    patterns = [
        # Match existing base64 data URIs
        r'src="data:image/[^;]+;base64,[^"]*"',
        # Match external URLs (http/https)
        r'src="https?://[^"]*"',
        # Match relative paths ending in image extensions
        r'src="[^"]*\.(png|jpg|jpeg|gif|svg|webp)"',
    ]
    
    replacement = f'src="data:image/png;base64,{base64_string}"'
    
    # Try each pattern
    replaced = False
    for pattern in patterns:
        if re.search(pattern, content, re.IGNORECASE):
            content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
            replaced = True
            break
    
    if not replaced:
        print("⚠️  Warning: No logo src attribute found in source file")
        print("   Patterns searched:")
        for p in patterns:
            print(f"   - {p}")
        sys.exit(1)
    
    # Write output
    output_file = Path(output_path) if output_path else source_file
    with open(output_file, 'w') as f:
        f.write(content)
    
    print(f"✅ Logo embedded successfully!")
    print(f"   Source: {source_path}")
    print(f"   Base64 length: {len(base64_string)} characters")
    print(f"   Output: {output_file}")
    
    if output_file == source_file:
        print(f"   ⚠️  Original file overwritten")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    
    source_file = sys.argv[1]
    base64_file = sys.argv[2]
    output_file = sys.argv[3] if len(sys.argv) > 3 else None
    
    embed_logo(source_file, base64_file, output_file)

#!/usr/bin/env python3
"""
Process logo image to high-resolution format and convert to base64.

Usage:
    python process_logo.py <input_image> <target_size> [output_base64_file]

Arguments:
    input_image: Path to the source logo image (PNG, JPG, etc.)
    target_size: Target size in pixels (e.g., 128 for 128x128px)
    output_base64_file: Optional path to save base64 string (default: logo_base64.txt)

Example:
    python process_logo.py logo.png 128
    python process_logo.py logo.png 128 logo_b64.txt
"""

import sys
import base64
import subprocess
from pathlib import Path


def process_logo(input_path, target_size, output_path="logo_base64.txt"):
    """Process logo and convert to base64."""
    
    input_file = Path(input_path)
    if not input_file.exists():
        print(f"❌ Error: Input file '{input_path}' not found")
        sys.exit(1)
    
    # Create temporary high-res PNG
    temp_png = Path(f"/tmp/logo_hires_{target_size}.png")
    
    # Resize using ImageMagick convert
    cmd = [
        "convert",
        str(input_file),
        "-resize", f"{target_size}x{target_size}",
        str(temp_png)
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error resizing image: {e.stderr}")
        sys.exit(1)
    except FileNotFoundError:
        print("❌ Error: ImageMagick 'convert' command not found")
        print("   Install with: sudo apt-get install imagemagick")
        sys.exit(1)
    
    # Convert to base64
    with open(temp_png, "rb") as f:
        image_data = f.read()
        base64_string = base64.b64encode(image_data).decode('utf-8')
    
    # Save to output file
    output_file = Path(output_path)
    with open(output_file, "w") as f:
        f.write(base64_string)
    
    # Clean up temp file
    temp_png.unlink()
    
    # Print results
    print(f"✅ Logo processed successfully!")
    print(f"   Input: {input_path}")
    print(f"   Size: {target_size}x{target_size}px")
    print(f"   Base64 length: {len(base64_string)} characters")
    print(f"   Output: {output_path}")
    
    return base64_string


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    
    input_image = sys.argv[1]
    target_size = int(sys.argv[2])
    output_file = sys.argv[3] if len(sys.argv) > 3 else "logo_base64.txt"
    
    process_logo(input_image, target_size, output_file)

---
name: logo-base64-embed
description: Embed high-resolution logos as base64 in web projects to avoid CORS issues during export operations. Use when user uploads logo image, export functions fail due to CORS errors, or logos need to be embedded directly in code without external URLs.
license: Complete terms in LICENSE.txt
---

# Logo Base64 Embedding

Embed logos as base64-encoded data URIs to eliminate CORS issues during screenshot/export operations in web applications.

## Problem

External logo URLs cause CORS errors when export libraries (html2canvas, modern-screenshot, etc.) attempt to capture page screenshots. This breaks export functionality.

## Solution

Convert logos to high-resolution base64 data URIs embedded directly in source code:
- No external requests = no CORS errors
- Sharp display at any size (use 2-4x target display size)
- Works with all export libraries

## Workflow

### 1. Process Logo to High-Resolution Base64

Use `process_logo.py` to resize and convert logo:

```bash
python /home/ubuntu/skills/logo-base64-embed/scripts/process_logo.py <input_image> <target_size> [output_file]
```

**Parameters:**
- `input_image`: Path to logo (PNG, JPG, etc.)
- `target_size`: Size in pixels (use 2-4x display size for sharp rendering)
- `output_file`: Optional output path (default: `logo_base64.txt`)

**Example:**
```bash
# For 96x96px display, use 128px source for sharp rendering
python /home/ubuntu/skills/logo-base64-embed/scripts/process_logo.py logo.png 128
```

**Output:** Base64 string saved to `logo_base64.txt`

### 2. Embed Base64 in Source Code

Use `embed_logo.py` to replace logo src in source files:

```bash
python /home/ubuntu/skills/logo-base64-embed/scripts/embed_logo.py <source_file> <base64_file> [output_file]
```

**Parameters:**
- `source_file`: HTML, JSX, TSX, or other source file with `<img src="...">`
- `base64_file`: File containing base64 string (from step 1)
- `output_file`: Optional output path (default: overwrites source_file)

**Example:**
```bash
python /home/ubuntu/skills/logo-base64-embed/scripts/embed_logo.py Home.tsx logo_base64.txt
```

**What it does:**
- Finds `<img src="...">` patterns (external URLs or existing base64)
- Replaces with `src="data:image/png;base64,<base64_string>"`
- Overwrites source file (or writes to output_file if specified)

## Size Guidelines

| Display Size | Recommended Source Size | Reason                          |
| ------------ | ----------------------- | ------------------------------- |
| 24x24px      | 64px or 96px            | 2.5-4x for retina displays      |
| 48x48px      | 96px or 128px           | 2-2.5x for sharp rendering      |
| 96x96px      | 128px or 192px          | 1.3-2x prevents blur on scaling |

**Rule of thumb:** Use 2-4x target display size for crystal-clear rendering.

## Supported File Types

**Input:** PNG, JPG, JPEG, GIF, SVG, WebP (any format ImageMagick supports)  
**Output:** PNG base64 (optimal for logos with transparency)

## Requirements

- **ImageMagick** must be installed:
  ```bash
  sudo apt-get install imagemagick
  ```

## Common Issues

### Blurry Logo
**Cause:** Source resolution too low for display size  
**Fix:** Increase `target_size` in step 1 (use 2-4x display size)

### Script Not Found
**Cause:** Script not executable  
**Fix:** `chmod +x /home/ubuntu/skills/logo-base64-embed/scripts/*.py`

### ImageMagick Missing
**Cause:** `convert` command not found  
**Fix:** `sudo apt-get install imagemagick`

### No Logo Found in Source
**Cause:** Script can't find `<img src="...">` pattern  
**Fix:** Manually add `<img>` tag with placeholder src, then run script

## Example: Complete Workflow

```bash
# 1. Process logo to 128x128px high-res
python /home/ubuntu/skills/logo-base64-embed/scripts/process_logo.py /path/to/logo.png 128

# 2. Embed in React component
python /home/ubuntu/skills/logo-base64-embed/scripts/embed_logo.py /path/to/Home.tsx logo_base64.txt

# 3. Verify in browser - logo should be sharp and export should work without CORS errors
```

## Notes

- Base64 strings are large (~20-30KB for 128px logos) but eliminate network requests
- Commit base64-embedded files to version control for consistent deployment
- For very large logos (>200px), consider using local `/public` directory instead
- Works with any export library: html2canvas, modern-screenshot, dom-to-image, etc.

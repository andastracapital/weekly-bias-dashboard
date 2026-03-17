#!/usr/bin/env python3
"""
Forex Factory Timezone Converter
Converts times from various timezones to GMT+1 (Frankfurt Time)
"""

from datetime import datetime, timedelta
import sys
import re

# Timezone offset mapping (hours difference from UTC)
TIMEZONE_OFFSETS = {
    "GMT+0": 0,
    "GMT+1": 1,
    "GMT+2": 2,
    "GMT+7": 7,  # Bangkok
    "GMT+8": 8,  # Singapore/Hong Kong
    "GMT+9": 9,  # Tokyo
    "GMT-5": -5,  # New York (EST)
    "GMT-4": -4,  # New York (EDT)
    "GMT-8": -8,  # Los Angeles (PST)
    "GMT-7": -7,  # Los Angeles (PDT)
    "UTC": 0,
    "CET": 1,  # Central European Time
    "CEST": 2,  # Central European Summer Time
}

# Aliases for common timezone names
TIMEZONE_ALIASES = {
    "BANGKOK": "GMT+7",
    "SINGAPORE": "GMT+8",
    "TOKYO": "GMT+9",
    "NYC": "GMT-5",
    "NEW YORK": "GMT-5",
    "LA": "GMT-8",
    "LOS ANGELES": "GMT-8",
    "LONDON": "GMT+0",
    "FRANKFURT": "GMT+1",
    "BERLIN": "GMT+1",
}

def parse_time_input(time_str):
    """
    Parse time input in various formats:
    - "18:00 GMT+7"
    - "18:00 Bangkok"
    - "06:00"
    
    Returns: (hours, minutes, timezone_offset)
    """
    time_str = time_str.strip().upper()
    
    # Try to extract time and timezone
    match = re.match(r'(\d{1,2}):(\d{2})\s*(.+)?', time_str)
    if not match:
        raise ValueError(f"Invalid time format: {time_str}")
    
    hours = int(match.group(1))
    minutes = int(match.group(2))
    tz_str = match.group(3).strip() if match.group(3) else None
    
    if hours < 0 or hours > 23 or minutes < 0 or minutes > 59:
        raise ValueError(f"Invalid time: {hours}:{minutes}")
    
    # Determine timezone offset
    if tz_str:
        # Check aliases first
        if tz_str in TIMEZONE_ALIASES:
            tz_str = TIMEZONE_ALIASES[tz_str]
        
        if tz_str not in TIMEZONE_OFFSETS:
            raise ValueError(f"Unknown timezone: {tz_str}")
        
        tz_offset = TIMEZONE_OFFSETS[tz_str]
    else:
        # Default to GMT+1 if no timezone specified
        tz_offset = 1
    
    return hours, minutes, tz_offset

def convert_to_frankfurt(hours, minutes, source_tz_offset):
    """
    Convert time from source timezone to GMT+1 (Frankfurt Time)
    
    Args:
        hours: Hour (0-23)
        minutes: Minute (0-59)
        source_tz_offset: Source timezone offset from UTC (e.g., 7 for GMT+7)
    
    Returns:
        Formatted time string in GMT+1 (e.g., "12:00")
    """
    # Target timezone is GMT+1
    target_tz_offset = 1
    
    # Calculate hour difference
    hour_diff = target_tz_offset - source_tz_offset
    
    # Apply conversion
    new_hours = hours + hour_diff
    new_minutes = minutes
    
    # Handle day overflow/underflow
    if new_hours < 0:
        new_hours += 24
    elif new_hours >= 24:
        new_hours -= 24
    
    return f"{new_hours:02d}:{new_minutes:02d}"

def main():
    if len(sys.argv) < 2:
        print("Usage: python convert_timezone.py <time>")
        print("Examples:")
        print("  python convert_timezone.py '18:00 GMT+7'")
        print("  python convert_timezone.py '18:00 Bangkok'")
        print("  python convert_timezone.py '06:00 NYC'")
        sys.exit(1)
    
    time_input = sys.argv[1]
    
    try:
        hours, minutes, tz_offset = parse_time_input(time_input)
        frankfurt_time = convert_to_frankfurt(hours, minutes, tz_offset)
        
        print(f"Input: {time_input}")
        print(f"Frankfurt Time (GMT+1): {frankfurt_time}")
        
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

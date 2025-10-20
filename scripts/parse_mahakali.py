#!/usr/bin/env python3
"""
Parse Adya Mahakali Sahasranama text file and create JSON
"""
import json
import re

def parse_mahakali_sahasranama(input_file, output_file):
    """Parse the Mahakali text file and create structured JSON"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by entry number pattern (e.g., "1. NAME", "2. NAME", etc.)
    # Pattern: number followed by dot, space, and NAME in caps
    entries = re.split(r'\n(?=\d+\. [A-Z])', content.strip())
    
    result = []
    
    for entry in entries:
        if not entry.strip():
            continue
            
        lines = entry.strip().split('\n')
        if len(lines) < 2:
            continue
        
        # First line: "1. NAME"
        first_line = lines[0].strip()
        match = re.match(r'^(\d+)\.\s+(.+)$', first_line)
        
        if not match:
            continue
        
        index = int(match.group(1))
        name = match.group(2).strip()
        
        # Only include entries where the name is all caps (actual names)
        # Skip entries where name starts with lowercase (like explanatory text)
        if not name[0].isupper() or name.startswith('Sat ') or name.startswith('Chit '):
            continue
        
        # Second line: one-line meaning
        one_line = lines[1].strip() if len(lines) > 1 else ""
        
        # Find elaboration section
        elaboration = ""
        elaboration_started = False
        
        for i, line in enumerate(lines[2:], start=2):
            line_stripped = line.strip()
            
            if line_stripped == "ELABORATION:":
                elaboration_started = True
                continue
            
            if elaboration_started:
                if line_stripped == "-":
                    break
                elaboration += line + "\n"
        
        elaboration = elaboration.strip()
        
        result.append({
            "index": index,
            "name": name,
            "short": one_line,
            "elaboration": elaboration
        })
    
    # Write JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Parsed {len(result)} names successfully!")
    print(f"📝 Output written to: {output_file}")
    
    # Show first and last entry
    if result:
        print("\n📖 Sample (first entry):")
        print(f"Index: {result[0]['index']}")
        print(f"Name: {result[0]['name']}")
        print(f"Short: {result[0]['short'][:100]}...")
        print(f"\n📖 Sample (last entry):")
        print(f"Index: {result[-1]['index']}")
        print(f"Name: {result[-1]['name']}")
        print(f"Short: {result[-1]['short'][:100]}...")

if __name__ == "__main__":
    input_file = "f:/kalabhairavaNamavali_website/mahakali1000nameswebsite/adyamahakali_sahasranama(1000)_withelaborations.txt"
    output_file = "f:/kalabhairavaNamavali_website/mahakali_site/mahakali_sahasranama_meanings.json"
    
    parse_mahakali_sahasranama(input_file, output_file)

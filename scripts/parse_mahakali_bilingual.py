#!/usr/bin/env python3
"""
Parse Adya Mahakali Sahasranama text files (English and Hindi) and create JSON
"""
import json
import re

def parse_english_file(input_file):
    """Parse the English Mahakali text file"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by the "-" separator and then parse each entry
    sections = content.split('\n-\n')
    
    result = {}
    
    for section in sections:
        section = section.strip()
        if not section:
            continue
            
        lines = section.split('\n')
        if len(lines) < 2:
            continue
        
        # First line: "1. NAME"
        first_line = lines[0].strip()
        match = re.match(r'^(\d+)\.\s+(.+)$', first_line)
        
        if not match:
            continue
        
        index = int(match.group(1))
        name = match.group(2).strip()
        
        # Only process if name is all caps (actual name entries)
        if not name.isupper():
            continue
        
        # Second line: one-line meaning
        one_line = lines[1].strip() if len(lines) > 1 else ""
        
        # Find elaboration section
        elaboration = ""
        elaboration_started = False
        
        for line in lines[2:]:
            line_stripped = line.strip()
            
            if line_stripped == "ELABORATION:":
                elaboration_started = True
                continue
            
            if elaboration_started:
                elaboration += line + "\n"
        
        elaboration = elaboration.strip()
        
        result[index] = {
            "english_name": name,
            "english_one_line": one_line,
            "english_elaboration": elaboration
        }
    
    return result

def parse_hindi_file(input_file):
    """Parse the Hindi Mahakali text file"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by the "-" separator
    sections = content.split('\n-\n')
    
    result = {}
    
    for section in sections:
        section = section.strip()
        if not section:
            continue
            
        lines = section.split('\n')
        if len(lines) < 2:
            continue
        
        # First line: "1. हिंदी नाम (ENGLISH NAME)"
        first_line = lines[0].strip()
        match = re.match(r'^(\d+)\.\s+(.+)$', first_line)
        
        if not match:
            continue
        
        index = int(match.group(1))
        name = match.group(2).strip()
        
        # Remove English name in parentheses if present  
        name = re.sub(r'\s*\([A-Z\s\-\']+\)\s*$', '', name).strip()
        
        # Second line: one-line meaning
        one_line = lines[1].strip() if len(lines) > 1 else ""
        
        # Find elaboration section
        elaboration = ""
        elaboration_started = False
        
        for line in lines[2:]:
            line_stripped = line.strip()
            
            if 'व्याख्या/विस्तार' in line_stripped or line_stripped == "ELABORATION:":
                elaboration_started = True
                continue
            
            if elaboration_started:
                elaboration += line + "\n"
        
        elaboration = elaboration.strip()
        
        result[index] = {
            "hindi_name": name,
            "hindi_one_line": one_line,
            "hindi_elaboration": elaboration
        }
    
    return result

def merge_and_save(english_data, hindi_data, output_file, max_entries=1072):
    """Merge English and Hindi data and save to JSON"""
    
    merged = []
    
    # Get the range of indices (1 to max_entries)
    for index in range(1, max_entries + 1):
        if index not in english_data:
            print(f"⚠️  Warning: Missing English entry for index {index}")
            continue
        
        entry = {"index": index}
        entry.update(english_data[index])
        
        if index in hindi_data:
            entry.update(hindi_data[index])
        else:
            print(f"⚠️  Warning: Missing Hindi entry for index {index}")
            entry["hindi_name"] = ""
            entry["hindi_one_line"] = ""
            entry["hindi_elaboration"] = ""
        
        merged.append(entry)
    
    # Write JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)
    
    return merged

if __name__ == "__main__":
    english_file = "f:/kalabhairavaNamavali_website/mahakali1000nameswebsite/adyamahakali_sahasranama(1000)_withelaborations.txt"
    hindi_file = "f:/kalabhairavaNamavali_website/mahakali1000nameswebsite/mahakali_sahasranama(1000)_HINDI_withelaborations_CompleteReference.txt"
    output_file = "f:/kalabhairavaNamavali_website/mahakali_site/mahakali_sahasranama_meanings.json"
    
    print("📖 Parsing English file...")
    english_data = parse_english_file(english_file)
    print(f"✅ Parsed {len(english_data)} English entries")
    
    print("\n📖 Parsing Hindi file...")
    hindi_data = parse_hindi_file(hindi_file)
    print(f"✅ Parsed {len(hindi_data)} Hindi entries")
    
    print("\n🔗 Merging data...")
    merged = merge_and_save(english_data, hindi_data, output_file, max_entries=1072)
    print(f"✅ Created {len(merged)} merged entries")
    print(f"📝 Output written to: {output_file}")
    
    # Show first entry as sample
    if merged:
        print("\n📖 Sample (first entry):")
        print(f"Index: {merged[0]['index']}")
        print(f"English Name: {merged[0]['english_name']}")
        print(f"Hindi Name: {merged[0].get('hindi_name', 'N/A')}")
        print(f"English Short: {merged[0]['english_one_line'][:80]}...")
        print(f"Hindi Short: {merged[0].get('hindi_one_line', 'N/A')[:80]}...")
        
        print("\n📖 Sample (last entry):")
        print(f"Index: {merged[-1]['index']}")
        print(f"English Name: {merged[-1]['english_name']}")
        print(f"Hindi Name: {merged[-1].get('hindi_name', 'N/A')}")

#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re
import sys

# The 27 entries missing elaborations
missing_indices = [39, 159, 185, 318, 335, 363, 379, 384, 411, 511, 518, 550, 
                   629, 630, 631, 632, 633, 634, 740, 751, 771, 784, 815, 920, 946, 975, 984]

# Read the CompleteReference file to get the names
with open('../mahakali1000nameswebsite/mahakali_sahasranama(1000)_HINDI_withelaborations_CompleteReference.txt', 'r', encoding='utf-8') as f:
    ref_content = f.read()

# Parse reference file to get names for missing indices
ref_sections = ref_content.split('\n-\n')
missing_names = {}

for section in ref_sections:
    section = section.strip()
    if not section:
        continue
    
    lines = section.split('\n')
    if not lines:
        continue
    
    first_line = lines[0].strip()
    match = re.match(r'^(\d+)\.\s+(.+)$', first_line)
    if not match:
        continue
    
    index = int(match.group(1))
    if index in missing_indices:
        name = match.group(2).strip()
        # Remove English name in parentheses
        name = re.sub(r'\s*\([A-Z\s\-\']+\)\s*$', '', name).strip()
        missing_names[index] = name

print(f'Found {len(missing_names)} names from CompleteReference file')
print('='*70)

# Read the elaborations file
with open('../mahakali1000nameswebsite/mahakali_sahasranama(1000)_HINDI_withelaborations.txt', 'r', encoding='utf-8') as f:
    elab_content = f.read()

# Parse elaborations file
elab_sections = elab_content.split('\n-\n')
found_elaborations = {}

for section in elab_sections:
    section = section.strip()
    if not section:
        continue
    
    lines = section.split('\n')
    if len(lines) < 2:
        continue
    
    # First line should be name with English in parentheses
    name_line = lines[0].strip()
    
    # Extract Hindi name (before parentheses)
    hindi_name_match = re.match(r'^(.+?)\s*\(', name_line)
    if not hindi_name_match:
        continue
    
    hindi_name = hindi_name_match.group(1).strip()
    
    # Check if this name matches any of our missing names
    for idx, ref_name in missing_names.items():
        # Normalize names for comparison (remove spaces, special chars)
        norm_hindi = re.sub(r'[^\w]', '', hindi_name, flags=re.UNICODE)
        norm_ref = re.sub(r'[^\w]', '', ref_name, flags=re.UNICODE)
        
        if norm_hindi == norm_ref or hindi_name in ref_name or ref_name in hindi_name:
            # Found a match! Extract the elaboration
            elaboration = '\n'.join(lines[1:]).strip()
            found_elaborations[idx] = {
                'name': ref_name,
                'content': elaboration
            }
            print(f'✓ Found elaboration for #{idx}: {ref_name}')
            break

print(f'\n{"="*70}')
print(f'Matched {len(found_elaborations)} out of {len(missing_names)} missing entries')

if len(found_elaborations) < len(missing_names):
    print(f'\nStill missing elaborations for:')
    for idx in missing_indices:
        if idx not in found_elaborations:
            print(f'  #{idx}: {missing_names.get(idx, "Unknown")}')

# Save the found elaborations to a file for review
with open('../mahakali1000nameswebsite/extracted_elaborations.txt', 'w', encoding='utf-8') as f:
    f.write('EXTRACTED ELABORATIONS FOR MISSING ENTRIES\n')
    f.write('='*70 + '\n\n')
    
    for idx in sorted(found_elaborations.keys()):
        entry = found_elaborations[idx]
        f.write(f'{idx}. {entry["name"]}\n')
        f.write(entry['content'])
        f.write('\n\n' + '-'*70 + '\n\n')

print(f'\n📝 Saved extracted elaborations to: extracted_elaborations.txt')

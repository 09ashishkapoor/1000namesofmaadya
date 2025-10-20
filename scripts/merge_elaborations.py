#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re
import sys

# Read the extracted elaborations
print('Reading extracted elaborations...')
with open('../mahakali1000nameswebsite/extracted_elaborations.txt', 'r', encoding='utf-8') as f:
    extracted_content = f.read()

# Parse extracted elaborations
extracted_sections = extracted_content.split('\n----------------------------------------------------------------------\n\n')
extracted_data = {}

for section in extracted_sections:
    section = section.strip()
    if not section or section.startswith('EXTRACTED'):
        continue
    
    lines = section.split('\n')
    if not lines:
        continue
    
    # First line should be "INDEX. NAME"
    first_line = lines[0].strip()
    match = re.match(r'^(\d+)\.\s+(.+)$', first_line)
    if not match:
        continue
    
    index = int(match.group(1))
    name = match.group(2).strip()
    
    # Rest is the elaboration (skip the name line)
    elaboration = '\n'.join(lines[1:]).strip()
    
    extracted_data[index] = {
        'name': name,
        'elaboration': elaboration
    }

print(f'✓ Loaded {len(extracted_data)} extracted elaborations')

# Read the CompleteReference file
print('\nReading CompleteReference file...')
with open('../mahakali1000nameswebsite/mahakali_sahasranama(1000)_HINDI_withelaborations_CompleteReference.txt', 'r', encoding='utf-8') as f:
    ref_content = f.read()

# Parse the reference file
ref_sections = ref_content.split('\n-\n')
updated_sections = []
update_count = 0

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
        updated_sections.append(section)
        continue
    
    index = int(match.group(1))
    
    # Check if this index needs elaboration update
    if index in extracted_data:
        # Replace the section with the full elaboration
        new_section = f"{first_line}\n{extracted_data[index]['elaboration']}"
        updated_sections.append(new_section)
        update_count += 1
        print(f'  ✓ Updated entry #{index}: {extracted_data[index]["name"]}')
    else:
        # Keep original section
        updated_sections.append(section)

# Write the updated content back
print(f'\nWriting updated file...')
updated_content = '\n-\n'.join(updated_sections)

with open('../mahakali1000nameswebsite/mahakali_sahasranama(1000)_HINDI_withelaborations_CompleteReference.txt', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print(f'\n{"="*70}')
print(f'✅ Successfully updated {update_count} entries in CompleteReference file')
print(f'📝 File: mahakali_sahasranama(1000)_HINDI_withelaborations_CompleteReference.txt')
print(f'\nRemaining entries to be manually added: 4')
print(f'  #629: वृंदा')
print(f'  #630: कैटभी')
print(f'  #631: कपटेश्वरी')
print(f'  #632: उग्र चण्डेश्वरी')

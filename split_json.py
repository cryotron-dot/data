import json
import os
import math

def split_json_file(input_file, num_splits=10):
    """
    Split a JSON file into multiple files, each containing a portion of the data.
    
    Args:
        input_file: Path to the input JSON file
        num_splits: Number of splits to create (default: 10)
    """
    
    print(f"Reading {input_file}...")
    
    # Read the JSON file
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File '{input_file}' not found!")
        return
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format - {e}")
        return
    
    # Check if data is a list or dict
    if isinstance(data, list):
        total_items = len(data)
        print(f"Total items in list: {total_items}")
        
        # Calculate items per split
        items_per_split = math.ceil(total_items / num_splits)
        print(f"Items per split: {items_per_split}")
        
        # Split the data
        for i in range(num_splits):
            start_idx = i * items_per_split
            end_idx = min((i + 1) * items_per_split, total_items)
            
            # Skip if no items in this split
            if start_idx >= total_items:
                break
            
            split_data = data[start_idx:end_idx]
            
            # Create output filename
            base_name = os.path.splitext(input_file)[0]
            output_file = f"{base_name}_split_{i+1}.json"
            
            # Write to file
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(split_data, f, indent=2, ensure_ascii=False)
            
            print(f"Created {output_file} with {len(split_data)} items (indices {start_idx}-{end_idx-1})")
    
    elif isinstance(data, dict):
        # If it's a dictionary, we'll split based on keys
        keys = list(data.keys())
        total_keys = len(keys)
        print(f"Total keys in dict: {total_keys}")
        
        # Calculate keys per split
        keys_per_split = math.ceil(total_keys / num_splits)
        print(f"Keys per split: {keys_per_split}")
        
        # Split the data
        for i in range(num_splits):
            start_idx = i * keys_per_split
            end_idx = min((i + 1) * keys_per_split, total_keys)
            
            # Skip if no keys in this split
            if start_idx >= total_keys:
                break
            
            split_keys = keys[start_idx:end_idx]
            split_data = {key: data[key] for key in split_keys}
            
            # Create output filename
            base_name = os.path.splitext(input_file)[0]
            output_file = f"{base_name}_split_{i+1}.json"
            
            # Write to file
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(split_data, f, indent=2, ensure_ascii=False)
            
            print(f"Created {output_file} with {len(split_data)} keys")
    
    else:
        print(f"Error: JSON data is neither a list nor a dictionary. Type: {type(data)}")
        return
    
    print("\n✅ Splitting complete!")


if __name__ == "__main__":
    # Split riot-output.json into 10 files
    split_json_file('riot-output.json', num_splits=10)
    
    print("\n" + "="*50 + "\n")
    
    # Split riot-output-2.json into 10 files (if it exists and has content)
    if os.path.exists('riot-output-2.json'):
        split_json_file('riot-output-2.json', num_splits=10)

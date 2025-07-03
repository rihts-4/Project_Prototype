import pandas as pd
import json
import numpy as np

def load_events_data():
    """Load events data from CSV file"""
    try:
        df = pd.read_csv('osaka_events.csv')
        print(f'Loaded {len(df)} events from CSV')
        return df
    except FileNotFoundError:
        print('CSV file not found!')
        return None

def get_events_by_category(df, category):
    """Get events filtered by category"""
    if df is None:
        return None
    
    # Handle multiple categories (separated by semicolon)
    filtered_events = df[df['category'].str.contains(category, case=False, na=False)]
    return filtered_events

def get_free_events(df):
    """Get all free events"""
    if df is None:
        return None
    
    free_events = df[df['price'].str.contains('Free|Gratuito', case=False, na=False)]
    return free_events

def get_events_summary(df):
    """Get summary statistics of events"""
    if df is None:
        return None
    
    summary = {
        'total_events': len(df),
        'categories': df['category'].value_counts().to_dict(),
        'free_events': len(df[df['price'].str.contains('Free|Gratuito', case=False, na=False)]),
        'paid_events': len(df[~df['price'].str.contains('Free|Gratuito', case=False, na=False)])
    }
    return summary

def clean_data_for_json(df):
    """Clean data before converting to JSON"""
    if df is None:
        return None
    
    # Create a copy to avoid modifying original
    df_clean = df.copy()
    
    # Replace NaN/None values with null
    df_clean = df_clean.replace({np.nan: None})
    df_clean = df_clean.replace({'NaN': None})
    df_clean = df_clean.replace({'': None})
    
    # Handle potential infinity values
    df_clean = df_clean.replace([np.inf, -np.inf], None)
    
    # Ensure all string fields are properly encoded
    string_columns = ['name', 'description', 'price', 'datetime', 'location', 'image_url', 'url']
    for col in string_columns:
        if col in df_clean.columns:
            df_clean[col] = df_clean[col].astype(str)
            # Replace 'nan' string with None
            df_clean[col] = df_clean[col].replace('nan', None)
    
    # Handle category column separately - convert to list of strings
    if 'category' in df_clean.columns:
        df_clean['category'] = df_clean['category'].astype(str)
        df_clean['category'] = df_clean['category'].replace('nan', None)
        # Split categories by semicolon and strip whitespace
        df_clean['category'] = df_clean['category'].apply(
            lambda x: [cat.strip() for cat in x.split(';')] if x and x != 'None' else []
        )
    
    return df_clean

def convert_to_json(df, output_file='events.json'):
    """Convert CSV data to JSON format with proper cleaning"""
    if df is None:
        return None
    
    try:
        # Clean the data first
        df_clean = clean_data_for_json(df)
        
        if df_clean is None:
            print('Error: Failed to clean data')
            return None
        
        # Convert to list of dictionaries
        events_list = df_clean.to_dict('records')
        
        # Write to JSON file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(events_list, f, indent=2, ensure_ascii=False, default=str)
        
        print(f'Data exported to {output_file}')
        return events_list
        
    except Exception as e:
        print(f'Error converting to JSON: {e}')
        return None

def search_events(df, keyword):
    """Search events by keyword in name or description"""
    if df is None:
        return None
    
    try:
        mask = (df['name'].str.contains(keyword, case=False, na=False) | 
                df['description'].str.contains(keyword, case=False, na=False))
        return df[mask]
    except Exception as e:
        print(f'Error searching events: {e}')
        return None

def validate_json_output(filename='events.json'):
    """Validate that the JSON file was created correctly"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f'✅ JSON file is valid with {len(data)} events')
        
        # Check for any remaining NaN issues
        nan_count = 0
        category_list_count = 0
        for event in data:
            for key, value in event.items():
                if value == 'nan' or value == 'NaN':
                    nan_count += 1
                if key == 'category' and isinstance(value, list):
                    category_list_count += 1
        
        if nan_count > 0:
            print(f'⚠️  Found {nan_count} remaining NaN values')
        else:
            print('✅ No NaN values found in JSON')
        
        print(f'✅ Categories converted to lists: {category_list_count} events')
            
        return True
    except json.JSONDecodeError as e:
        print(f'❌ JSON validation error: {e}')
        return False
    except Exception as e:
        print(f'❌ Error validating JSON: {e}')
        return False

# Example usage
if __name__ == '__main__':
    # Load the data
    events_df = load_events_data()
    
    if events_df is not None:
        # Display basic info
        print('\n=== EVENTS DATA OVERVIEW ===')
        print(f'Total events: {len(events_df)}')
        print(f'Columns: {list(events_df.columns)}')
        
        # Check for data quality issues
        print('\n=== DATA QUALITY CHECK ===')
        null_counts = events_df.isnull().sum()
        for col, count in null_counts.items():
            if count > 0:
                print(f'{col}: {count} null values')
        
        # Get summary
        summary = get_events_summary(events_df)
        print(f'\n=== SUMMARY ===')
        print(f'Total events: {summary["total_events"]}')
        print(f'Free events: {summary["free_events"]}')
        print(f'Paid events: {summary["paid_events"]}')
        
        print(f'\n=== CATEGORIES ===')
        for category, count in summary['categories'].items():
            print(f'{category}: {count}')
        
        # Get culture events
        culture_events = get_events_by_category(events_df, 'Culture')
        print(f'\n=== CULTURE EVENTS ===')
        print(f'Found {len(culture_events)} culture events')
        
        # Get free events
        free_events = get_free_events(events_df)
        print(f'\n=== FREE EVENTS ===')
        print(f'Found {len(free_events)} free events')
        
        # Search for specific events
        conference_events = search_events(events_df, 'conference')
        print(f'\n=== CONFERENCE EVENTS ===')
        print(f'Found {len(conference_events)} conference events')
        
        # Convert to JSON with proper cleaning
        print(f'\n=== CONVERTING TO JSON ===')
        result = convert_to_json(events_df)
        
        if result:
            # Validate the JSON output
            validate_json_output()
        
        # Display first few events
        print(f'\n=== SAMPLE EVENTS ===')
        for i, event in events_df.head(3).iterrows():
            print(f'Name: {event["name"]}')
            print(f'Category: {event["category"]}')
            print(f'Price: {event["price"]}')
            print(f'Location: {event["location"]}')
            print('-' * 50)
    else:
        print('❌ Failed to load events data')
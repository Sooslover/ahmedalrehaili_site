#!/usr/bin/env python3
"""
Fetch Google Scholar data and save to JSON files
This script should be run periodically to update your publications and metrics
"""

import requests
from bs4 import BeautifulSoup
import json
import time

# Your Google Scholar ID
SCHOLAR_ID = "tMmhq2MAAAAJ"

def fetch_metrics():
    """Fetch citation metrics from Google Scholar"""
    try:
        url = f"https://scholar.google.com/citations?user={SCHOLAR_ID}&hl=en"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract metrics from the stats table
        stats = soup.select('.gsc_rsb_std')

        if len(stats) >= 3:
            metrics = {
                'citations': int(stats[0].text.replace(',', '')),
                'h_index': int(stats[1].text),
                'i10_index': int(stats[2].text)
            }

            # Save to JSON
            with open('data/metrics.json', 'w') as f:
                json.dump(metrics, f, indent=2)

            print(f"✓ Metrics saved: {metrics}")
            return metrics
        else:
            print("✗ Could not parse metrics")
            return None

    except Exception as e:
        print(f"✗ Error fetching metrics: {e}")
        return None

def fetch_publications():
    """Fetch all publications from Google Scholar"""
    try:
        publications = []
        page_size = 100
        start = 0

        url = f"https://scholar.google.com/citations?user={SCHOLAR_ID}&hl=en&cstart={start}&pagesize={page_size}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all publication rows
        rows = soup.select('.gsc_a_tr')

        for row in rows:
            try:
                title_elem = row.select_one('.gsc_a_at')
                authors_elem = row.select_one('.gs_gray')
                venue_elem = row.select('.gs_gray')[1] if len(row.select('.gs_gray')) > 1 else None
                year_elem = row.select_one('.gsc_a_y span')
                citations_elem = row.select_one('.gsc_a_c a')

                if title_elem:
                    # Get the citation ID for creating a proper link
                    link_elem = row.select_one('.gsc_a_at')
                    citation_id = None
                    if link_elem and link_elem.get('data-href'):
                        citation_id = link_elem.get('data-href').replace('/citations?view_op=view_citation&hl=en&user=' + SCHOLAR_ID + '&citation_for_view=' + SCHOLAR_ID + ':', '')

                    pub = {
                        'title': title_elem.text.strip(),
                        'authors': authors_elem.text.strip() if authors_elem else '',
                        'venue': venue_elem.text.strip() if venue_elem else '',
                        'year': year_elem.text.strip() if year_elem else '',
                        'citations': int(citations_elem.text) if citations_elem and citations_elem.text.isdigit() else 0,
                        'link': f"https://scholar.google.com/citations?view_op=view_citation&hl=en&user={SCHOLAR_ID}&citation_for_view={SCHOLAR_ID}:{citation_id}" if citation_id else None
                    }

                    publications.append(pub)

            except Exception as e:
                print(f"Warning: Could not parse a publication row: {e}")
                continue

        if publications:
            # Save to JSON
            with open('data/publications.json', 'w') as f:
                json.dump(publications, f, indent=2)

            print(f"✓ Saved {len(publications)} publications")
            return publications
        else:
            print("✗ No publications found")
            return None

    except Exception as e:
        print(f"✗ Error fetching publications: {e}")
        return None

def main():
    print("Fetching data from Google Scholar...")
    print(f"Scholar ID: {SCHOLAR_ID}\n")

    # Fetch metrics
    print("1. Fetching metrics...")
    metrics = fetch_metrics()
    time.sleep(2)  # Be nice to Google

    # Fetch publications
    print("\n2. Fetching publications...")
    pubs = fetch_publications()

    print("\n" + "="*50)
    if metrics and pubs:
        print("✓ SUCCESS! All data fetched and saved")
        print(f"  - Citations: {metrics['citations']}")
        print(f"  - h-index: {metrics['h_index']}")
        print(f"  - i10-index: {metrics['i10_index']}")
        print(f"  - Publications: {len(pubs)}")
    else:
        print("✗ Some errors occurred. Check the messages above.")
    print("="*50)

if __name__ == "__main__":
    main()

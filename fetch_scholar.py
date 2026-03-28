#!/usr/bin/env python3
"""
Fetch Google Scholar metrics and publications automatically
"""

import json
import re
import sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

def fetch_scholar_data(scholar_id):
    """Fetch data from Google Scholar profile"""
    url = f"https://scholar.google.com/citations?user={scholar_id}&hl=en"

    # Mimic a real browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
    }

    try:
        req = Request(url, headers=headers)
        with urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')

        # Extract metrics using regex patterns
        citations_match = re.search(r'<td class="gsc_rsb_std">(\d+)</td>', html)
        h_index_match = re.search(r'<td class="gsc_rsb_std">(\d+)</td>.*?<td class="gsc_rsb_std">(\d+)</td>', html, re.DOTALL)
        i10_match = re.search(r'<td class="gsc_rsb_std">(\d+)</td>.*?<td class="gsc_rsb_std">(\d+)</td>.*?<td class="gsc_rsb_std">(\d+)</td>', html, re.DOTALL)

        if not (citations_match and h_index_match and i10_match):
            print("Error: Could not parse metrics from HTML", file=sys.stderr)
            return None

        metrics = {
            'citations': int(citations_match.group(1)),
            'h_index': int(h_index_match.group(2)),
            'i10_index': int(i10_match.group(3))
        }

        return metrics

    except HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}", file=sys.stderr)
        if e.code == 403:
            print("Google Scholar is blocking automated access. Please update metrics manually.", file=sys.stderr)
        return None
    except URLError as e:
        print(f"URL Error: {e.reason}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        return None

def main():
    scholar_id = "tMmhq2MAAAAJ"

    print("Fetching Google Scholar data...")
    metrics = fetch_scholar_data(scholar_id)

    if metrics:
        # Save to metrics.json
        with open('data/metrics.json', 'w') as f:
            json.dump(metrics, f, indent=2)

        print(f"\n✓ Successfully updated metrics:")
        print(f"  Citations: {metrics['citations']}")
        print(f"  h-index: {metrics['h_index']}")
        print(f"  i10-index: {metrics['i10_index']}")
        print(f"\nMetrics saved to data/metrics.json")
        return 0
    else:
        print("\n✗ Failed to fetch data from Google Scholar")
        print("Please update data/metrics.json manually")
        return 1

if __name__ == "__main__":
    sys.exit(main())

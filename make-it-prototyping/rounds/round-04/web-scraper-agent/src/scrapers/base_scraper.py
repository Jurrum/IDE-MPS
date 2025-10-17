# ### Phase 1: Foundation (Week 1)
# **Goal:** Basic scraping and storage

# - [ ] Set up project structure
# - [ ] Implement base scraper class
# - [ ] Create database schema (targets, scrape_results, price_history)
# - [ ] Build static HTML scraper with BeautifulSoup
# - [ ] Implement basic CSS selector extraction
# - [ ] Add configuration file parser (YAML)
# - [ ] Write unit tests for core functions

import beautifulsoup4 as bs4

class BaseScraper:
    def __init__(self, target_url: str, selectors: dict):
        self.target_url = target_url
        self.selectors = selectors

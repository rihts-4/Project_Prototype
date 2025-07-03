# eventbrite_osaka_scraper.py
import time
import csv
import logging
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# ─── CONFIG ────────────────────────────────────────────────────────────────────
URL          = "https://www.eventbrite.com/d/japan--osaka-shi/all-events/"
OUT_CSV      = "osaka_events.csv"
UPDATE_EVERY = 3000  # seconds (5 minutes)
SCROLL_PAUSES = 5   # how many times to scroll down per page

CATEGORY_KEYWORDS = {
    "Beach": [
        "beach", "sand", "sea", "ocean", "coast", "shore", "surf", "waves",
        "tide", "boardwalk", "sunbathing", "snorkeling", "diving", "seaside",
        "lido", "bay"
    ],
    "Adventure": [
        "adventure", "hiking", "trekking", "climbing", "mountaineering",
        "rafting", "kayaking", "canoeing", "zipline", "safari", "bungee",
        "caving", "wild", "expedition", "extreme", "survival", "trailblazing"
    ],
    "Nature": [
        "nature", "park", "forest", "garden", "wildlife", "birdwatching",
        "lake", "river", "waterfall", "mountain", "outdoor", "trail",
        "camping", "eco", "conservation", "botanical", "reserve"
    ],
    "Culture": [
        "culture", "art", "gallery", "museum", "exhibition", "theater",
        "dance", "performance", "film", "cinema", "literature", "poetry",
        "heritage", "craft", "tradition", "ceremony", "festival",
        "japan events", "osaka prefecture events", "things to do in osaka-shi",
        "osaka-shi networking", "osaka-shi business networking",
        "#career", "#business", "#workshop", "#networking",
        "#technology", "#jobs", "#startups", "#sweden", "#jobsearch"
    ],
    "Nightlife": [
        "nightlife", "party", "club", "bar", "pub", "lounge", "dj",
        "karaoke", "gig", "concert", "afterparty", "dancefloor",
        "late-night", "mixology", "speakeasy"
    ],
    "History": [
        "history", "historical", "archive", "lecture", "battlefield",
        "ruins", "monument", "memorial", "medieval", "renaissance",
        "archaeology", "nostalgia", "legacy"
    ],
    "Shopping": [
        "shopping", "market", "bazaar", "mall", "boutique", "outlet",
        "fair", "expo", "flea", "artisan", "emporium", "pop-up", "sale"
    ],
    "Cuisine": [
        "food", "cuisine", "restaurant", "dinner", "lunch", "brunch",
        "gourmet", "tasting", "cooking", "wine", "brew", "coffee", "tea",
        "street food", "bakery", "barbecue", "vegan", "vegetarian", "seafood",
        "sushi", "ramen", "brewery", "food festival"
    ]
}
# ────────────────────────────────────────────────────────────────────────────────

logging.basicConfig(
    format="%(asctime)s ⏱ %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    level=logging.INFO
)

def classify_categories(text: str) -> str:
    txt = text.lower()
    found = []
    for cat, kws in CATEGORY_KEYWORDS.items():
        for kw in kws:
            if kw in txt:
                found.append(cat)
                break
    return "; ".join(found) if found else "Culture"

def scrape_osaka():
    logging.info(f"Starting scrape of {URL}")
    
    # Better Chrome options
    opts = Options()
    opts.add_argument("--headless")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-extensions")
    opts.add_argument("--disable-logging")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--remote-debugging-port=9222")
    opts.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
    
    driver = None
    try:
        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=opts
        )
        driver.set_page_load_timeout(30)
        driver.implicitly_wait(10)

        # 1) COLLECT ALL EVENT LINKS
        all_links = set()
        page = 1
        max_pages = 5  # Limit pages to prevent infinite loops
        
        while page <= max_pages:
            try:
                page_url = f"{URL}?page={page}"
                logging.info(f"▶ Loading search page {page}")
                
                driver.get(page_url)
                time.sleep(5)

                for _ in range(SCROLL_PAUSES):
                    driver.execute_script("window.scrollBy(0, document.body.scrollHeight);")
                    time.sleep(1)

                # Check if driver is still alive
                if not driver.service.is_connectable():
                    logging.error("Driver connection lost, breaking")
                    break

                anchors = driver.find_elements(By.CSS_SELECTOR, "a[href*='/e/']")
                links = {
                    a.get_attribute("href").split("?")[0]
                    for a in anchors if a.get_attribute("href")
                }
                logging.info(f"  • Found {len(links)} links on page {page}")

                new = links - all_links
                if not new:
                    break
                all_links |= new
                page += 1
                
            except Exception as e:
                logging.error(f"Error on page {page}: {e}")
                break

        logging.info(f"🔗 Total unique event links: {len(all_links)}")

        # 2) VISIT EACH EVENT PAGE
        events = []
        for i, url in enumerate(sorted(all_links)):
            try:
                # Check driver connection before each request
                if not driver.service.is_connectable():
                    logging.error("Driver disconnected, stopping scrape")
                    break
                    
                logging.info(f"⚙️  Visiting {url} ({i+1}/{len(all_links)})")
                driver.get(url)
                time.sleep(3)
                
                # Check if page loaded properly
                if "eventbrite.com" not in driver.current_url:
                    logging.warning(f"Page redirect detected for {url}")
                    continue
                
                soup = BeautifulSoup(driver.page_source, "html.parser")

                # title & meta-description
                title_tag = soup.select_one('meta[property="og:title"]')
                desc_tag  = soup.select_one('meta[property="og:description"]')
                name        = title_tag["content"].strip() if title_tag else ""
                description = desc_tag["content"].strip() if desc_tag else ""

                # date/time via OpenGraph meta tags
                start_tag = soup.select_one('meta[property="event:start_time"]')
                end_tag   = soup.select_one('meta[property="event:end_time"]')
                if start_tag and end_tag:
                    datetimes = f"{start_tag['content']} → {end_tag['content']}"
                else:
                    datetimes = "Permanent event"

                # full location
                loc_section = soup.select_one('section[aria-labelledby="location-heading"]')
                if loc_section:
                    loc_text = loc_section.select_one(".detail__content")
                    location = loc_text.get_text(" ", strip=True) if loc_text else "—"
                else:
                    location = "—"

                # price logic
                price_div   = soup.select_one("div[class*='priceWrapper']")
                price_text  = price_div.get_text(strip=True) if price_div else ""
                if price_text and price_text.lower() != "free":
                    price = price_text
                else:
                    js = driver.page_source
                    m  = re.search(r'"panelDisplayPrice"\s*:\s*"([^"]+)"', js)
                    price = m.group(1) if m else "Free"

                # extract the OG image URL
                img_tag   = soup.select_one('meta[property="og:image"]')
                image_url = img_tag["content"].strip() if img_tag else ""

                # skip pure-online
                if location.lower().startswith("online"):
                    logging.info(f"  ↳ Skipping online event: {name}")
                    continue

                # category
                category = classify_categories(name + " " + description)

                # unique ID
                eid = url.rstrip("/").split("-")[-1]

                events.append({
                    "id":          f"evt_{eid}",
                    "name":        name,
                    "category":    category,
                    "description": description,
                    "price":       price,
                    "datetime":    datetimes,
                    "location":    location,
                    "image_url":   image_url,
                    "url":         url
                })
                logging.info(f"  ✅ Parsed: {name}")
                
            except Exception as e:
                logging.error(f"Error processing {url}: {e}")
                continue

    except Exception as e:
        logging.error(f"Critical error in scrape_osaka: {e}")
        return []
    
    finally:
        if driver:
            try:
                driver.quit()
            except:
                pass

    logging.info(f"🐍 Parsed {len(events)} events in total")
    return events

def save_csv(events, path=OUT_CSV):
    headers = ["id","name","category","description","price","datetime","location","image_url","url"]
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=headers)
        w.writeheader()
        w.writerows(events)

def main_loop():
    while True:
        evts = scrape_osaka()
        save_csv(evts)
        logging.info(f"✅ {len(evts)} rows written to {OUT_CSV} — next update in {UPDATE_EVERY//60}m")
        time.sleep(UPDATE_EVERY)

if __name__ == "__main__":
    main_loop()

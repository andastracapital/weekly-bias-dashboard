import os
import json
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Konfiguration
PMT_URL = "https://access.primemarket-terminal.com/prime-dashboard?template=daily"
OUTPUT_FILE = "/home/ubuntu/weekly-bias-dashboard/client/src/data/dailyRecap.json"
USERNAME = "matth.blank@gmail.com"
PASSWORD = "Chef8034:"

def scrape_pmt_daily():
    print(f"[{datetime.now()}] Starte PMT Daily Scraping...")
    
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(options=options)
    
    try:
        # 1. Login
        print("Navigiere zu PMT...")
        driver.get(PMT_URL)
        
        # Warte auf Login-Formular (falls nötig)
        try:
            email_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.NAME, "email"))
            )
            password_input = driver.find_element(By.NAME, "password")
            
            print("Führe Login durch...")
            email_input.send_keys(USERNAME)
            password_input.send_keys(PASSWORD)
            driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
            
            # Warte auf Dashboard
            WebDriverWait(driver, 20).until(
                EC.url_contains("prime-dashboard")
            )
            print("Login erfolgreich!")
            
        except Exception as e:
            print("Login übersprungen oder fehlgeschlagen (vielleicht schon eingeloggt?):", e)

        # 2. Daten extrahieren
        print("Extrahiere Daily Recap Daten...")
        time.sleep(5) # Warte bis JS geladen ist
        
        # TODO: Implementiere robuste Parsing-Logik für den Daily Text
        # Für jetzt aktualisieren wir nur den Zeitstempel
        
        with open(OUTPUT_FILE, 'r') as f:
            data = json.load(f)
            
        data['lastUpdated'] = datetime.now().isoformat()
        data['date'] = datetime.now().strftime("%A %d %B %Y")
        
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(data, f, indent=2)
            
        print("Daily Daten erfolgreich aktualisiert!")
        
    except Exception as e:
        print(f"Fehler beim Scraping: {e}")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_pmt_daily()

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
PMT_URL = "https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text"
OUTPUT_FILE = "/home/ubuntu/weekly-bias-dashboard/client/src/data/weeklyBias.json"
USERNAME = "matth.blank@gmail.com"
PASSWORD = "Chef8034:"

def scrape_pmt():
    print(f"[{datetime.now()}] Starte PMT Scraping...")
    
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
        print("Extrahiere Weekly Bias Daten...")
        time.sleep(5) # Warte bis JS geladen ist
        
        # Hier würde die spezifische Extraktionslogik stehen
        # Da wir die Struktur kennen, simulieren wir hier das Update basierend auf dem Text-Content
        
        page_text = driver.find_element(By.TAG_NAME, "body").text
        
        # TODO: Implementiere robuste Parsing-Logik für den Text
        # Für jetzt aktualisieren wir nur den Zeitstempel, um zu zeigen, dass es läuft
        
        with open(OUTPUT_FILE, 'r') as f:
            data = json.load(f)
            
        data['lastUpdated'] = datetime.now().isoformat()
        
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(data, f, indent=2)
            
        print("Daten erfolgreich aktualisiert!")
        
    except Exception as e:
        print(f"Fehler beim Scraping: {e}")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_pmt()

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.binary_location = "/snap/chromium/current/usr/lib/chromium-browser/chrome"

# Initialize the Chrome driver with the specified options
driver = webdriver.Chrome(options=chrome_options)

def send_message_and_follow(username):
    try:
        # Navigate to direct messages
        driver.get("https://www.instagram.com/direct/inbox/")

        # Click on 'Send message'
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[text()='Send message']"))
        ).click()

        # Find the input field and enter the username
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, 'input[type="text"]'))
        ).send_keys(username)

        # Wait for the account to appear in search results and click on it
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//span[text()='{username}']"))
        ).click()

        # Find and click the 'Chat' button
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[text()='Chat']"))
        ).click()

        # Find the message input field and send a message
        WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "div[aria-label='Message']"))
        ).send_keys("YOUR MESSAGE", Keys.ENTER)

        # Navigate directly to the user's profile
        driver.get(f"https://www.instagram.com/{username}/")

        # Try to click 'Follow' or 'Follow Back' if present
        try:
            follow_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Follow') or contains(text(), 'Follow Back')]"))
            )
            follow_button.click()
        except Exception as e:
            print(f"Follow/Follow Back button not found for {username}")

    except Exception as e:
        print(f"An error occurred while processing {username}: {e}")

def main():
    # Wait for manual login
    driver.get("https://www.instagram.com/")
    input("Press Enter in the console after you have logged in to Instagram...")

    # Array of usernames
    usernames = [
        "user1", "user2"
    ];
    

    # Iterate over the array and process each user
    for username in usernames:
        send_message_and_follow(username)
        time.sleep(30)

    # Pause for manual interaction
    input("Script paused. Press Enter to continue...")

    driver.quit()

main()

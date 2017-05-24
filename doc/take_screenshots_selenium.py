# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

### INSTALLATION:
# conda create --name selenium python=2
# conda install selenium
# # download 'geckodriver' https://github.com/mozilla/geckodriver/releases and add to PATH
# # now run
# source activate selenium
# python take_screenshot_selenium.py

class Test(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://localhost:3141/app.php"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_(self):
        driver = self.driver
        driver.get(self.base_url + "/1.0/startpage")
        driver.get_screenshot_as_file("screenshots/startpage.png")
        driver.find_element_by_link_text("Home").click()
        driver.get(self.base_url + "/login-demo")
        driver.find_element_by_id("username").clear()
        driver.find_element_by_id("username").send_keys("demo")
        driver.find_element_by_id("password").clear()
        driver.find_element_by_id("password").send_keys("demo")
        driver.find_element_by_css_selector("button[type=\"submit\"]").click()
        driver.find_element_by_link_text("Projects").click()
        driver.find_element_by_xpath("//input[@type='search']").clear()
        driver.get_screenshot_as_file("screenshots/projects.png")
        driver.find_element_by_link_text("No Table ID").click()
        driver.find_element_by_id("project-overview-table-id")
        driver.find_element_by_xpath("//*[contains(text(),'1002')]")
        time.sleep(1)
        driver.get_screenshot_as_file("screenshots/project_details.png")
        driver.find_element_by_link_text("Organisms").click()
        driver.find_element_by_id("search_organism").clear()
        driver.get_screenshot_as_file("screenshots/organisms.png")
        driver.find_element_by_id("search_organism").send_keys("Bellis")
        driver.find_element_by_id("btn_search_organism").click()
        driver.find_element_by_xpath("//div[@id='page-wrapper']/div[5]/div/div[2]/div/div/a[2]/span/i").click()
        driver.find_element_by_xpath("(//a[contains(text(),'Traits')])[2]").click()
        driver.find_element_by_id("toggleCitationButton").click()
        driver.find_element_by_link_text("Taxonomy").click()
        driver.get(self.base_url + "/1.0/trait/overview")
        driver.get(self.base_url + "css=div.clearfix")

    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True

    def is_alert_present(self):
        try: self.driver.switch_to_alert()
        except NoAlertPresentException as e: return False
        return True

    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally: self.accept_next_alert = True

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()

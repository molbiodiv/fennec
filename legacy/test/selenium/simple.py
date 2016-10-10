# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

class Simple(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "http://132.187.21.191/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_simple(self):
        driver = self.driver
        driver.get(self.base_url + "/")
        driver.find_element_by_link_text("Home").click()
        driver.find_element_by_link_text("Projects").click()
        Select(driver.find_element_by_name("otu_project_length")).select_by_visible_text("25")
        driver.find_element_by_link_text("Next").click()
        driver.find_element_by_link_text("Communities").click()
        driver.find_element_by_link_text("2").click()
        Select(driver.find_element_by_name("otu_community_length")).select_by_visible_text("25")
        driver.find_element_by_link_text("Organisms").click()
        driver.find_element_by_link_text("Search").click()
        driver.find_element_by_link_text("Search for Organisms").click()
        driver.find_element_by_id("search_organism").clear()
        driver.find_element_by_id("search_organism").send_keys("Thermopsis")
        driver.find_element_by_id("btn_search_organism").click()
        driver.find_element_by_xpath("//button[@type='button']").click()
        driver.find_element_by_xpath("//div[@id='wrapper']/nav/ul/div/div/ul/li[2]/a/span[2]").click()
        Select(driver.find_element_by_id("dbVersionPicker")).select_by_visible_text("plants")
        driver.find_element_by_xpath("//div[@id='page-wrapper']/div[6]/div/div[2]/div/div[2]/a[2]/span/i").click()
        driver.find_element_by_link_text("Overview").click()
        driver.find_element_by_link_text("Traits").click()
        driver.find_element_by_link_text("Taxonomy").click()
        driver.find_element_by_xpath("(//a[contains(text(),'Traits')])[2]").click()
        driver.find_element_by_xpath("(//a[contains(text(),'Search')])[2]").click()
        #driver.find_element_by_xpath("//div[@id='page-wrapper']/div[2]/div[6]/div/a/div/div").click()
        #driver.find_element_by_css_selector("a.fancybox-item.fancybox-close").click()
        driver.find_element_by_link_text("Search for Traits").click()
        driver.find_element_by_id("search_trait").clear()
        driver.find_element_by_id("search_trait").send_keys("flower")
        driver.find_element_by_css_selector("a.fancybox > span").click()
        driver.find_element_by_css_selector("rect.legendtoggle").click()
        driver.find_element_by_css_selector("a.fancybox-close").click()
    
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

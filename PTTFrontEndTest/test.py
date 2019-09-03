import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
import time
import sys
#if you want to run this code, your computer should be in good connection with internet.

#Driver path need to be changed according to your own path, using test.sh can help you 
#download chromedriver to the current directory, so you won't need to change the following 
#path. If experienced an error while using test.sh, download chromedriver manually and 
# modify the `chromedriver_path` to the correspond file path.
chromedriver_path = "/usr/bin/chromedriver"

# Enter the server url by `python test2.py <url>`. Changing url here won't affect anything
server_url = None
implicitly_wait_time = 1
sleep_time = 0.5


class FrontendTest(unittest.TestCase):
    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument("--no-sandbox")
        #self.driver = webdriver.Chrome("/Users/liuhao/Downloads/chromedriver", chrome_options=options)
        self.driver = webdriver.Chrome(chromedriver_path, chrome_options=options)
        self.driver.implicitly_wait(implicitly_wait_time)
        self.driver.get(server_url)
        #from main page to admin page
        self.driver.find_element_by_name("p").click()
        self.delete_all_users()

        # Admin Test set up ends here
        if self.test_type == 'admin': return
        self.initial_user()
        self.driver.find_element_by_link_text("Administrator").click()
        # Make sure dropdown is dropped
        self.driver.find_element_by_xpath("//li[@class='dropdown show nav-item']")
        self.driver.find_element_by_link_text("John Snow").click()

    def delete_all_users(self):
        driver = self.driver
        curflag = self.isElementExist("DeleteUsers")
        while curflag == True:
            # time.sleep(3)
            driver.find_element_by_name("DeleteUsers").send_keys("\n")
            time.sleep(sleep_time)
            if "Warning" in driver.page_source:
                driver.find_element_by_name("ConfirmDelete").send_keys("\n")
            time.sleep(sleep_time)
            curflag = self.isElementExist("DeleteUsers")
        

    def initial_user(self):
        driver = self.driver
        driver.find_element_by_name("AddUser").click()
        driver.find_element_by_name("firstName").clear()
        driver.find_element_by_name("firstName").send_keys("John")
        driver.find_element_by_name("lastName").clear()
        driver.find_element_by_name("lastName").send_keys("Snow")
        driver.find_element_by_name("email").clear()
        driver.find_element_by_name("email").send_keys("johnSnow@example.com")
        driver.find_element_by_name("p").click()
        #check we are back to admin page
        driver.find_element_by_name("Admin")
    
    def initial_project(self):
        driver = self.driver
        driver.find_element_by_name("AddProject").click()
        driver.find_element_by_name("projectname").clear()
        driver.find_element_by_name("projectname").send_keys("Kill White Walker")
        driver.find_element_by_name("q").click()
        #check we are back to user page
        driver.find_element_by_name("User")

    def isElementExist(self, element):
        flag=True
        driver=self.driver
        try:

            driver.find_element_by_name(element)
            return flag
        except:
            flag=False
            return flag

    def tearDown(self):
        self.driver.close()


class FrontendAdminTest(FrontendTest):
    test_type = "admin"
    #Tests for Admin
    def test_add_user(self):

        driver = self.driver
        #cancel add
        driver.find_element_by_name("AddUser").click()
        driver.find_element_by_name("firstName").clear()
        driver.find_element_by_name("firstName").send_keys("Khal")
        driver.find_element_by_name("lastName").clear()
        driver.find_element_by_name("lastName").send_keys("Drogo")
        driver.find_element_by_name("email").clear()
        driver.find_element_by_name("email").send_keys("KhalDrogo@example.com")
        driver.find_element_by_name("Cancel").click()
        #check we are back to admin page
        driver.find_element_by_name("Admin")
        assert "Khal" not in driver.page_source
        assert "Drogo" not in driver.page_source
        assert "KhalDrogo@example.com" not in driver.page_source

        #successfully add
        driver.find_element_by_name("AddUser").click()
        driver.find_element_by_name("firstName").clear()
        driver.find_element_by_name("firstName").send_keys("Khal")
        driver.find_element_by_name("lastName").clear()
        driver.find_element_by_name("lastName").send_keys("Drogo")
        driver.find_element_by_name("email").clear()
        driver.find_element_by_name("email").send_keys("KhalDrogo@example.com")
        driver.find_element_by_name("p").click()
        #check we are back to admin page
        driver.find_element_by_name("Admin")

        assert "Khal" in driver.page_source
        assert "Drogo" in driver.page_source
        assert "KhalDrogo@example.com" in driver.page_source

        #unique email addresses
        driver.find_element_by_name("AddUser").click()
        driver.find_element_by_name("firstName").clear()
        driver.find_element_by_name("firstName").send_keys("Noaa")
        driver.find_element_by_name("lastName").clear()
        driver.find_element_by_name("lastName").send_keys("Smith")
        driver.find_element_by_name("email").clear()
        driver.find_element_by_name("email").send_keys("KhalDrogo@example.com")
        driver.find_element_by_name("p").click()
        time.sleep(sleep_time)
        driver.switch_to.alert.accept()
        #check we are on the same page 
        driver.find_element_by_name("testEditUser")


    def test_edit_user(self):
        driver = self.driver
        # First creat a user
        self.initial_user()
        #cancel edit
        driver.find_element_by_name("EditUsers").click()
        driver.find_element_by_name("firstName").clear()
        driver.find_element_by_name("firstName").send_keys("Tyrion")
        driver.find_element_by_name("lastName").clear()
        driver.find_element_by_name("lastName").send_keys("Lannister")
        # driver.find_element_by_name("email").clear()
        # driver.find_element_by_name("email").send_keys("TyrionLannister@example.com")
        driver.find_element_by_name("Cancel").click()
        #check we are back to admin page
        time.sleep(sleep_time)
        driver.find_element_by_name("Admin")
        assert "Tyrion" not in driver.page_source
        assert "Lannister" not in driver.page_source
        # assert "johnSnow@example.com" in driver.page_source

        #successfully edit
        driver.find_element_by_name("EditUsers").click()
        driver.find_element_by_name("firstName").clear()
        driver.find_element_by_name("firstName").send_keys("Tyrion")
        driver.find_element_by_name("lastName").clear()
        driver.find_element_by_name("lastName").send_keys("Lannister")
        # driver.find_element_by_name("email").clear()
        # driver.find_element_by_name("email").send_keys("johnSnow@example.com")
        driver.find_element_by_name("p").click()
        #check we are back to admin page
        driver.find_element_by_name("Admin")
        assert "Tyrion" in driver.page_source
        assert "Lannister" in driver.page_source
        # assert "johnSnow@example.com" in driver.page_source

        # email addresses can't be edit
        # driver.find_element_by_name("EditUsers").click()
        # driver.find_element_by_name("firstName").clear()
        # driver.find_element_by_name("firstName").send_keys("Tyrion")
        # driver.find_element_by_name("lastName").clear()
        # driver.find_element_by_name("lastName").send_keys("Lannister")
        # driver.find_element_by_name("email").clear()
        # driver.find_element_by_name("email").send_keys("TyrionLannister@example.com")
        # driver.find_element_by_name("p").click()
        #check we are back to admin page
        # time.sleep(1)
        # driver.find_element_by_name("Admin")
        # assert "TyrionLannister@example.com" not in driver.page_source


    def test_delete_user(self):
        driver = self.driver
        # First create a user and create a project for it
        self.initial_user()
        driver.find_element_by_link_text("Administrator").click()
        # Make sure dropdown is dropped
        driver.find_element_by_xpath("//li[@class='dropdown show nav-item']")
        driver.find_element_by_link_text("John Snow").click()
        driver.find_element_by_name("AddProject").click()
        driver.find_element_by_name("projectname").clear()
        driver.find_element_by_name("projectname").send_keys("Start The War")
        driver.find_element_by_name("q").click()
        #check we are back to user page
        driver.find_element_by_name("User")
        driver.find_element_by_link_text("John Snow").click()
        # Make sure dropdown is dropped
        driver.find_element_by_xpath("//li[@class='dropdown show nav-item']")
        driver.find_element_by_link_text("Administrator").click()
        #check we are back to admin page
        driver.find_element_by_name("Admin")

        #cancel delete if Warning shows
        driver.find_element_by_name("DeleteUsers").click()
        driver.find_element_by_name("DeletePopup")
        assert "Warning" in driver.page_source
        driver.find_element_by_name("Cancel").click()
        time.sleep(sleep_time)
        assert "johnSnow@example.com" in driver.page_source


        #successfully delete
        driver.find_element_by_name("DeleteUsers").click()
        driver.find_element_by_name("DeletePopup")
        assert "Warning" in driver.page_source
        driver.find_element_by_name("ConfirmDelete").click()
        time.sleep(sleep_time)
        assert "johnSnow@example.com" not in driver.page_source

        #Create a user without project
        self.initial_user()

        #Delete directly
        driver.find_element_by_name("DeleteUsers").click()
        time.sleep(sleep_time)
        assert "johnSnow@example.com" not in driver.page_source


class FrontendUserTest(FrontendTest):
    test_type = "user"
    def test_add_project(self):
 
        driver = self.driver
        #cancel add
        driver.find_element_by_name("AddProject").click()
        driver.find_element_by_name("projectname").clear()
        driver.find_element_by_name("projectname").send_keys("Start The War")
        driver.find_element_by_name("Cancel").click()
        #check we are back to user page
        driver.find_element_by_name("User")
        assert "Start The War" not in driver.page_source

        #successfully add
        driver.find_element_by_name("AddProject").click()
        driver.find_element_by_name("projectname").clear()
        driver.find_element_by_name("projectname").send_keys("Start The War")
        driver.find_element_by_name("q").click()
        #check we are back to user page
        driver.find_element_by_name("User")
        assert "Start The War" in driver.page_source

        #unique project name#not implemented
        driver.find_element_by_name("AddProject").click()
        driver.find_element_by_name("projectname").clear()
        driver.find_element_by_name("projectname").send_keys("Start The War")
        driver.find_element_by_name("q").click()
        time.sleep(sleep_time)
        driver.switch_to.alert.accept()
        #check we are on the same page add project page
        driver.find_element_by_name("testAddProject")

    def test_edit_project(self):
        driver = self.driver
        self.initial_project()

        #cancel edit
        driver.find_element_by_name("EditProject").click()
        time.sleep(sleep_time)
        driver.find_element_by_name("projectname").clear()
        driver.find_element_by_name("projectname").send_keys("Fucking test")

        driver.find_element_by_name("Cancel").click()
        time.sleep(sleep_time)
        #check we are back to user page
        driver.find_element_by_name("User")
        assert "Fucking test" not in driver.page_source


        #successfully edit
        driver.find_element_by_name("EditProject").click()
        time.sleep(sleep_time)
        driver.find_element_by_name("projectname").clear()
        driver.find_element_by_name("projectname").send_keys("Fucking test")
        driver.find_element_by_name("q").click()
        #check we are back to admin page
        time.sleep(sleep_time)
        driver.find_element_by_name("User")
        assert "Fucking test" in driver.page_source

    def test_delete_project(self):
        driver = self.driver
        # initialize a project for the user
        self.initial_project()
        # add pomodoro to it (Will be implement in the next set of user stories)
        driver.find_element_by_name("AddPomodoro").click()
        driver.find_element_by_name("ConfirmAssociate").click()
        driver.find_element_by_name("StartPomodoro").click()
        driver.find_element_by_name("StartPomo").click()
        driver.find_element_by_name("TerminatePomo").click()
        driver.find_element_by_name("ConfirmPut").click()
        #cancel delete
        driver.find_element_by_name("DeleteProject").click()
        driver.find_element_by_name("DeletePopup")
        assert "Warning" in driver.page_source
        driver.find_element_by_name("Cancel").click()
        time.sleep(sleep_time)
        assert "Kill White Walker" in driver.page_source

        #successfully delete
        driver.find_element_by_name("DeleteProject").click()
        driver.find_element_by_name("DeletePopup")
        assert "Warning" in driver.page_source
        driver.find_element_by_name("ConfirmDelete").click()
        time.sleep(sleep_time)
        assert "Kill White Walker" not in driver.page_source

        # initialize a project for the user without pomodoro
        self.initial_project()
        driver.find_element_by_name("DeleteProject").click()
        time.sleep(sleep_time)
        assert "Kill White Walker" not in driver.page_source

class FrontendPomodoroTest(FrontendTest):
    test_type = "pomo"
    def test_creat_pomodoro(self):
        driver = self.driver
        self.initial_project()
        #Associate pomo with a project
        driver.find_element_by_name("AddPomodoro").click()
        #make sure pomodoro popup shows up
        driver.find_element_by_name("PomodoroPopup")
        assert "Wanna associate a project?" in driver.page_source
        driver.find_element_by_name("ConfirmAssociate").click()
        # check we are back to associate page
        driver.find_element_by_name("Associate")
        driver.find_element_by_name("StartPomodoro").click()
        # check we are back to pomodoro page
        driver.find_element_by_name("Pomodoro")
        assert "Pomodoro ends in:" in driver.page_source

        #One time pomo
        driver.get(server_url)
        driver.find_element_by_name("p").click()
        driver.find_element_by_link_text("Administrator").click()
        # Make sure dropdown is dropped
        self.driver.find_element_by_xpath("//li[@class='dropdown show nav-item']")
        driver.find_element_by_link_text("John Snow").click()
        driver.find_element_by_name("AddPomodoro").click()
        driver.find_element_by_name("PomodoroPopup")
        assert "Wanna associate a project?" in driver.page_source
        driver.find_element_by_name("noAssociate").click()
        driver.find_element_by_name("Pomodoro")
        assert "Pomodoro ends in:" in driver.page_source

    def test_terminate_pomodoro_withLog(self):
        #terminate a pomodoro before it completes and log part time into project
        driver = self.driver
        self.initial_project()
        driver.find_element_by_name("AddPomodoro").click()
        driver.find_element_by_name("ConfirmAssociate").click()
        driver.find_element_by_name("StartPomodoro").click()
        driver.find_element_by_name("StartPomo").click()
        driver.find_element_by_name("TerminatePomo").click()
        driver.find_element_by_name("ConfirmPut").click()
        #to see whether session has already logged into this project
        #if so, warning message will show up
        driver.find_element_by_name("DeleteProject").click()
        driver.find_element_by_name("DeletePopup")
        assert "Warning" in driver.page_source
        driver.find_element_by_name("ConfirmDelete").click()

    def test_terminate_pomodoro_withoutLog(self):
        #terminate a pomodoro before it completes and log part time into project
        driver = self.driver
        self.initial_project()
        driver.find_element_by_name("AddPomodoro").click()
        driver.find_element_by_name("ConfirmAssociate").click()
        driver.find_element_by_name("StartPomodoro").click()
        driver.find_element_by_name("StartPomo").click()
        driver.find_element_by_name("TerminatePomo").click()
        driver.find_element_by_name("NoPut").click()
        #this time, pomo is not logged into project, no warnning message will show when delete project
        driver.find_element_by_name("DeleteProject").click()
        time.sleep(sleep_time)
        assert "Warning" not in driver.page_source

    #For the following two test, since pomodoro will complete after 30 minutes, It is not possible
    # to test user story 7, or it is very ineffienct to do so. For this reason, we have skip these
    # test case. In the future, if we can set the testing environment, like setting the pomodoro 
    # time to five second, we will consider to reimplement it.
    def test_pomodoro_end_withLog(self):
        # need implement
        pass

    def test_pomodoro_end_withoutLog(self):
        # need implement
        pass

class FrontendReportTest(FrontendTest):
    # need implement
    test_type="report"

    def test_get_report1(self):
        #with parameters count and total_time
        driver = self.driver
        self.initial_project()
        driver.find_element_by_name("AddPomodoro").click()
        driver.find_element_by_name("ConfirmAssociate").click()
        driver.find_element_by_name("StartPomodoro").click()
        driver.find_element_by_name("StartPomo").click()
        time.sleep(5)
        driver.find_element_by_name("TerminatePomo").click()
        driver.find_element_by_name("ConfirmPut").click()
        time.sleep(sleep_time)
        driver.find_element_by_name("GenerateReport").click()
        s1 = Select(driver.find_element_by_id('projectId'))
        s1.select_by_visible_text("Kill White Walker")
        
        driver.find_element_by_name("startDatetime").clear()
        driver.find_element_by_name("startDatetime").send_keys("2019-01-01T20:00Z")
        driver.find_element_by_name("endDatetime").clear()
        driver.find_element_by_name("endDatetime").send_keys("2020-01-01T20:00Z")
        driver.find_element_by_name("p").click()
        time.sleep(sleep_time)
        tr_list = driver.find_elements_by_tag_name("tr")

        assert len(tr_list) == 5 # 4 in thead and 1 in tbody

    def test_get_report1(self):
        #with parameters count and total_time
        driver = self.driver
        self.initial_project()
        driver.find_element_by_name("AddPomodoro").click()
        driver.find_element_by_name("ConfirmAssociate").click()
        driver.find_element_by_name("StartPomodoro").click()
        driver.find_element_by_name("StartPomo").click()
        time.sleep(5)
        driver.find_element_by_name("TerminatePomo").click()
        driver.find_element_by_name("ConfirmPut").click()
        time.sleep(sleep_time)
        driver.find_element_by_name("GenerateReport").click()
        s1 = Select(driver.find_element_by_id('projectId'))
        s1.select_by_visible_text("Kill White Walker")
        
        driver.find_element_by_name("startDatetime").clear()
        driver.find_element_by_name("startDatetime").send_keys("2019-01-01T20:00Z")
        driver.find_element_by_name("endDatetime").clear()
        driver.find_element_by_name("endDatetime").send_keys("2020-01-01T20:00Z")
        driver.find_element_by_name("p").click()
        time.sleep(sleep_time)
        assert "PPT Report" in driver.page_source
        assert "The number of Pomodoros: 1" in driver.page_source
        assert "The total number of hours: 0" in driver.page_source

    def test_get_report2(self):
        #without parameter count and with total_time
        driver = self.driver
        self.initial_project()
        driver.find_element_by_name("AddPomodoro").click()
        driver.find_element_by_name("ConfirmAssociate").click()
        driver.find_element_by_name("StartPomodoro").click()
        driver.find_element_by_name("StartPomo").click()
        time.sleep(5)
        driver.find_element_by_name("TerminatePomo").click()
        driver.find_element_by_name("ConfirmPut").click()
        time.sleep(sleep_time)
        driver.find_element_by_name("GenerateReport").click()
        s1 = Select(driver.find_element_by_id('projectId'))
        s1.select_by_visible_text("Kill White Walker")

        driver.find_element_by_name("startDatetime").clear()
        driver.find_element_by_name("startDatetime").send_keys("2019-01-01T20:00Z")
        driver.find_element_by_name("endDatetime").clear()
        driver.find_element_by_name("endDatetime").send_keys("2020-01-01T20:00Z")
        driver.find_element_by_name("showPomoNum").click()
        driver.find_element_by_name("p").click()
        time.sleep(sleep_time)
        assert "PPT Report" in driver.page_source
        assert "The number of Pomodoros: 1" not in driver.page_source
        assert "The total number of hours: 0" in driver.page_source


    def test_get_report3(self):
        #with parameter count and without total_time
        driver = self.driver
        self.initial_project()
        driver.find_element_by_name("AddPomodoro").click()
        driver.find_element_by_name("ConfirmAssociate").click()
        driver.find_element_by_name("StartPomodoro").click()
        driver.find_element_by_name("StartPomo").click()
        time.sleep(5)
        driver.find_element_by_name("TerminatePomo").click()
        driver.find_element_by_name("ConfirmPut").click()
        time.sleep(sleep_time)
        driver.find_element_by_name("GenerateReport").click()
        s1 = Select(driver.find_element_by_id('projectId'))
        s1.select_by_visible_text("Kill White Walker")
        
        driver.find_element_by_name("startDatetime").clear()
        driver.find_element_by_name("startDatetime").send_keys("2019-01-01T20:00Z")
        driver.find_element_by_name("endDatetime").clear()
        driver.find_element_by_name("endDatetime").send_keys("2020-01-01T20:00Z")
        driver.find_element_by_name("showTotalHours").click()
        driver.find_element_by_name("p").click()
        time.sleep(sleep_time)
        assert "PPT Report" in driver.page_source
        assert "The number of Pomodoros: 1" in driver.page_source
        assert "The total number of hours: 0" not in driver.page_source

    def test_get_report4(self):
        #without parameter count and total_time
        driver = self.driver
        self.initial_project()
        driver.find_element_by_name("AddPomodoro").click()
        driver.find_element_by_name("ConfirmAssociate").click()
        driver.find_element_by_name("StartPomodoro").click()
        driver.find_element_by_name("StartPomo").click()
        time.sleep(5)
        driver.find_element_by_name("TerminatePomo").click()
        driver.find_element_by_name("ConfirmPut").click()
        time.sleep(sleep_time)
        driver.find_element_by_name("GenerateReport").click()
        s1 = Select(driver.find_element_by_id('projectId'))
        s1.select_by_visible_text("Kill White Walker")
        
        driver.find_element_by_name("startDatetime").clear()
        driver.find_element_by_name("startDatetime").send_keys("2019-01-01T20:00Z")
        driver.find_element_by_name("endDatetime").clear()
        driver.find_element_by_name("endDatetime").send_keys("2020-01-01T20:00Z")
        driver.find_element_by_name("showPomoNum").click()
        driver.find_element_by_name("showTotalHours").click()
        driver.find_element_by_name("p").click()
        time.sleep(sleep_time)
        assert "PPT Report" in driver.page_source
        assert "The number of Pomodoros: 1" not in driver.page_source
        assert "The total number of hours: 0" not in driver.page_source


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print ("Usage: python test.py <url>")
        exit(1)
    server_url = sys.argv[1]
    del sys.argv[1:]
    unittest.main()

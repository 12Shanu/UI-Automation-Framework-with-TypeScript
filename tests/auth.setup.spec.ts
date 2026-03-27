import {test as setup,expect} from "@playwright/test"
import logindata from "../testdata/logindata.json"
import { LoginPage } from "../pages/LoginPage"

setup("Authentication User", async({page}) => {
    
    const loginPage = new LoginPage(page)
    
    await loginPage.navigateUrl()
    await expect(loginPage.username).toBeVisible()
    await loginPage.userLogin(logindata.username, logindata.password)
    
    await page.waitForURL(/dashboard/)

    await page.context().storageState({path: 'storage/auth.json'})

})
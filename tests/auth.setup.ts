import{test as setup,expect} from "../fixture/testfixture"

setup("Authentication User", async({loginPage,page,loginData}) => {
      
    await loginPage.navigateUrl(page)
    await expect(loginPage.username).toBeVisible()
    await loginPage.userLogin(loginData.username, loginData.password)
    
    await page.waitForURL(/dashboard/)

    await page.context().storageState({path: 'storage/auth.json'})

})
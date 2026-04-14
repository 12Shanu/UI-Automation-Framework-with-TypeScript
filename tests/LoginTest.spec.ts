import {test,expect} from "../fixture/testfixture"

test.beforeEach(async ({loginPage,page})=>{
    await loginPage.navigateUrl(page)
})

test("Verify Login With Valid Credential", async ({loginPage, loginData,page}) =>{
    await loginPage.userLogin(loginData.username, loginData.password)
    await expect(page).toHaveURL(/dashboard/)
})

test("Verify Login With InValid Credential", async ({loginPage, loginData,page}) =>{
    await loginPage.userLogin(loginData.invaliduser, loginData.password)
    await expect(page.getByText('Invalid credentials', { exact: true })).toBeVisible()
})

test("Verify Forgot Functionality", async ({loginPage, loginData, page}) =>{
    await loginPage.forgotPassword(page, loginData.username)
})

test("Validation Check for Manadatory Fields", async ({loginPage,loginData}) => {
    await loginPage.submitbtn.click()
    await loginPage.validationCheck()
})
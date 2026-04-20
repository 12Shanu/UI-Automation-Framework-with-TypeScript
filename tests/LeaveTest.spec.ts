import {test,expect} from "../fixture/testfixture"

test.beforeEach(async ({loginPage,dashboardPage,page})=>{
    await loginPage.navigateUrl(page)
    await dashboardPage.moduleClick('Leave')
    await expect(page).toHaveURL(/leave\/viewLeaveList/)
})

test.skip("Verify Apply Leave Functionality", async ({leavePage,page})=>{
    await leavePage.applyLeave(page)
})

test("Verify Assign Leave Functionality", async ({leavePage,page})=>{
    await leavePage.assignLeave(page)
})

test("Verify Mandatory Fields", async ({leavePage,page})=>{
    await leavePage.mandatoryFieldValidate(page)
})
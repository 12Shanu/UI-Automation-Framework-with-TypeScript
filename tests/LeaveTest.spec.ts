import {test,expect} from "../fixture/testfixture"

test.beforeEach(async ({dashboardPage,page})=>{
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

test("Verify Add Leave Entitlement With Individual Employee", async ({leavePage})=>{
    await leavePage.addLeaveEntitlementWithIndividualEmployee()
})
import{test,expect} from "../fixture/testfixture"

test.beforeEach(async ({page,dashboardPage}) => {
    await dashboardPage.moduleClick('PIM')
    await expect(page).toHaveURL(/pim\/viewEmployeeList/)
})

test("Verify To Add New Employee Without LoginDetails @integration", async ({page,pimPage,employee}) =>{
    await pimPage.searchEmployeeByID(employee.employeeId,page)
})

test.skip("Serach From Table", async ({page,pimPage,employee}) =>{
    await pimPage.selectAndClickEmployee(page, employee.employeeId)
})

test("Verify To Add PersonalDetails @integration",async ({pimdata,page,pimPage,employee}) => {
    await pimPage.searchEmployeeByID(employee.employeeId,page)
    await pimPage.editUser(page,employee.employeeId)
    await pimPage.addPersonalDetails(pimdata.updatedfirstname,pimdata.otherid,pimdata.licensenum,pimdata.licexpdate,page,pimdata.dob)
    await pimPage.linkClick("Employee List")
    await pimPage.searchEmployeeByID(employee.employeeId,page)
    const fm=await page.locator("//div[@class='oxd-table-body']/div/div/div[3]/div").textContent()
    console.log("expected:"+fm)
    expect(fm).toContain(pimdata.updatedfirstname)
})

test("Verify To Add Duplicate Employee ID @regression", async({page,pimPage,employee}) =>{
    await pimPage.add_btn.click()
    await pimPage.employeeid.fill(employee.employeeId)
    await pimPage.save_btn.click()
    await expect(page.getByText('Employee Id already exists')).toBeVisible()
})

test.only("Verify to Validate Mandatory Fields @regression", async ({page,pimPage}) => {
    await pimPage.add_btn.click()
    await pimPage.save_btn.click()
    await expect(page.locator('div').filter({ hasText: 'Required' }).first()).toBeVisible()
    await expect(page.locator('span').filter({ hasText: 'Required' }).last()).toBeVisible()
})

test("Search By Employee Name @regression", async ({page,pimPage}) => {
    await pimPage.hintname.isVisible()
    await pimPage.searchByEmployeeName(page)
})
import{test,expect} from "../fixture/testfixture"
import { PIMPage } from "../pages/PIMPage"

let pimpage : PIMPage

test.beforeEach(async ({page,loginPage,dashboardPage}) => {
    pimpage = new PIMPage(page)
    await loginPage.navigateUrl()
    await dashboardPage.moduleClick('PIM')
    await expect(page).toHaveURL(/pim\/viewEmployeeList/)
})

test.describe("PIM MODULE TEST CASES", () =>{

test("Verify To Add New Employee Without LoginDetails", async ({pimdata,page}) =>{
    await pimpage.addEmployeeWithoutLoginDetails(page, pimdata.firstname, pimdata.middlename, pimdata.lastname,pimdata.employeeid)
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible()
    await pimpage.linkClick("Employee List")
    await pimpage.searchEmployeeByID(pimdata.employeeid,page)
    await pimpage.deleteEmployee(page,pimdata.employeeid)
})

test("Serach From Table", async ({pimdata,page}) =>{
    await pimpage.selectAndClickEmployee(page, pimdata.employeeid)
})

test("Verify To Add PersonalDetails",async ({pimdata,page}) => {
    await pimpage.addEmployeeWithoutLoginDetails(page, pimdata.firstname, pimdata.middlename, pimdata.lastname,pimdata.employeeid)
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible()
    await pimpage.linkClick("Employee List")
    await pimpage.searchEmployeeByID(pimdata.employeeid,page)
    await pimpage.editUser(page,pimdata.employeeid)
    await pimpage.addPersonalDetails(pimdata.otherid,pimdata.licensenum,pimdata.licexpdate,page,pimdata.dob)
    await pimpage.linkClick("Employee List")
})

test("Verify To Add Duplicate Employee ID", async({pimdata,page}) =>{
    await pimpage.add_btn.click()
    await pimpage.employeeid.fill(pimdata.employeeid)
    await pimpage.save_btn.click()
    await expect(page.getByText('Employee Id already exists')).toBeVisible()
})

test("Verify to Validate Mandatory Fields", async ({page}) => {
    await pimpage.add_btn.click()
    await pimpage.save_btn.click()
    await expect(page.locator('div').filter({ hasText: 'Required' }).first()).toBeVisible()
    await expect(page.locator('span').filter({ hasText: 'Required' }).last()).toBeVisible()
})

})
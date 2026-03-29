import{test,expect} from "../fixture/testfixture"
import { PIMPage } from "../pages/PIMPage"

let pimpage : PIMPage

test.beforeEach(async ({page,loginPage,dashboardPage}) => {
    pimpage = new PIMPage(page)
    await loginPage.navigateUrl()
    await dashboardPage.moduleClick('PIM')
    await expect(page).toHaveURL(/pim\/viewEmployeeList/)
})

test.describe.serial("PIM MODULE TEST CASES", () =>{

test("Verify To Add New Employee Without LoginDetails", async ({pimdata,page}) =>{
    await pimpage.addEmployeeWithoutLoginDetails(page, pimdata.firstname, pimdata.middlename, pimdata.lastname,pimdata.employeeid)
})

test.skip("Verify To Search By Employee ID", async({pimdata,page})=>{
    await pimpage.searchEmployeeByID(pimdata.employeeid)
    //pimpage.selectAndClickEmployee(page, pimdata.employeeid)
})

test.skip("Serach From Table", async ({pimdata,page}) =>{
    await pimpage.selectAndClickEmployee(page, pimdata.employeeid)
})

test("Verify To Add PersonalDetails",async ({pimdata,page}) => {
    await pimpage.searchEmployeeByID(pimdata.employeeid)
    await pimpage.editUser(page,pimdata.employeeid)
    await pimpage.addPersonalDetails(pimdata.otherid,pimdata.licensenum,pimdata.licexpdate,page,pimdata.dob)
    await pimpage.linkClick("Employee List")
})

test("Verify to Delete Employee", async ({pimdata,page})=>{
    await pimpage.searchEmployeeByID(pimdata.employeeid)
    await pimpage.deleteEmployee(page,pimdata.employeeid)
})

})
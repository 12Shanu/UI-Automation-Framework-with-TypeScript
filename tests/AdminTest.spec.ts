import{test,expect} from "../fixture/testfixture"

test.beforeEach(async ({page,loginPage,dashboardPage}) => {
    await loginPage.navigateUrl()
    await dashboardPage.moduleClick('Admin')
    await expect(page).toHaveURL(/admin\/viewSystemUsers/)
})

test("Add New User", async ({adminpage,admindata, page}) =>{
    await adminpage.addUser(page,admindata.username,admindata.password,admindata.confirmpassword)
    await adminpage.searchByUsername(admindata.username,page)
    await adminpage.deleteUser(admindata.username,page)
})

test.only("Search By EmployeeName", async ({adminpage,admindata,page})=>{
    await adminpage.searchByEmployeeName(page,admindata.username)
})
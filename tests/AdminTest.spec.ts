import{test,expect} from "../fixture/testfixture"

test.beforeEach(async ({page,dashboardPage}) => {
    await dashboardPage.moduleClick('Admin')
    await expect(page).toHaveURL(/admin\/viewSystemUsers/)
})

test("Add New User", async ({adminpage,admindata, page,username}) =>{
    await adminpage.addUser(page,username.userId,admindata.password,admindata.confirmpassword)
    await adminpage.searchByUsername(username.userId,page)
    await adminpage.deleteUser(username.userId,page)
})

test("Search By EmployeeName", async ({adminpage,username,page})=>{
    await adminpage.searchByEmployeeName(page)
})
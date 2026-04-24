import{test as base,expect} from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import loginData from "../testdata/logindata.json"
import pimdata from "../testdata/pimdata.json"
import {DashboardPage} from "../pages/DashboardPage"
import { PIMPage } from "../pages/PIMPage"
import { generateEmployeeId,generateUsername } from "../util/dataUtil"
import admindata from "../testdata/admindata.json"
import { AdminPage } from "../pages/AdminPage"
import { LeavePage } from "../pages/LeavePage"

type MyFixture={
    loginPage:LoginPage
    loginData: typeof loginData
    pimdata: typeof pimdata
    dashboardPage : DashboardPage
    pimPage:PIMPage
    employee: {
    employeeId: string
    }
    username: {
    userId: string
    }
    admindata: typeof admindata
    adminpage: AdminPage
    leavePage: LeavePage
}

export const test = base.extend<MyFixture>({
  loginPage : async ({page}, use) => {
    const loginPage = new LoginPage(page)
    await use(loginPage)
  },

  dashboardPage : async ({page},use) =>{
    const dashboardPage = new DashboardPage(page)
    await page.goto('/web/index.php/dashboard/index')
    await use(dashboardPage)
  },

  loginData :async ({}, use) => {
    await use(loginData)
  },

  pimdata: async ({}, use) =>{
    await use(pimdata)
  },

  admindata: async ({},use) => {
    await use(admindata)
  },

  pimPage: async ({ page }, use) => {
    const pimPage = new PIMPage(page)
    await use(pimPage)
  },

  employee :async ({pimPage,page},use) =>{
    const employeeId = generateEmployeeId()
    await pimPage.addEmployeeWithoutLoginDetails(page,pimdata.firstname,pimdata.middlename,pimdata.lastname,employeeId)
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible()
    await pimPage.linkClick("Employee List")
    await use({employeeId})
  },

  adminpage:async ({page},use) =>{
    const adminpage = new AdminPage(page)
    await use(adminpage)
  },

  username: async({},use)=>{
    const userId = generateUsername()
    await use({userId})
  },

  leavePage: async ({page},use)=>{
    const leavePage = new LeavePage(page)
    await use(leavePage)
  }
})

export {expect} from "@playwright/test"
import{test as base,expect} from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import loginData from "../testdata/logindata.json"
import pimdata from "../testdata/pimdata.json"
import {DashboardPage} from "../pages/DashboardPage"
import { PIMPage } from "../pages/PIMPage"
import { generateEmployeeId } from "../util/dataUtil"

type MyFixture={
    loginPage:LoginPage
    loginData: typeof loginData
    pimdata: typeof pimdata
    dashboardPage : DashboardPage
    pimPage:PIMPage
    employee: {
    employeeId: string;
}
}

export const test = base.extend<MyFixture>({
  loginPage : async ({page}, use) => {
    const loginPage = new LoginPage(page)
    await use(loginPage)
  },

  dashboardPage : async ({page},use) =>{
    const dashboardPage = new DashboardPage(page)
    await use(dashboardPage)
  },

  loginData :async ({}, use) => {
    await use(loginData)
  },

  pimdata: async ({}, use) =>{
    await use(pimdata)
  },

  pimPage: async ({ page }, use) => {
    const pimPage = new PIMPage(page)
    await use(pimPage)
  },

  employee :async ({pimPage,page},use) =>{
    const employeeId = generateEmployeeId();
    await pimPage.addEmployeeWithoutLoginDetails(page,pimdata.firstname,pimdata.middlename,pimdata.lastname,employeeId)
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible()
    await pimPage.linkClick("Employee List")
    await use({employeeId})
  }
})

export {expect} from "@playwright/test"
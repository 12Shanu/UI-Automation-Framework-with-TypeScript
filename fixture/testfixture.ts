import{test as base} from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import loginData from "../testdata/logindata.json"
import pimdata from "../testdata/pimdata.json"
import {DashboardPage} from "../pages/DashboardPage"

type MyFixture={
    loginPage:LoginPage
    loginData: typeof loginData
    pimdata: typeof pimdata
    dashboardPage : DashboardPage
}

export const test = base.extend<MyFixture>({
  loginPage : async ({page}, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage : async ({page},use) =>{
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  loginData :async ({}, use) => {
    await use(loginData);
  },

  pimdata: async ({}, use) =>{
    await use(pimdata);
  }
})

export {expect} from "@playwright/test"
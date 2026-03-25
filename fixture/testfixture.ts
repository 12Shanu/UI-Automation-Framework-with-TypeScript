import{test as base} from "@playwright/test"
import { LoginPage } from "../pages/LoginPage"
import loginData from "../testdata/logindata.json"

type MyFixture={
    loginPage:LoginPage
    loginData: typeof loginData
}

export const test = base.extend<MyFixture>({
  loginPage : async ({page}, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  loginData :async ({}, use) => {
    await use(loginData);
  },
})

export {expect} from "@playwright/test"
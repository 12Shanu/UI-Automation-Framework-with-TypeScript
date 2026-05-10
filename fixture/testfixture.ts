import { test as base, expect } from "@playwright/test"
import * as fs from 'fs'
import * as path from 'path'
import { LoginPage } from "../pages/LoginPage"
import { DashboardPage } from "../pages/DashboardPage"
import { PIMPage } from "../pages/PIMPage"
import { generateEmployeeId, generateUsername } from "../util/dataUtil"
import { AdminPage } from "../pages/AdminPage"
import { LeavePage } from "../pages/LeavePage"
import type { Page } from "@playwright/test"

type Use<T> = (value: T) => Promise<void>

// ✅ Replace all JSON imports with fs.readFileSync
const loginData = JSON.parse(
  fs.readFileSync(path.resolve('./testdata/logindata.json'), 'utf-8')
)
const pimdata = JSON.parse(
  fs.readFileSync(path.resolve('./testdata/pimdata.json'), 'utf-8')
)
const admindata = JSON.parse(
  fs.readFileSync(path.resolve('./testdata/admindata.json'), 'utf-8')
)

type MyFixture = {
  loginPage: LoginPage
  loginData: typeof loginData
  pimdata: typeof pimdata
  dashboardPage: DashboardPage
  pimPage: PIMPage
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

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await use(loginPage)
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page)
    await page.goto('/web/index.php/dashboard/index')
    await use(dashboardPage)
  },

  loginData: async ({ }, use: Use<typeof loginData>) => {
    await use(loginData)   // ✅ uses fs version
  },

  pimdata: async ({ }, use: Use<typeof pimdata>) => {
    await use(pimdata)     // ✅ uses fs version
  },

  admindata: async ({ }, use: Use<typeof admindata>) => {
    await use(admindata)   // ✅ uses fs version
  },

  pimPage: async ({ page }, use: Use<PIMPage>) => {
    const pimPage = new PIMPage(page)
    await use(pimPage)
  },

  employee: async ({ pimPage, page }, use: Use<{ employeeId: string }>) => {
    const employeeId = generateEmployeeId()
    await pimPage.addEmployeeWithoutLoginDetails(
      page,
      pimdata.firstname,
      pimdata.middlename,
      pimdata.lastname,
      employeeId
    )
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible()
    await pimPage.linkClick("Employee List")
    await use({ employeeId })
  },

  adminpage: async ({ page }, use: Use<AdminPage>) => {
    const adminpage = new AdminPage(page)
    await use(adminpage)
  },

  username: async ({ }, use: Use<{ userId: string }>) => {
    const userId = generateUsername()
    await use({ userId })
  },

  leavePage: async ({ page }, use: Use<LeavePage>) => {
    const leavePage = new LeavePage(page)
    await use(leavePage)
  }

})

export { expect } from "@playwright/test"
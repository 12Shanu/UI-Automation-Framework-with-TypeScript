import { expect ,Page } from "@playwright/test";

export class DashboardPage{
    page:Page
    readonly moduleName
    readonly profile
    readonly logout_btn

    constructor(page:Page){
        this.page = page
        this.moduleName = page.getByRole('listitem')
        this.profile = this.page.getByRole('img', { name: 'profile picture' })
        this.logout_btn =  this.page.getByText('Logout')
    }

    async moduleClick(module:string){
        await this.moduleName.filter({hasText: module}).click()
    }

    async appLogout(){
        await this.profile.click()
        await expect(this.logout_btn).toBeVisible()
        await this.logout_btn.click()
    }
}
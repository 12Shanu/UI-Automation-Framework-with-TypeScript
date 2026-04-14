import { expect, Page } from "@playwright/test"

export class LoginPage{
    readonly page :Page
    readonly username
    readonly password
    readonly submitbtn
    readonly forgetlink
    readonly resetPasswordbtn
    readonly resetmsg
    readonly requiredst
    readonly requirednd

    constructor(page:Page){
        this.page =page
        this.username = page.getByRole('textbox', { name: 'Username' })  
        this.password = page.getByRole('textbox', { name: 'Password' })
        this.submitbtn = page.getByRole('button', {name:'Login'})
        this.forgetlink = page.getByText('Forgot your password?')
        this.resetPasswordbtn = page.getByRole('button', { name: 'Reset Password' })
        this.resetmsg = page.getByRole('heading', { name: 'Reset Password link sent successfully' })
        this.requiredst = page.locator('span').filter({ hasText: 'Required' }).first()
        this.requirednd = page.locator('span').filter({ hasText: 'Required' }).last()
    }

    async navigateUrl(page:Page){
       await page.goto('/web/index.php/auth/login',
     {
        timeout: 60000,
        waitUntil: 'domcontentloaded', // ✅ faster & stable
    }
    )}

    async userLogin(user:string, pass:string){
        await this.username.fill(user)
        await this.password.fill(pass)
        await this.submitbtn.click()
    }

    async forgotPassword(page:Page, user:string){
        await this.forgetlink.click()
        await expect(this.resetPasswordbtn).toBeVisible()
        await this.username.fill(user)
        await this.resetPasswordbtn.click()
    }

    async validationCheck(){
        await expect.soft(this.requiredst).toBeVisible()
        await expect(this.requirednd).toBeVisible()
    }
}
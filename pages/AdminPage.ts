import { Page,expect } from "@playwright/test"

export class AdminPage{
    page:Page
    readonly add_btn
    readonly role
    readonly status
    readonly employename
    readonly username
    readonly password
    readonly confirmpassword
    readonly save_btn
    readonly cancel_btn
    readonly search_btn
    readonly alert_delete

    constructor(page:Page){
        this.page=page
        this.add_btn = page.getByRole('button', { name: 'Add' })
        this.role = page.locator("//label[normalize-space()='User Role']/../../div[2]//i")
        this.status = page.locator("//label[normalize-space()='Status']/../../div[2]//i")
        this.employename = page.getByPlaceholder('Type for hints...')
        this.username = page.locator("//label[normalize-space()='Username']/../../div[2]/input")
        this.password = page.locator("//label[normalize-space()='Password']/../../div[2]/input")
        this.confirmpassword = page.locator("//label[normalize-space()='Confirm Password']/../../div[2]/input")
        this.save_btn = page.getByRole('button', { name: 'Save' })
        this.cancel_btn = page.getByRole('button', { name: 'Cancel' })
        this.search_btn = page.getByRole('button', {name: 'Search' })
        this.alert_delete = page.getByRole('button', { name: 'Yes, Delete' })
    }

    async addUser(page:Page,username:string,password:string,confirmpassword:string){
        await this.add_btn.click()
        await this.role.isVisible()
        await this.role.click()
        await page.getByRole('listbox').isVisible()
        await page.locator("//div[@role='listbox']").filter({hasText:'Admin'}).click()
        await this.employename.fill("sh")
        await this.handleAutosuggestion(page)
        await this.status.click();
        await page.locator("//div[@role='listbox']").filter({hasText:'Enabled'}).click()
        await this.username.fill(username)
        await this.password.fill(password)
        await this.confirmpassword.fill(confirmpassword)
        await Promise.all([
            page.waitForURL(/admin\/viewSystemUsers/),
            this.save_btn.click()
        ])
        await expect(page).toHaveURL(/admin\/viewSystemUsers/)
    }

    async searchByUsername(username:string,page:Page){
        await this.username.fill(username)
        await this.search_btn.click()
        await page.locator(`//div[@class='oxd-table-body']//div[text()='${username}']`).isVisible()
    }

    async deleteUser(username:string,page:Page){
        await page.locator(`//div[@class='oxd-table-body']//div[text()='${username}']/../following-sibling::div[4]//button[1]/i`).click()
        await this.alert_delete.click()
    }

    async searchByEmployeeName(page:Page,username:string){
        await page.locator("//div[contains(@class,'oxd-table-body')]//div[@role='row']").isVisible()
        const rows = page.locator("//div[contains(@class,'oxd-table-body')]//div[@role='row']")
        await expect(rows.first()).toBeVisible();
        console.log(await rows.count())
        let count = await rows.count()
        let randomIndex = Math.floor(Math.random() * count);
        if(randomIndex==0 || randomIndex==1){
            randomIndex=2
        }
        const empname = await page.locator(`(//div[contains(@class,'oxd-table-row')])[${randomIndex}]/div[4]`).innerText()
        this.employename.fill(empname)
        let option = await this.handleAutosuggestion(page)
        console.log("return text:"+option)
        await this.search_btn.click()
        const nameParts = option?.trim().split(/\s+/) || []
        let matchname = "";

        if (nameParts.length >= 3) {
            // First + Middle
            matchname = nameParts[0] + " " + nameParts[2];
        } else if (nameParts.length === 2) {
            // Only First
            matchname = nameParts[0];
        } else if (nameParts.length === 1) {
            // Only one name
            matchname = nameParts[0];
        }
        const employeename = await page.locator(`(//div[contains(@class,'oxd-table-row')])[2]/div[4]`).innerText()
        expect(employeename).toContain(matchname)
        console.log("Expected Name:"+employeename)
        console.log("Actual Name:"+matchname)
    }

    async handleAutosuggestion(page:Page){
        await page.waitForSelector('[role="option"]');
        const options = page.locator('[role="option"]').filter({
        has: page.locator('span') // ensures real option
        });
        await expect(options.first()).toBeVisible();
        const count = await options.count();
        const randomIndex = Math.floor(Math.random() * count);
        const selectedOption = options.nth(randomIndex);
        // Wait before click (important)
        await selectedOption.waitFor({ state: 'visible' });
        // Get text BEFORE click (optional but useful)
        const option = await selectedOption.innerText()
        if (!option) {
            throw new Error("Option text is null or empty");
        }
        await selectedOption.click();
        console.log("handle:"+option)
        return option
    }
}
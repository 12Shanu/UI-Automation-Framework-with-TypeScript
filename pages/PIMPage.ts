import { expect, Locator, Page } from "@playwright/test";

export class PIMPage{
    page:Page
    readonly add_btn
    readonly firstname
    readonly middlename
    readonly lastname
    readonly save_btn
    readonly employeeid
    readonly pimlink
    readonly search_btn
    readonly alert_delete

    constructor(page:Page){
        this.page =page
        this.add_btn = page.getByRole('button', { name: 'Add' })
        this.firstname = page.getByRole('textbox', { name: 'First Name' })
        this.middlename = page.getByRole('textbox', { name: 'Middle Name' })
        this.lastname = page.getByRole('textbox', { name: 'Last Name' })
        this.save_btn = page.getByRole('button', { name: 'Save' })
        this.employeeid = page.locator("//div[@class='oxd-input-group oxd-input-field-bottom-space']//div//input[@class='oxd-input oxd-input--active']")
        this.pimlink = page.getByRole('link')
        this.search_btn = page.getByRole('button', {name: 'Search'})
        this.alert_delete = page.getByRole('button', { name: 'Yes, Delete' })
    }

    async addEmployeeWithoutLoginDetails(page:Page, firstname:string, middlename:string, lastname:string, employeeid:string){
        await this.add_btn.click()
        await expect(page).toHaveURL(/addEmployee/)
        await expect(this.firstname).toBeVisible()
        await this.firstname.fill(firstname)
        await this.middlename.fill(middlename)
        await this.lastname.fill(lastname)
        await this.employeeid.fill(employeeid) 
        await Promise.all([
            page.waitForURL(/viewPersonalDetails/),
            this.save_btn.click()
        ])
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible()
    }

    async linkClick(link:string){
        await this.pimlink.filter({hasText: link}).click()
    }

    async searchEmployeeByID(employeeid:string){
        await this.employeeid.fill(employeeid)
        await this.search_btn.click()
    }

    async selectEmployee(page:Page,employeeid:string){
        const table = page.locator('div.oxd-table-body')
        const rows = table.locator('div.oxd-table-card')
        const mactchedrow = rows.filter({
            has: page.locator(`text=${employeeid}`)
        })
        
        await expect(mactchedrow).toBeVisible({ timeout: 15000 });
        return mactchedrow

        // if(action.includes('onclick')){
        //     await mactchedrow.click()
        // }else if(action.includes('delete')) {
        //     await page.locator(`//div[@class='oxd-table-body']//div[text()='${employeeid}']/../following-sibling::div[7]//button[2]/i`).click()
        //     await this.alert_delete.click()
        // }else if(action.includes('validateuser')){
        //     const employeeRow = page.locator('.oxd-table-body').getByText(employeeid);
        //     await expect(employeeRow).toBeVisible({ timeout: 15000 })
        // }
    }

    async clickEmployee(matchedRow: Locator, page: Page) {

        const pagination = page.locator("//ul[@class='oxd-pagination__ul']/li");

        const totalPages = await pagination.count();
        console.log("Total pagination items:", totalPages);

    // ✅ If no pagination OR only single page → directly click
        if (totalPages <= 1) {
        if (await matchedRow.isVisible()) {
            await matchedRow.click();
        } else {
            throw new Error("Employee not found on single page");
        }
        return;
    }

    // ✅ Pagination exists → loop through pages
        for (let i = 2; i < totalPages - 2; i++) {

        if (await matchedRow.isVisible()) {
            await matchedRow.click();
            break;
        } else {
            await page.getByRole('button', { name: `${i}` }).click();
            await page.waitForLoadState('networkidle');

            console.log(`Navigated to page ${i}`);
        }
    }

            await page.waitForURL(/viewPersonalDetails/);
}
        
    async deleteEmployee(page:Page,employeeid: string) { 
        await page.locator(`//div[@class='oxd-table-body']//div[text()='${employeeid}']/../following-sibling::div[7]//button[2]/i`).click()
        await this.alert_delete.click()
    }

    async validateEmployee(page:Page, employeeid: string) { 
        const employeeRow = page.locator('.oxd-table-body').getByText(employeeid);
        await expect(employeeRow).toBeVisible({ timeout: 15000 })
    }
}
import { expect, Page } from "@playwright/test";

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
        this.employeeid = page.locator('div:has(label:has-text("Employee Id")) input')
        this.pimlink = page.getByRole('link')
        this.search_btn = page.getByRole('button', {name: 'Search'})
        this.alert_delete = page.getByRole('button', { name: 'Yes, Delete' })
    }

    async addEmployeeWithoutLoginDetails(page:Page, firstname:string, middlename:string, lastname:string, employeeid:string){
        await this.add_btn.click()
        await expect(page).toHaveURL('/addEmployee')
        await this.firstname.fill(firstname)
        await this.middlename.fill(middlename)
        await this.lastname.fill(lastname)
        await this.employeeid.fill(employeeid)
        await this.save_btn.click()
        expect(page).toBe('Personal Details')
    }

    async linkClick(link:string){
        await this.pimlink.filter({hasText: link}).click()
    }

    async searchEmployeeByID(employeeid:string){
        await this.employeeid.fill(employeeid)
        
    }

    async tableHandle(page:Page,employeeid:string,action:string){
        const table = await page.locator('div.oxd-table-body')
        const rows = await table.locator('div.oxd-table-card')
        const rowcount = await rows.count();
        const mactchedrow = rows.filter({
            has: page.locator(`text=${employeeid}`)
        })
        if(action.includes('onclick')){
            mactchedrow.click()
        }else if(action.includes('delete')) {
            await page.locator(`//div[@class='oxd-table-body']//div[text()='${employeeid}']/../following-sibling::div[7]//button[2]/i`).click()
            await this.alert_delete.click()
        }else if(action.includes('validateuser')){
            await expect(page.locator('.oxd-table-body')).toContainText(employeeid)
        }
    }
}
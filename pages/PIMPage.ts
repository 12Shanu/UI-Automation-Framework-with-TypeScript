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
    readonly otherid
    readonly licensenumber
    readonly licenseexpirydate
    readonly nationalitydropdown
    readonly maritalstatus
    readonly dob
    readonly gender
    readonly hintname
    readonly year
    readonly month

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
        this.otherid =page.locator("//label[text()='Other Id']/../../div//input")
        this.licensenumber = page.locator("//label[contains(text(),'License Number')]/../../div//input")
        this.licenseexpirydate = page.locator("//label[contains(text(),'License Expiry')]/../../div//i")
        this.nationalitydropdown = page.locator("//label[contains(text(),'Nationality')]/../..//div[@class='oxd-select-wrapper']")
        this.maritalstatus = page.locator("//label[contains(text(),'Marital Status')]/../..//div[@class='oxd-select-wrapper']")
        this.dob = page.locator("//label[contains(text(),'Date of Birth')]/../../div//i")
        this.gender = page.getByLabel('Female')
        this.hintname = page.getByRole('textbox', { name: 'Type for hints...' }).first()
        this.month = page.locator("//div[@class='oxd-calendar-selector-month-selected']")
        this.year = page.locator("//div[@class='oxd-calendar-selector-year-selected']")
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
    }

    async linkClick(link:string){
        await this.pimlink.filter({hasText: link}).isVisible()
        await this.pimlink.filter({hasText: link}).click()
    }

    async searchEmployeeByID(employeeid:string,page:Page){
        await this.search_btn.isVisible()
        await this.employeeid.fill(employeeid)
        await this.search_btn.click()
        await page.locator(`//div[@class='oxd-table-body']//div[text()='${employeeid}']/../following-sibling::div[7]//button[2]/i`).isVisible()
    }

    async selectAndClickEmployee(page: Page, employeeId: string) {

    await page.locator("//ul[@class='oxd-pagination__ul']/li").first().scrollIntoViewIfNeeded()
    const pagination = page.locator("//ul[@class='oxd-pagination__ul']/li");
    
    const totalPages = await pagination.count();

    console.log("Total pagination items:", totalPages);

    // Function to get fresh matched row every time
    const getMatchedRow = () => {
        const table = page.locator('div.oxd-table-body');
        const rows = table.locator('div.oxd-table-card');

        return rows.filter({
            has: page.locator(`text=${employeeId}`)
        });
    };

    // 🔹 Case 1: No pagination OR single page
    if (totalPages <= 1) {
        const matchedRow = getMatchedRow();

        if (await matchedRow.count() > 0) {
            await matchedRow.first().click();
            return matchedRow;
        } else {
            throw new Error(`Employee ${employeeId} not found`);
        }
    }

    // 🔹 Case 2: Multiple pages → loop through pages
    for (let i = 1; i <= totalPages - 2; i++) {

        const matchedRow = getMatchedRow();

        if (await matchedRow.count() > 0) {
            console.log(`Employee found on page ${i}`);
            await matchedRow.first().click();
            await page.waitForURL(/viewPersonalDetails/);
            return matchedRow;
        }

        // Navigate to next page
        const nextPageBtn = page.getByRole('button', { name: `${i + 1}` });

        if (await nextPageBtn.isVisible()) {
            await nextPageBtn.click();
            await page.waitForLoadState('networkidle');
            console.log(`Navigated to page ${i + 1}`);
        }
    }

    throw new Error(`Employee ${employeeId} not found in any page`);
}
        
    async deleteEmployee(page:Page,employeeid: string) { 
        await page.locator(`//div[@class='oxd-table-body']//div[text()='${employeeid}']/../following-sibling::div[7]//button[2]/i`).isVisible()
        await page.locator("//div[@class='oxd-table-body']//div/../following-sibling::div[7]//button[2]/i").click()
        await this.alert_delete.click()
    }

    async validateEmployee(page:Page, employeeid: string) { 
        const employeeRow = page.locator('.oxd-table-body').getByText(employeeid);
        await expect(employeeRow).toBeVisible({ timeout: 15000 })
    }

    async editUser(page:Page,employeeid: string){
        await page.locator(`//div[@class='oxd-table-body']//div[text()='${employeeid}']/../following-sibling::div[7]//button[1]/i`).isVisible()
        await page.locator(`//div[@class='oxd-table-body']//div[text()='${employeeid}']/../following-sibling::div[7]//button[1]/i`).click()
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible()
    }

    async addPersonalDetails(updatedfirstname:string,otherid:string,licensenum:string,expirydate:string,page:Page,dob:string){
        await this.firstname.click()
        await this.firstname.fill(updatedfirstname)
        await this.otherid.click()
        await this.otherid.fill(otherid)
        await this.licensenumber.click()
        await this.licensenumber.fill(licensenum)
        await this.licenseexpirydate.click()
        await this.handleCalender(page,"July","2026")
        await page.pause()
        await this.nationalitydropdown.click()
        await page.getByText('Indian').waitFor()
        await page.getByText('Indian').click()
        await this.maritalstatus.click()
        await page.getByText('Married').waitFor()
        await page.getByText('Married').click()
        await this.dob.click()
        await this.handleCalender(page,"November","1993")
       // await this.gender.click()
        await page.locator('button').filter({ hasText: 'Save' }).first().click()
    }

    async searchByEmployeeName(page:Page){
        await this.hintname.fill('sh')
        await page.waitForSelector('[role="option"]')
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
        const optionText = await selectedOption.innerText()
        if (!optionText) {
            throw new Error("Option text is null or empty");
        }
        await selectedOption.click();
        const nameParts = optionText?.trim().split(/\s+/) || [];

        let firstAndMiddle = "";

        if (nameParts.length >= 3) {
            // First + Middle
            firstAndMiddle = nameParts[0] + " " + nameParts[1];
        } else if (nameParts.length === 2) {
            // Only First
            firstAndMiddle = nameParts[0];
        } else if (nameParts.length === 1) {
            // Only one name
            firstAndMiddle = nameParts[0];
        }
        console.log("actual:"+firstAndMiddle)
        await this.search_btn.click()
        const fm=await page.locator("//div[@class='oxd-table-body']/div/div/div[3]/div").textContent()
        console.log("expected:"+fm)
        expect(fm).toContain(firstAndMiddle)
    }

    async handleCalender(page:Page,month:string,year:string){
        //await page.waitForSelector('[role="option"]')
        await this.month.click()
        await page.getByRole('menu').filter({hasText: month}).click()
        await this.year.click()
        await page.getByRole('menu').filter({hasText: year}).click()
        const date = page.locator("//div[@class='oxd-calendar-dates-grid']")
        const options = date.filter({
        has: page.locator('div') // ensures real option
        });
        await expect(options.first()).toBeVisible();
        const count = await options.count();
        const randomIndex = Math.floor(Math.random() * count);
        const selectedOption = options.nth(randomIndex);
        // Wait before click (important)
        await selectedOption.waitFor({ state: 'visible' });
        // Get text BEFORE click (optional but useful)
        const optionText = await selectedOption.innerText()
        if (!optionText) {
            throw new Error("Option text is null or empty");
        }
        await selectedOption.click();
    }
}
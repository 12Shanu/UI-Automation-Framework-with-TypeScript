import { Page,expect } from "@playwright/test";

export class BasePage{
    page:Page
    readonly month
    readonly year

    constructor(page:Page){
        this.page=page
        this.month = page.locator("//div[@class='oxd-calendar-selector-month-selected']")
        this.year = page.locator("//div[@class='oxd-calendar-selector-year-selected']")
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

     async handleDropdown(page:Page) :Promise<{count:number, randomIndex:number}>{
        const options = page.locator('[role="option"]').filter({
        has: page.locator('span') // ensures real option
         });
        await expect(options.first()).toBeVisible();
        let count = await options.count();
        let randomIndex = Math.floor(Math.random() * count);
        //console.log("RandomIndex=", randomIndex)
        const selectedOption = options.nth(randomIndex);
        // Wait before click (important)
        await selectedOption.waitFor({ state: 'visible' });
        // Get text BEFORE click (optional but useful)
        const optionText = await selectedOption.innerText()
        if (!optionText) {
            throw new Error("Option text is null or empty");
        }
        await selectedOption.click()
        return {count, randomIndex}         
    }
}
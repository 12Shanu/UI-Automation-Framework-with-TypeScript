import { Page , expect} from "@playwright/test";

import { BasePage } from "./BasePage";

export class LeavePage extends BasePage{

    readonly page:Page
    private apply_link
    private leavetype
    private commentarea
    private apply_btn
    private leave_bal
    private assignleave_link
    private employename
    private fromdate
    private todate
    private asign_btn
    private partialdays
    private duration
    private startday
    private endday
    private fromtime
    private totime
    private timehr
    private timemin
    private leavealert
    private ok_btn
    readonly toastmsg
    private entitlements_link
    private addentitlements_link

    constructor(page:Page){
        super(page)
        this.page =page
        this.apply_link = page.getByRole('link', { name: 'Apply' })
        this.leavetype = page.locator('i.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow')
        this.commentarea = page.getByRole('textbox').last()
        this.apply_btn = page.getByRole('button', { name: 'Apply' })
        this.leave_bal = page.locator('.oxd-text.oxd-text--p.orangehrm-leave-balance-text')
        this.assignleave_link = page.getByRole('link', { name: 'Assign Leave' })
        this.employename = page.getByPlaceholder('Type for hints...')
        this.fromdate = page.locator("//label[contains(text(),'From Date')]/../../div//i")
        this.todate = page.locator("//label[contains(text(),'To Date')]/../../div//i")
        this.asign_btn = page.getByRole('button', { name: 'Assign' })
        this.partialdays = page.locator("//label[contains(text(),'Partial Days')]/../../div//i")
        this.duration = page.locator("//label[contains(text(),'Duration')]/../../div//i")
        this.startday = page.locator("//label[contains(text(),'Start Day')]/../../div//i")
        this.endday = page.locator("//label[contains(text(),'End Day')]/../../div//i")
        this.fromtime = page.locator("//label[text()='From']/../../div//i")
        this.totime = page.locator("//label[text()='To']/../../div//i")
        this.timehr = page.locator("//input[contains(@class,'time-hour')]")
        this.timemin = page.locator("//input[contains(@class,'time-minute')]")
        this.leavealert = page.getByText('Confirm Leave Assignment', { exact: true })
        this.ok_btn = page.getByRole('button', { name: 'Ok' })
        this.toastmsg = page.getByText('Success', { exact: true })
        this.entitlements_link = page.getByText('Entitlements')
        this.addentitlements_link = page.getByRole('menuitem', { name: /Add Entitlements/i })
    }

    async applyLeave(page:Page){
        await this.apply_link.isVisible()
        await this.apply_link.click()
        await this.leavetype.isVisible()
        await this.leavetype.click()
        await this.handleDropdown(page)
        await this.fromdate.click()
        await this.handleCalender(page,"April","2026")
        await page.waitForTimeout(1000)
        await this.todate.click()
        await this.handleCalender(page,"May","2026")
        await this.commentarea.fill("Going To Home")
        await this.apply_btn.click()    
}

    async assignLeave(page:Page){
        await this.assignleave_link.isVisible()
        await this.assignleave_link.click()
        await this.employename.isVisible()
        await this.employename.fill("sh")
        await this.handleAutosuggestion(page)
        await this.leavetype.click()
        await this.handleDropdown(page)
        await this.fromdate.click()
        await this.handleCalender(page,"April","2026")
        await page.waitForTimeout(1000)
        await this.todate.click()
        await this.handleCalender(page,"May","2026")
        await this.partialdays.click()
        const { count, randomIndex } = await this.handleDropdown(page)
        if(randomIndex==0){
            await this.duration.click()
            await this.handleDropdown(page)
        }else if(randomIndex==1){
            await this.startday.click()
            await this.handleDropdown(page)
        }else if(randomIndex==2){
            await this.endday.click() 
            await this.handleDropdown(page)
        }else{
            await this.startday.click()
            await this.handleDropdown(page) 
            await page.waitForTimeout(1000)
            await this.endday.click()
            await this.handleDropdown(page)
        }
        await this.commentarea.fill("Going To Home")
        await this.asign_btn.click()
        await this.leavealert.isVisible()
        await this.ok_btn.click()
        await this.toastmsg.isVisible()
    }

    async mandatoryFieldValidate(page:Page){
        await this.assignleave_link.isVisible()
        await this.assignleave_link.click()
        await this.asign_btn.isVisible()
        await this.asign_btn.click()
        await page.locator("//label[text()='Employee Name']/../..//span").isVisible()
        await page.locator("//label[text()='Leave Type']/../..//span").isVisible()
        await page.locator("//label[text()='From Date']/../..//span").isVisible()
        await page.locator("//label[text()='To Date']/../..//span").isVisible()
    }
}
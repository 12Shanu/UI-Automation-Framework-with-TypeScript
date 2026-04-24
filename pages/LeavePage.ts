import { Page , expect, Locator} from "@playwright/test";

import { BasePage } from "./BasePage";

export class LeavePage extends BasePage{
    readonly apply_link :Locator
    readonly leavetype :Locator
    readonly commentarea :Locator
    readonly apply_btn :Locator
    readonly leave_bal :Locator
    readonly assignleave_link :Locator
    readonly employename :Locator
    readonly fromdate :Locator
    readonly todate :Locator
    readonly asign_btn :Locator
    readonly partialdays :Locator
    readonly duration :Locator
    readonly startday :Locator
    readonly endday :Locator
    readonly fromtime :Locator
    readonly totime :Locator
    readonly timehr :Locator
    readonly timemin :Locator
    readonly leavealert :Locator
    readonly ok_btn :Locator
    readonly toastmsg :Locator
    readonly entitlements_link :Locator
    readonly addentitlements_link :Locator
    readonly leaveperiod :Locator
    readonly entitlements :Locator
    readonly entitlementsalert :Locator
    readonly confirm_btn :Locator
    readonly multipleemployeeradio :Locator
    readonly save_btn:Locator

    constructor(page:Page){
        super(page)
        this.page =page
        this.apply_link = page.getByRole('link', { name: 'Apply' })
        this.leavetype = page.locator('div.oxd-input-group').filter({ hasText: 'Leave Type' }).locator('.oxd-select-text')
        this.commentarea = page.getByRole('textbox').last()
        this.apply_btn = page.getByRole('button', { name: 'Apply' })
        this.leave_bal = page.locator('.oxd-text.oxd-text--p.orangehrm-leave-balance-text')
        this.assignleave_link = page.getByRole('link', { name: 'Assign Leave' })
        this.employename = page.getByPlaceholder('Type for hints...')
        this.fromdate = page.locator('div.oxd-input-group').filter({ hasText: 'From Date' }).locator('input')
        this.todate = page.locator('div.oxd-input-group').filter({ hasText: 'To Date' }).locator('input')
        this.asign_btn = page.getByRole('button', { name: 'Assign' })
        this.partialdays = page.locator('div.oxd-input-group').filter({ hasText: 'Partial Days' }).locator('.oxd-select-text')
        this.duration = page.locator('div.oxd-input-group').filter({ hasText: 'Duration' }).locator('.oxd-select-text')
        this.startday = page.locator('div.oxd-input-group').filter({ hasText: 'Start Day' }).locator('.oxd-select-text').last()
        this.endday = page.locator('div.oxd-input-group').filter({ hasText: 'End Day' }).locator('.oxd-select-text').last()
        this.fromtime = page.locator('div.oxd-input-group').filter({ hasText: 'From Time' }).locator('.oxd-select-text')
        this.totime = page.locator('div.oxd-input-group').filter({ hasText: 'To Time' }).locator('.oxd-select-text')
        this.timehr = page.locator("//input[contains(@class,'time-hour')]")
        this.timemin = page.locator("//input[contains(@class,'time-minute')]")
        this.leavealert = page.getByText('Confirm Leave Assignment', { exact: true })
        this.ok_btn = page.getByRole('button', { name: 'Ok' })
        this.toastmsg = page.getByText('Success', { exact: true })
        this.entitlements_link = page.getByText('Entitlements')
        this.addentitlements_link = page.getByRole('menuitem', { name: /Add Entitlements/i })
        this.leaveperiod = page.locator('div.oxd-input-group').filter({ hasText: 'Leave Period' }).locator('.oxd-select-text')
        this.entitlements = page.locator('div.oxd-input-group').filter({ hasText: 'Entitlement' }).locator('input')
        this.entitlementsalert = page.getByText('Updating Entitlement')
        this.confirm_btn = page.getByRole('button', { name: 'Confirm' })
        this.multipleemployeeradio = page.getByLabel('Multiple Employees')
        this.save_btn = page.getByRole('button', { name: 'Save' })
    }

    async applyLeave(page:Page) : Promise<void>{
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

    async assignLeave(page:Page) : Promise<void>{
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

    async mandatoryFieldValidate(page:Page) : Promise<void>{
        await this.assignleave_link.isVisible()
        await this.assignleave_link.click()
        await this.asign_btn.isVisible()
        await this.asign_btn.click()
        await page.locator("//label[text()='Employee Name']/../..//span").isVisible()
        await page.locator("//label[text()='Leave Type']/../..//span").isVisible()
        await page.locator("//label[text()='From Date']/../..//span").isVisible()
        await page.locator("//label[text()='To Date']/../..//span").isVisible()
    }

    async addLeaveEntitlementWithIndividualEmployee() : Promise<void>{
        await this.entitlements_link.click()
        await this.addentitlements_link.isVisible()
        await this.addentitlements_link.click()
        await this.employename.fill("sh")
        await this.handleAutosuggestion(this.page)
        await this.leavetype.click()
        await this.handleDropdown(this.page)
        await this.leaveperiod.click()
        await this.handleDropdown(this.page)
        await this.entitlements.fill("12")
        await this.save_btn.click()
        expect(this.entitlementsalert).toBeTruthy()
        await this.confirm_btn.click()
        await this.toastmsg.isVisible()
    }

    async addLeaveEntitlementWithMultipleEmployee() : Promise<void> {
        await this.multipleemployeeradio.click()
        await this.entitlements_link.click()
        await this.addentitlements_link.isVisible()
        await this.addentitlements_link.click()
        await this.employename.fill("sh")
        await this.handleAutosuggestion(this.page)
        await this.leavetype.click()
        await this.handleDropdown(this.page)
        await this.leaveperiod.click()
        await this.handleDropdown(this.page)
        await this.entitlements.fill("12")
        expect(this.entitlementsalert).toBeTruthy()
        await this.confirm_btn.click()
        await this.toastmsg.isVisible()
    }
}
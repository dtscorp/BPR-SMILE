import 'dotenv/config';
import { test } from "../fixtures/fixture";
import { WebServices } from '../services/WebService';

test.describe("Test1",()=>{
    // let loginPage:LoginPage;
    // let dashboardPage:Dashboard;
    // let advanceSearch:AdvanceSearch;

    test.beforeEach(async ({ page }) => {
      
        // loginPage = new LoginPage(page);
        // dashboardPage = new Dashboard(page);
        // advanceSearch = new AdvanceSearch(page);
        // myWork = new MyWork(page);

    });

    // test.afterEach(async({page})=>{
    //     await page.close()
    // });

    test('Show Case Stage Micro', async({loginPage, dashboardPage, page}, testInfo)=>{
        
        await loginPage.login(page);
        await dashboardPage.showCaseStageMicro();
        await dashboardPage.showCaseStageMBP()
        await dashboardPage.showCaseStageSLIKCheck()
        await dashboardPage.showCaseStageReassignment();
        })

})
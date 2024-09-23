import 'dotenv/config';
import { test } from '../../fixtures/fixture';
import { WebServices } from '../../services/WebService';
import { getGlobalState, setGlobalState } from '../../variable/global';
import path from 'path';
let testData: any

test.describe("Test1", () => {
    test.beforeAll(async ({ }, testInfo) => {
        const testFilePath = testInfo.file // get full absolute path
        const directoryPath = path.dirname(testFilePath)
        const testFolder = path.basename(directoryPath)
        let today = WebServices.getDateNow()
        setGlobalState({ pathReport: `test-reports/${today}_${testInfo.title}`, featureName: testFolder })
        testData = await WebServices.getMasterTestData(testFolder, testInfo.title)
    });

    test.afterAll(async ({ }, testInfo) => {
        WebServices.reportVideo();
    });

    test('P_001_Scenario_Positif', async ({ loginPage, dashboardPage, page }, testInfo) => {
        await loginPage.login(page, testData.Username, testData.Password)
        await dashboardPage.showCaseStageMicro()
        await dashboardPage.showCaseStageMBP()
        await dashboardPage.showCaseStageSLIKCheck()
        await dashboardPage.showCaseStageReassignment()
    })
})
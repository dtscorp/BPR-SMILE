import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { Dashboard } from '../pages/dashboardPage';
import { AdvanceSearch } from '../pages/advanceSearch';
import { MyWork } from '../pages/myWork';
import { WebServices } from '../services/WebService';
import 'dotenv/config';

type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: Dashboard;
  advanceSearch: AdvanceSearch;
  myWork: MyWork;
  webService: WebServices;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new Dashboard(page)
    await use(dashboardPage);
  },

  advanceSearch: async ({ page }, use) => {
    const advanceSearch = new AdvanceSearch(page);
    await use(advanceSearch);
  },

  myWork: async ({ page }, use) => {
    const myWork = new MyWork(page);
    await use(myWork);
  },

  webService: async ({ }, use) => {
    const webService = new WebServices()
    await use(webService);
  }
});
export { expect } from '@playwright/test';
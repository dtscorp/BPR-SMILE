import type {
    FullConfig, FullResult, Reporter, Suite, TestCase, TestResult
} from '@playwright/test/reporter';
import fs from 'fs';
import puppeteer from 'puppeteer';
import path from 'path';

class MyPdfReporter implements Reporter {
    private testResults: Array<{ title: string, status: string, duration: number, screenshotPath?: string, videoPath?: string }> = [];

    onBegin(config: FullConfig, suite: Suite) {
        console.log(`Starting the run with ${suite.allTests().length} tests`);
    }

    onTestBegin(test: TestCase, result: TestResult) {
        console.log(`Starting test ${test.title}`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        const duration = result.duration || 0;

        // Extract the screenshot and video paths if available
        const attachments = result.attachments || [];
        let screenshotPath: string | undefined;
        let videoPath: string | undefined;

        for (const attachment of attachments) {
            if (attachment.name === 'screenshot') {
                screenshotPath = attachment.path;
            }
            if (attachment.name === 'video') {
                videoPath = attachment.path;
            }
        }

        // Add the test result with optional screenshot and video paths
        this.testResults.push({
            title: test.title,
            status: result.status,
            duration,
            screenshotPath,
            videoPath,
        });

        console.log(`Finished test ${test.title}: ${result.status}`);
    }

    async onEnd(result: FullResult) {
        console.log(`Finished the run: ${result.status}`);

        // Generate PDF report
        await this.generatePdfReport();
    }

    private async generatePdfReport() {
        const htmlContent = this.generateHtmlReport(); // Generate HTML content

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set the HTML content to the page
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate the PDF
        await page.pdf({
            path: './test-reports/test-report.pdf',
            format: 'A4',
            printBackground: true,
        });

        console.log('PDF report generated: ./test-reports/test-report.pdf');

        await browser.close();
    }

    private generateHtmlReport(): string {
        const testRows = this.testResults.map(test => {
            const screenshotHtml = test.screenshotPath ? `<img src="file://${path.resolve(test.screenshotPath)}" style="width:200px;height:auto;" />` : 'No Screenshot';
            const videoHtml = test.videoPath ? `<a href="file://${path.resolve(test.videoPath)}">Watch Video</a>` : 'No Video';

            return `
                <tr>
                    <td>${test.title}</td>
                    <td>${test.status}</td>
                    <td>${test.duration}ms</td>
                    <td>${screenshotHtml}</td>
                    <td>${videoHtml}</td>
                </tr>
            `;
        }).join('');

        return `
            <html>
            <head>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 8px 12px;
                        border: 1px solid #ddd;
                        text-align: left;
                    }
                    th {
                        background-color: #f4f4f4;
                    }
                    img {
                        border: 1px solid #ddd;
                        margin: 5px;
                    }
                </style>
            </head>
            <body>
                <h1>Test Report</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Screenshot</th>
                            <th>Video</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${testRows}
                    </tbody>
                </table>
            </body>
            </html>
        `;
    }
}

export default MyPdfReporter;

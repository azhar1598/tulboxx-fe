import dayjs from "dayjs";

export const generatePDFTemplate = (estimateData, aiContent) => {
  const processedDescription = {
    ...aiContent,
    scopeOfWork:
      typeof aiContent?.scopeOfWork === "string"
        ? aiContent?.scopeOfWork
            .split(/\\n|\\r|\n/)
            .filter((item) => item.trim())
            .map((item) => item.replace(/^- /, ""))
        : aiContent?.scopeOfWork,
  };

  const currentDate = dayjs().format("DD-MM-YYYY");

  const totalAmount =
    estimateData?.lineItems?.reduce((acc, item) => acc + item.totalPrice, 0) ||
    0;

  let scopeOfWorkHtml = "";
  if (Array.isArray(processedDescription?.scopeOfWork)) {
    scopeOfWorkHtml = `
            <ul class="list-disc pl-6">
              ${processedDescription.scopeOfWork
                .map((item) => `<li>${item}</li>`)
                .join("")}
            </ul>
          `;
  } else if (typeof processedDescription?.scopeOfWork === "string") {
    scopeOfWorkHtml = `
            <ul class="list-disc pl-6">
              ${processedDescription.scopeOfWork
                .split(/\\n|\\r|\n/)
                .filter((item) => item.trim())
                .map((item) => `<li>${item.replace(/^- /, "")}</li>`)
                .join("")}
            </ul>
          `;
  } else {
    scopeOfWorkHtml = "<p>No scope items available</p>";
  }

  const lineItemsHtml =
    estimateData?.lineItems
      ?.map(
        (item) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${
              item.description
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${
              item.quantity
            }</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${item.unitPrice.toFixed(
              2
            )}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${item.totalPrice.toFixed(
              2
            )}</td>
          </tr>
        `
      )
      .join("") || "";

  return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Project Estimate - ${
              estimateData?.projectName || "Untitled"
            }</title>
            <style>
              body {
                font-family: Arial, Helvetica, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 20px;
                position: relative;
              }
              .watermark {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                pointer-events: none;
                z-index: -1;
                opacity: 0.12;
                transform: rotate(-45deg);
                font-size: 120px;
                font-weight: bold;
                color: #3498db;
                overflow: hidden;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #eaeaea;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                color: #2c3e50;
              }
              .header p {
                margin: 5px 0;
                color: #7f8c8d;
              }
              .section {
                margin-bottom: 25px;
              }
              h2 {
                color: #2c3e50;
                border-bottom: 1px solid #eaeaea;
                padding-bottom: 8px;
                font-size: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th {
                background-color: #f2f2f2;
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
              }
              td {
                border: 1px solid #ddd;
                padding: 8px;
              }
              .total {
                font-weight: bold;
                text-align: right;
                margin-top: 10px;
                font-size: 18px;
              }
              .signatures {
                margin-top: 60px;
                display: flex;
                justify-content: space-between;
              }
              .signature-block {
                width: 45%;
              }
              .signature-line {
                border-bottom: 1px solid #333;
                height: 40px;
                margin-bottom: 5px;
              }
              .footer {
                margin-top: 50px;
                text-align: center;
                font-size: 12px;
                color: #7f8c8d;
                border-top: 1px solid #eaeaea;
                padding-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="watermark">Tulboxx</div>
            
            <div class="header">
              <h1>PROJECT ESTIMATE</h1>
              <p>${estimateData?.projectName || "Untitled Project"}</p>
              <p>Date: ${currentDate}</p>
            </div>
            
         
            <div class="section">
              <h2>Project Overview</h2>
              <div>${
                processedDescription?.projectOverview ||
                "No project overview available"
              }</div>
            </div>
            
            <div class="section">
              <h2>Scope of Work</h2>
              ${scopeOfWorkHtml}
            </div>
            
            <div class="section">
              <h2>Timeline</h2>
              <div>${
                processedDescription?.timeline || "No timeline available"
              }</div>
              <p><strong>Project Start:</strong> ${
                dayjs(estimateData?.projectStartDate).format("DD-MM-YYYY") ||
                "TBD"
              }</p>
              <p><strong>Project Completion:</strong> ${
                dayjs(estimateData?.projectEndDate).format("DD-MM-YYYY") ||
                "TBD"
              }</p>
            </div>
            
            <div class="section">
              <h2>Pricing Details</h2>
              <div>${
                processedDescription?.pricing || "No pricing details available"
              }</div>
              
              <table>
                <thead>
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left; background-color: #f2f2f2;">Description</th>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: right; background-color: #f2f2f2;">Quantity</th>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: right; background-color: #f2f2f2;">Unit Price</th>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: right; background-color: #f2f2f2;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItemsHtml}
                </tbody>
              </table>
              
              <div class="total">Grand Total: $${totalAmount.toFixed(2)}</div>
            </div>
            
            <div class="section">
              <h2>Additional Notes</h2>
              <p>${
                estimateData?.additionalNotes ||
                "We ensure that all aspects of the project will comply with relevant regulations and standards. Should any unforeseen complications arise during the project, we will notify you immediately and discuss any necessary adjustments. We value your trust and look forward to helping you enhance your home. Please feel free to contact us with any questions or concerns you may have."
              }</p>
            </div>
            
        
            <div class="footer">
              <p>Thank you for your business!</p>
              <p style="font-size: 10px; margin-top: 5px; color: #95a5a6;">Powered by Tulboxx</p>
            </div>
          </body>
          </html>
        `;
};

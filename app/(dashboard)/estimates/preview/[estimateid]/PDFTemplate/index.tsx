import dayjs from "dayjs";

export const generatePDFTemplate = (estimateData, aiContent, userProfile) => {
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

  const totalAmount =
    estimateData?.lineItems?.reduce((acc, item) => acc + item.totalPrice, 0) ||
    0;

  let scopeOfWorkHtml = "";
  if (Array.isArray(processedDescription?.scopeOfWork)) {
    scopeOfWorkHtml = processedDescription.scopeOfWork
      .map(
        (item) =>
          `<div style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
            <span style="font-weight: bold;">•</span>
            <span>${item}</span>
        </div>`
      )
      .join("");
  } else if (typeof processedDescription?.scopeOfWork === "string") {
    scopeOfWorkHtml = processedDescription.scopeOfWork
      .split(/\\n|\\r|\n/)
      .filter((item) => item.trim())
      .map(
        (item) =>
          `<div style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
            <span style="font-weight: bold;">•</span>
            <span>${item.replace(/^- /, "")}</span>
           </div>`
      )
      .join("");
  } else {
    scopeOfWorkHtml = "<p>No scope items available</p>";
  }

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
                font-family: Arial, sans-serif;
                color: #1a202c;
                margin: 0;
                padding: 40px;
                position: relative;
                font-size: 14px;
                line-height: 1.6;
              }
              .section {
                margin-bottom: 32px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 32px;
              }
              .section-header {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 16px;
                color: #1a202c;
              }
            </style>
          </head>
          <body>
            ${
              estimateData?.companyLogo
                ? `
              <div style="margin-bottom: 48px;">
                <img src="${estimateData.companyLogo}" alt="Company Logo" style="width: 150px; height: auto;" />
              </div>
            `
                : ""
            }
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; font-size: 14px; line-height: 1.6;">
                <div>
                    <div style="color: #718096; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">
                        Prepared By:
                    </div>
                    <div style="line-height: 1.7;">
                        <div style="font-weight: bold;">${
                          userProfile?.companyName || "Company Name"
                        }</div>
                        <div>${userProfile?.address || "Company Address"}</div>
                        <div>${userProfile?.email || "company@email.com"}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="color: #718096; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">
                        Prepared For:
                    </div>
                    <div style="line-height: 1.7;">
                        <div style="font-weight: bold;">${
                          estimateData?.clients?.name || "Client Name"
                        }</div>
                        <div>${
                          estimateData?.clients?.address || "Client Address"
                        }</div>
                         <div>${
                           estimateData?.clients?.email || "client@email.com"
                         }</div>
                        <div>${
                          estimateData?.clients?.phone || "Client Phone"
                        }</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
              <div class="section-header">Project Overview</div>
              <div style="text-align: left;">${
                processedDescription?.projectOverview ||
                "No project overview available"
              }</div>
            </div>
            
            <div class="section">
              <div class="section-header">Scope of Work</div>
              ${scopeOfWorkHtml}
            </div>
            
            <div class="section">
                <div class="section-header">Timeline</div>
                <div style="line-height: 1.7;">
                    <p>${
                      processedDescription?.timeline || "No timeline available"
                    }</p>
                    <p style="margin-top: 16px;"><strong>Project Start:</strong> ${
                      dayjs(estimateData?.projectStartDate).format(
                        "DD-MM-YYYY"
                      ) || "TBD"
                    }</p>
                    <p><strong>Project Completion:</strong> ${
                      dayjs(estimateData?.projectEndDate).format(
                        "DD-MM-YYYY"
                      ) || "TBD"
                    }</p>
                </div>
            </div>
            
            <div class="section" style="border-bottom: none;">
              <div class="section-header">Cost Breakdown</div>
              <p>${
                processedDescription?.pricing || "No pricing details available"
              }</p>
            </div>

          </body>
          </html>
        `;
};

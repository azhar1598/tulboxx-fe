import dayjs from "dayjs";

interface PrintTemplateProps {
  estimateData: any;
  aiContent: any;
  userProfile: any;
}

export const PrintTemplate = ({
  estimateData,
  aiContent,
  userProfile,
}: PrintTemplateProps) => {
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

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5in;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .no-print {
            display: none !important;
          }

          .print-container {
            font-family: Arial, sans-serif;
            color: #212529;
            font-size: 14px;
            line-height: 1.6;
          }

          .section-header {
            background-color: #212529 !important;
            color: #ffffff !important;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 16px;
            display: inline-block;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .header-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 32px;
            gap: 20px;
          }

          .header-left,
          .header-right {
            flex: 1;
          }

          .header-right {
            text-align: right;
          }

          .content-section {
            margin-bottom: 32px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }

          th {
            background-color: #f1f3f5 !important;
            border: 1px solid #dee2e6;
            padding: 12px;
            font-weight: bold;
            text-align: left;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          td {
            border: 1px solid #dee2e6;
            padding: 12px;
          }

          .total-section {
            text-align: right;
            margin-top: 16px;
          }

          .total-amount {
            background-color: #212529 !important;
            color: #ffffff !important;
            font-size: 16px;
            padding: 12px 24px;
            display: inline-block;
            font-weight: bold;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            gap: 40px;
          }

          .signature-box {
            flex: 1;
          }

          .signature-line {
            border-bottom: 1px solid #212529;
            width: 250px;
            height: 1px;
            margin: 32px 0 8px 0;
          }

          .signature-right .signature-line {
            margin-left: auto;
          }

          .logo-section {
            margin-bottom: 32px;
          }

          .logo-section img {
            width: 200px;
            height: auto;
          }
        }

        @media screen {
          .print-container {
            font-family: Arial, sans-serif;
            color: #212529;
            font-size: 14px;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
            min-height: 100vh;
          }

          .section-header {
            background-color: #212529;
            color: #ffffff;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 16px;
            display: inline-block;
          }

          .header-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 32px;
            gap: 20px;
          }

          .header-right {
            text-align: right;
          }

          .content-section {
            margin-bottom: 32px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }

          th {
            background-color: #f1f3f5;
            border: 1px solid #dee2e6;
            padding: 12px;
            font-weight: bold;
            text-align: left;
          }

          td {
            border: 1px solid #dee2e6;
            padding: 12px;
          }

          .total-section {
            text-align: right;
            margin-top: 16px;
          }

          .total-amount {
            background-color: #212529;
            color: #ffffff;
            font-size: 16px;
            padding: 12px 24px;
            display: inline-block;
            font-weight: bold;
          }

          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            gap: 40px;
          }

          .signature-line {
            border-bottom: 1px solid #212529;
            width: 250px;
            height: 1px;
            margin: 32px 0 8px 0;
          }

          .signature-right .signature-line {
            margin-left: auto;
          }

          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #007bff;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            z-index: 1000;
          }

          .print-button:hover {
            background-color: #0056b3;
          }
        }
      `}</style>

      <div className="print-container">
        <button
          className="no-print print-button"
          onClick={() => window.print()}
        >
          Print / Save PDF
        </button>

        {/* {userProfile?.logo && ( */}
        <div className="logo-section">
          <img
            src="https://evklfcvguukvkjlhcchu.supabase.co/storage/v1/object/public/user-logo/user-logo/1754211014737_beautiful-unique-logo-design-ecommerce-retail-company_1287271-14561.avif"
            alt="Company Logo"
          />
        </div>
        {/* )} */}

        <div className="header-section">
          <div className="header-left">
            <div className="section-header">PREPARED BY:</div>
            <div style={{ lineHeight: "1.7", padding: "8px 0" }}>
              <div style={{ fontWeight: "bold" }}>
                {userProfile?.companyName || "Company Name"}
              </div>
              <div>{userProfile?.address || "Company Address"}</div>
              <div>{userProfile?.email || "company@email.com"}</div>
            </div>
          </div>
          <div className="header-right">
            <div className="section-header">PREPARED FOR:</div>
            <div style={{ lineHeight: "1.7", padding: "8px 0" }}>
              <div style={{ fontWeight: "bold" }}>
                {estimateData?.clients?.name || "Client Name"}
              </div>
              <div>{estimateData?.clients?.email || "client@email.com"}</div>
              <div>{estimateData?.clients?.address || "Client Address"}</div>
              <div>{estimateData?.clients?.phone || "Client Phone"}</div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">PROJECT OVERVIEW:</div>
          <div>
            {processedDescription?.projectOverview ||
              "No project overview available"}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">SCOPE OF WORK:</div>
          <div>
            {Array.isArray(processedDescription?.scopeOfWork) ? (
              processedDescription.scopeOfWork.map((item, index) => (
                <div key={index} style={{ marginBottom: "8px" }}>
                  <span style={{ fontWeight: "bold", marginRight: "8px" }}>
                    •
                  </span>
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <div>No scope of work available</div>
            )}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">TIMELINE:</div>
          <div style={{ lineHeight: "1.7" }}>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Estimated Project Duration:</strong>{" "}
              {processedDescription?.timeline || "1 Full work day"}
            </p>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Start Availability:</strong> Can begin within 5 business
              days of approval
            </p>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Optional:</strong> Add weather buffer
            </p>
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">COST BREAKDOWN:</div>
          <table>
            <thead>
              <tr>
                <th>DESCRIPTION</th>
                <th style={{ textAlign: "center" }}>QUANTITY/UNIT</th>
                <th style={{ textAlign: "right" }}>UNIT PRICE</th>
                <th style={{ textAlign: "right" }}>LINE TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {estimateData?.lineItems?.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    ${item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-section">
            <div className="total-amount">TOTAL: ${totalAmount.toFixed(2)}</div>
          </div>
        </div>

        <div className="signature-section">
          <div className="signature-box">
            <p style={{ fontWeight: "bold", margin: "0 0 32px 0" }}>
              Client Signature
            </p>
            <div className="signature-line"></div>
            <p style={{ margin: "0" }}>Date: __________</p>
          </div>
          <div
            className="signature-box signature-right"
            style={{ textAlign: "right" }}
          >
            <p style={{ fontWeight: "bold", margin: "0 0 32px 0" }}>
              Company Representative
            </p>
            <div className="signature-line"></div>
            <p style={{ margin: "0" }}>Date: __________</p>
          </div>
        </div>
      </div>
    </>
  );
};

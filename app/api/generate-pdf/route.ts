import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function POST(request: Request) {
  try {
    const { htmlContent } = await request.json();

    if (!htmlContent) {
      return new NextResponse("Bad Request: htmlContent is required", {
        status: 400,
      });
    }

    // Use local chromium in development
    const executablePath =
      process.env.NODE_ENV === "development"
        ? "/opt/homebrew/bin/chromium" // For your local Mac
        : await chromium.executablePath(); // For the production server

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // Crucial for including background colors/images from CSS
      margin: {
        top: "40px",
        right: "40px",
        bottom: "40px",
        left: "40px",
      },
    });

    await browser.close();

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="estimate.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(`Error generating PDF: ${errorMessage}`, {
      status: 500,
    });
  }
}

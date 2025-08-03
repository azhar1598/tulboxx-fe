// import { NextResponse } from "next/server";
// import { renderToStream } from "@react-pdf/renderer";
// import { EstimatePDFDocument } from "../../../app/(dashboard)/estimates/preview/[estimateid]/PDFDocument";

// export async function POST(request: Request) {
//   try {
//     const { estimateData, aiContent, userProfile } = await request.json();

//     if (!estimateData || !aiContent || !userProfile) {
//       return new NextResponse("Bad Request: Missing required data", {
//         status: 400,
//       });
//     }

//     // Create the PDF document
//     const pdfDocument = EstimatePDFDocument({
//       estimateData,
//       aiContent,
//       userProfile,
//     });

//     // Generate PDF stream
//     const stream = await renderToStream(pdfDocument);

//     // Convert stream to buffer
//     const chunks: Buffer[] = [];
//     for await (const chunk of stream) {
//       chunks.push(chunk);
//     }
//     const pdfBuffer = Buffer.concat(chunks);

//     return new NextResponse(pdfBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="estimate.pdf"`,
//       },
//     });
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     return new NextResponse(`Error generating PDF: ${errorMessage}`, {
//       status: 500,
//     });
//   }
// }

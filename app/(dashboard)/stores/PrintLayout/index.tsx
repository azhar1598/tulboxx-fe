import { useState } from "react";
import { Modal, Text, NumberInput, Button, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPrinter } from "@tabler/icons-react";

export const PrintLayout = ({ storeInfo, qrCode, logoPreview }: any) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [numStickers, setNumStickers] = useState(4);

  const printQRStickers = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Stickers - ${storeInfo?.name}</title>
          <!-- Google Fonts Import -->
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4;
              margin: 10mm; /* Added margin around the page */
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            /* Define font families */
            :root {
              --primary-font: 'Playfair Display', serif;
              --secondary-font: 'Inter', sans-serif;
              --heading-font: 'Poppins', sans-serif;
            }
            
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              font-family: var(--secondary-font);
              margin: 0;
              padding: 0;
              width: 210mm;
              height: 297mm;
              background-color: #fff;
            }

            .print-container {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              grid-template-rows: repeat(2, 1fr);
              width: 190mm; /* Adjusted for page margins */
              height: 277mm; /* Adjusted for page margins */
              gap: 10mm; /* Added gap between stickers */
              padding: 5mm; /* Added padding inside container */
            }

            .sticker {
              width: 94mm; /* Adjusted width accounting for gaps */
              height: 144.5mm; /* Adjusted height accounting for gaps */
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 8mm;
              box-sizing: border-box;
              background-color: ${storeInfo?.qrTheme.primaryColor} !important;
              color: white !important;
              border-radius: 2mm; /* Added slight rounded corners */
              box-shadow: 0 0 0 1px #ddd; /* Added subtle border */
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            .header {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              margin-bottom: 16px;
              width: 100%;
            }

            .logo-container {
              width: 54px;
              height: 54px;
              background: white;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: ${storeInfo?.qrTheme.radius || "4px"};
            }

            .logo-text {
              color: cyan !important;
              font-weight: 550;
              font-family: var(--heading-font);
              font-size: 22px;
            }

            .store-name {
              font-size: ${storeInfo?.qrTheme.titleFontSize || "22px"};
              font-weight: 600;
              font-family: var(--heading-font);
              color: white !important;
            }

            .main-content {
              text-align: center;
              margin-bottom: 16px;
            }

            .primary-text {
              font-size: 2.25rem;
              font-weight: bold;
              font-family: var(--primary-font);
              color: ${storeInfo?.qrTheme.secondaryColor} !important;
              margin-bottom: 10px;
              line-height: 1.2;
            }

            .cta-text {
              display: inline-block;
              padding: 8px 24px;
              border-radius: 9999px;
              background-color: ${storeInfo?.qrTheme.ctaColor} !important;
              color: white !important;
              font-size: 1.25rem;
              font-family: var(--secondary-font);
            }

            .qr-container {
              background: white;
              width: 180px;
              height: 180px;
              margin: 16px auto;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .footer-text {
              font-size: 0.95rem;
              max-width: 75mm;
              margin: 0 auto;
              text-align: center;
              color: white !important;
              font-family: var(--secondary-font);
              line-height: 1.4;
            }

            .powered-by {
              font-size: 0.875rem;
              color: white !important;
              margin-top: 10px;
              font-family: var(--secondary-font);
              opacity: 0.9;
            }

            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              
              body { 
                margin: 0; 
                padding: 0;
              }
              
              .sticker {
                break-inside: avoid;
                page-break-inside: avoid;
                margin: 0;
              }

              /* Ensure fonts are embedded in print */
              @font-face {
                font-family: 'Playfair Display';
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtXK-F2qC0s.woff2) format('woff2');
              }
              @font-face {
                font-family: 'Inter';
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2) format('woff2');
              }
              @font-face {
                font-family: 'Poppins';
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${Array(4)
              .fill(0)
              .map(
                () => `
              <div class="sticker">
                <div class="header">
                  <div class="logo-container">
                    ${
                      !logoPreview
                        ? `<span class="logo-text">${storeInfo?.name
                            ?.slice(0, 2)
                            .toUpperCase()}</span>`
                        : `<img src="${logoPreview}" width="130" height="130" style="border-radius: ${
                            storeInfo?.qrTheme.radius || "4px"
                          }" />`
                    }
                  </div>
                  <span class="store-name">${
                    storeInfo?.name || "Your Store"
                  }</span>
                </div>
                
                <div class="main-content">
                  <div class="primary-text">${
                    storeInfo?.qrTheme.primaryText
                  }</div>
                  <div class="cta-text">${storeInfo?.qrTheme.ctaText}</div>
                </div>

                <div class="qr-container">
                  ${document.getElementById("store-qr-code").outerHTML}
                </div>

                <p class="footer-text">
                  For any assistance or special requests, feel free to ask our friendly staff. 
                  Enjoy your dining experience with us!
                </p>
                <div class="powered-by">Powered by DigiMenu</div>
              </div>
            `
              )
              .join("")}
          </div>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <Button
        onClick={open}
        variant="outline"
        leftSection={<IconPrinter size={16} />}
        className="mt-4 ml-2"
      >
        Print Stickers
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Print QR Code Stickers"
        size="md"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            This will print 4 QR code stickers on an A4 sheet in a 2x2 grid
            layout with proper spacing.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                printQRStickers();
                close();
              }}
              leftSection={<IconPrinter size={16} />}
            >
              Print
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

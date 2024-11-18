import { useEffect, useState } from "react";
import {
  Modal,
  Text,
  Button,
  Group,
  Stack,
  SegmentedControl,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPrinter } from "@tabler/icons-react";

export const PrintLayout = ({ storeInfo, qrCode }: any) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [layoutType, setLayoutType] = useState("four");
  const [logoPreview, setLogoPreview] = useState<any>("");

  useEffect(() => {
    if (!storeInfo?.logo) return;
    if (typeof storeInfo?.logo === "string") {
      setLogoPreview(storeInfo?.logo);
      return;
    }
    const file = storeInfo?.logo;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const getLayoutStyles = (type: string) => {
    switch (type) {
      case "one":
        return `
          .print-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 190mm;
            height: 277mm;
            padding: 5mm;
          }
          .sticker {
            width: 190mm;
            height: 277mm;
          }
        `;
      case "two":
        return `
          .print-container {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: repeat(2, 1fr);
            width: 190mm;
            height: 277mm;
            gap: 10mm;
            padding: 5mm;
          }
          .sticker {
            width: 190mm;
            height: 133.5mm;
          }
        `;
      default: // "four"
        return `
          .print-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            width: 190mm;
            height: 277mm;
            gap: 10mm;
            padding: 5mm;
          }
          .sticker {
            width: 94mm;
            height: 144.5mm;
          }
        `;
    }
  };

  const printQRStickers = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Stickers - ${storeInfo?.name}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4;
              margin: 10mm;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            :root {
              --primary-font: 'Heebo', sans-serif;
              --secondary-font: 'Heebo', sans-serif;
              --heading-font: 'Heebo', sans-serif;
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

            ${getLayoutStyles(layoutType)}

            .sticker {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 8mm;
              box-sizing: border-box;
              background-color: ${storeInfo?.qrTheme.primaryColor} !important;
              color: white !important;
              border-radius: 2mm;
              box-shadow: 0 0 0 1px #ddd;
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
              width: ${layoutType === "one" ? "108px" : "54px"};
              height: ${layoutType === "one" ? "108px" : "54px"};
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
              font-size: ${layoutType === "one" ? "44px" : "22px"};
            }

            .store-name {
              font-size: ${
                layoutType === "one"
                  ? "44px"
                  : storeInfo?.qrTheme.titleFontSize || "22px"
              };
              font-weight: 600;
              font-family: var(--heading-font);
              color: white !important;
            }

            .main-content {
              text-align: center;
              margin-bottom: 16px;
            }

            .primary-text {
              font-size: ${layoutType === "one" ? "4.5rem" : "2.25rem"};
              font-weight: bold;
              font-family: var(--primary-font);
              color: ${storeInfo?.qrTheme.secondaryColor} !important;
              margin-bottom: 10px;
              line-height: 1.2;
            }

            .cta-text {
              display: inline-block;
              padding: ${layoutType === "one" ? "16px 48px" : "8px 24px"};
              border-radius: 9999px;
              background-color: ${storeInfo?.qrTheme.ctaColor} !important;
              color: white !important;
              font-size: ${layoutType === "one" ? "2.5rem" : "1.25rem"};
              font-family: var(--secondary-font);
            }

            .qr-container {
           
              width: ${layoutType === "one" ? "360px" : "180px"};
              height: ${layoutType === "one" ? "360px" : "180px"};
              margin: 16px auto;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              
            }

            .footer-text {
              font-size: ${layoutType === "one" ? "1.9rem" : "0.95rem"};
              max-width: ${layoutType === "one" ? "150mm" : "75mm"};
              margin: 0 auto;
              text-align: center;
              color: white !important;
              font-family: var(--secondary-font);
              line-height: 1.4;
            }

            .powered-by {
              font-size: ${layoutType === "one" ? "1.75rem" : "0.875rem"};
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

              @font-face {
                font-family: 'Heebo';
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/heebo/v21/NGSpv5_NC0k9P_v6ZUCbLRAHxK1EiSysdUmj.woff2) format('woff2');
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${Array(layoutType === "one" ? 1 : layoutType === "two" ? 2 : 4)
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
                        : `<img src="${logoPreview}" 
                           width="${layoutType === "one" ? "100" : "60"}" 
                           height="${layoutType === "one" ? "100" : "60"}" 
                           style="border-radius: ${
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
                <div class="powered-by">Powered by Storekode.com</div>
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
          <Text size="sm" c="dimmed" mb="xs">
            Choose your preferred layout for printing on an A4 sheet:
          </Text>

          <SegmentedControl
            value={layoutType}
            onChange={setLayoutType}
            data={[
              { label: "Single Full Page", value: "one" },
              { label: "Two Half Pages", value: "two" },
              { label: "2x2 Grid (4)", value: "four" },
            ]}
            fullWidth
          />

          <Text size="sm" c="dimmed" mt="md">
            {layoutType === "one"
              ? "This will print a single full-page QR sticker on an A4 sheet."
              : layoutType === "two"
              ? "This will print 2 half-page QR stickers on an A4 sheet."
              : "This will print 4 QR stickers in a 2x2 grid on an A4 sheet."}
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

"use client";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import {
  TextInput,
  Group,
  Button,
  Box,
  Paper,
  Title,
  Stack,
  Text,
  SegmentedControl,
  Flex,
  Modal,
} from "@mantine/core";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconPrinter,
  IconId,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { useMutation } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useState } from "react";
import GLogo from "../../../../public/assets/greview.png";
import Image from "next/image";
import ReviewUI from "./ReviewUI";
import QRCode from "react-qr-code";
import LogoImage from "../../../../public/assets/logo/logo.png";

// Define the validation schema using zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
});

const QrReviewForm = () => {
  const router = useRouter();

  const [layoutType, setLayoutType] = useState("four");
  const [logoPreview, setLogoPreview] = useState<any>("");
  const notification = usePageNotifications();
  const form = useForm({
    validate: zodResolver(formSchema),
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  });

  const [isRidModalOpen, setIsRidModalOpen] = useState(false);
  const [customRid, setCustomRid] = useState("");
  const [useAutoRid, setUseAutoRid] = useState(true);

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

  const printQRStickers = (rid?: string) => {
    const printWindow = window.open("", "_blank");

    // Generate sticker HTML dynamically
    const stickerCount =
      layoutType === "one" ? 1 : layoutType === "two" ? 2 : 4;

    const generateUniqueId = () => {
      return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };

    // Generate sticker HTML dynamically
    const stickersHTML = Array(stickerCount)
      .fill(null)
      .map(() => {
        const uniqueId = rid || generateUniqueId();

        return `
        <div class="sticker">
          <div class="header">
            ${document.getElementById("g-logo").outerHTML}
          </div>
          <div class="desc">
            <span class="reviews-text">Reviews</span>
            <span class="reviews-stars">★★★★★</span>
          </div>
          <div class="qr-container">
            ${document.getElementById("review-qr-code").outerHTML}
          </div>
          <div class="main-content">
            <p class="qr-id">RID: ${uniqueId}</p> <!-- Display unique ID -->
            <div class="emoji-container">
              <span class="emoji">😞</span>
              <span class="emoji">😟</span>
              <span class="emoji">😐</span>
              <span class="emoji">🙂</span>
              <span class="emoji">😊</span>
            </div>
            <div class="cta-text">HELP US IMPROVE !</div>
              <div class="progress-bar">
                  <div class="progress-bar__segment progress-bar__segment--red" style="width: 20%;"></div>
    <div class="progress-bar__segment progress-bar__segment--orange" style="width: 20%;"></div>
    <div class="progress-bar__segment progress-bar__segment--yellow" style="width: 20%;"></div>
        <div class="progress-bar__segment progress-bar__segment--lightgreen" style="width: 20%;"></div>
    <div class="progress-bar__segment progress-bar__segment--green" style="width: 20%;"></div>
    <div class="progress-bar__segment progress-bar__segment--star">&#9733;</div>
  </div>
       
          </div>
          <div class="powered-by">© Powered by  Storekode.com
       
           </div>
        </div>
      `;
      })
      .join("");

    printWindow.document.write(`
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Google Reviews Sticker</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 5mm;
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
          display: grid;
          ${
            layoutType === "one"
              ? "grid-template-columns: 1fr;"
              : layoutType === "two"
              ? "grid-template-columns: 1fr; grid-template-rows: repeat(2, 1fr);;"
              : "grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 1fr); gap: 10mm;"
          }
          align-items: center;
          justify-items: center;
          padding: 5mm;
          box-sizing: border-box;
        }
  
        .sticker {
          position: relative;
          width: ${
            layoutType === "one"
              ? "190mm"
              : layoutType === "two"
              ? "190mm"
              : "90mm"
          };
          height: ${
            layoutType === "one"
              ? "277mm"
              : layoutType === "two"
              ? "133.5mm"
              : "140mm"
          };
          background-color: white;
          border-radius: 20px;
          padding: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border-top: 20px solid #ff3838e6;
          border-left: 20px solid #008000b0;
          border-bottom: 20px solid #ffc872;
          border-right: 20px solid #005cff9e;
        }
  
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
   
        }
  
        .desc {
          margin-bottom: 20px;
        }
        .qr-id{
        font-size: ${layoutType === "one" ? "20px" : "12px"};
        margin-top:-15px;
        }
  
        .google-logo {
          width: 108px;
          height: 108px;
        }
  
        .reviews-text {
          font-size: ${layoutType === "one" ? "50px" : "30px"};
          font-weight: 600;
          color: #0000007a !important;
        }
  
        .reviews-stars {
          font-size:${layoutType === "one" ? "58px" : "28px"};
          color: #FBBC05 !important;
        }
  
        .main-content {
          text-align: center;
          margin-top: 20px;
        }
  
        .tap-text {
          font-size: 20px;
          font-weight: 500;
          color: #000 !important;
        }
  
        .cta-text {
          font-size: ${layoutType === "one" ? "62px" : "32px"};
          font-weight: 600;
          color: #DB4437 !important;
        }
  
        .we-feedback {
          font-size: 20px;
          color: gray !important;
          margin-top:-20px;
        }
  
        .emoji-container {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }
  
        .emoji {
          font-size: 24px;
        }
  
        .qr-container {
          width: ${layoutType === "one" ? "440px" : "180px"};
          height: ${layoutType === "one" ? "440px" : "180px"};;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding:10px;

          border-top: 5px solid #ff3838e6;
          border-left: 5px solid #008000b0;
          border-bottom: 5px solid #ffc872;
          border-right: 5px solid #005cff9e;
        }
  
        .footer-text {
          font-size: 14px;
          max-width: 150mm;
          text-align: center;
          color: #000 !important;
        }
  
        .powered-by {
          font-size: ${layoutType === "one" ? "22px" : "14px"};;
          color: #00000 !important;
          opacity: 0.9;
        margin-top:10px;
        font-weight:600
        
     
        }
        .powered-by-storekode{
        color:orange;
        font-weight:600;
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

 .progress-bar {
      display: flex;
      height: 16px;
      border-radius: 7px;
      overflow: hidden;
    }

    .progress-bar__segment {
      flex-grow: 1;
      transition: width 0.3s ease-in-out;
    }


      .progress-bar__segment--red {
      background-color: red;
    }

    .progress-bar__segment--orange {
      background-color: #ff6b6b;
    }

    .progress-bar__segment--yellow {
      background-color: #ffd166;
    }


    .progress-bar__segment--lightgreen {
      background-color: #90EE90;
    }


    .progress-bar__segment--green {
      background-color: #06d6a0;
    }

    .progress-bar__segment--star {
      width: 20px;
      background-color: #383838;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #fff;
    }


      </style>
    </head>
    <body>
      ${stickersHTML}
    </body>
    </html>
    `);
    printWindow.document.close();

    // Trigger print dialog after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handlePrint = () => {
    if (useAutoRid) {
      // If using auto-generated RID, print directly
      printQRStickers();
    } else {
      // Open RID input modal
      setIsRidModalOpen(true);
    }
  };

  const ridSchema = z.object({
    rid: z.string().min(3, "RID must be at least 3 characters"),
  });

  const ridForm = useForm({
    validate: zodResolver(ridSchema),
    initialValues: {
      rid: "",
    },
  });

  const handleRidSubmit = () => {
    ridForm.validate();

    if (ridForm.isValid()) {
      // Close modal and print with custom RID
      setIsRidModalOpen(false);
      printQRStickers(customRid);
    }
  };

  return (
    <Stack>
      <Text size="sm" c="dimmed" mb="xs">
        Choose your preferred layout for printing on an A4 sheet:
      </Text>

      {/* <Flex justify={'center'}>
        <ReviewUI />
      </Flex> */}
      <div className="hidden">
        <Image
          height={layoutType === "one" ? 200 : 80}
          width={layoutType === "one" ? 600 : 250}
          src={GLogo}
          alt="glogo"
          id="g-logo"
        />

        <Image
          height={layoutType === "one" ? 250 : 50}
          width={layoutType === "one" ? 250 : 50}
          src={LogoImage}
          alt="glogo"
          id="storekode-logo"
        />

        <QRCode
          id="review-qr-code"
          value={""}
          size={256}
          className="h-64 w-64 "
          style={{ height: "500px", width: "500px" }}
        />
      </div>

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
        <Button variant="outline">Cancel</Button>
        <Button
          onClick={() => {
            setIsRidModalOpen(true);
            // printQRStickers();
            // close();
          }}
          leftSection={<IconPrinter size={16} />}
        >
          Print
        </Button>
      </Group>

      <Modal
        opened={isRidModalOpen}
        onClose={() => setIsRidModalOpen(false)}
        title="Review ID (RID)"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Enter a custom Review ID or use an auto-generated one.
          </Text>
          <Group>
            <Button
              variant={useAutoRid ? "filled" : "outline"}
              onClick={() => {
                setUseAutoRid(true);
                setIsRidModalOpen(false);
                printQRStickers();
              }}
            >
              Use Auto-generated RID
            </Button>
            <Button
              variant={!useAutoRid ? "filled" : "outline"}
              onClick={() => setUseAutoRid(false)}
            >
              Use Custom RID
            </Button>
          </Group>

          {!useAutoRid && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRidSubmit();
              }}
            >
              <TextInput
                leftSection={<IconId size={16} />}
                placeholder="Enter Review ID"
                label="Custom Review ID"
                description="Unique identifier for this review sticker"
                {...ridForm.getInputProps("rid")}
                value={customRid}
                onChange={(event) => {
                  setCustomRid(event.currentTarget.value);
                  ridForm.setFieldValue("rid", event.currentTarget.value);
                }}
              />
              <Group justify="flex-end" mt="md">
                <Button type="submit" leftSection={<IconPrinter size={16} />}>
                  Print with Custom RID
                </Button>
              </Group>
            </form>
          )}
        </Stack>
      </Modal>
    </Stack>
  );
};

export default QrReviewForm;

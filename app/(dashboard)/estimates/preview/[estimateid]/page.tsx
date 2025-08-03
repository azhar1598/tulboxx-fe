"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Group,
  Stack,
  Tabs,
  Center,
  LoadingOverlay,
} from "@mantine/core";
import { useReactToPrint } from "react-to-print";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import { PageHeader } from "@/components/common/PageHeader";
import {
  EditIcon,
  PrinterIcon,
  SaveIcon,
  PlusCircle,
  Trash2,
  LayoutIcon,
  CodeIcon,
  ShareIcon,
} from "lucide-react";
import html2pdf from "html2pdf.js";

import { useMutation, useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useParams } from "next/navigation";
import { extractEstimateJson1 } from "@/lib/constants";
import { generatePDFTemplate } from "./PDFTemplate";
import { FullDocumentEditor, sectionsToFullDocument } from "./Editors";
import { EstimateContent } from "./EstimateContent";
import dayjs from "dayjs";
import { pdf } from "@react-pdf/renderer";
import { EstimatePDFDocument } from "./PDFDocument"; // Your PDF document component

interface EstimateData {
  projectName: string;
  customerName: string;
  email: string;
  phone: number;
  address: string;
  type: string;
  serviceType: string;
  problemDescription: string;
  solutionDescription: string;
  projectEstimate: number;
  projectStartDate: string;
  projectEndDate: string;
  lineItems: Array<{
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  equipmentMaterials: string;
  additionalNotes: string;
}
const EstimatePreview: React.FC<{ estimateData?: EstimateData }> = ({
  estimateData,
}) => {
  const { estimateid } = useParams();

  const getEstimateQuery = useQuery({
    queryKey: ["estimate", estimateid],
    queryFn: () => callApi.get(`/estimates/${estimateid}`),
    select: (data) => data.data,
  });

  const getUserProfile = useQuery({
    queryKey: ["get-user-profile"],
    queryFn: async () => {
      const response = await callApi.get(`/user-profile`);
      return response;
    },
    select: (data) => data?.data,
  });

  console.log("userProfile", getUserProfile?.data);

  const [isEditing, setIsEditing] = useState(false);
  const [isFullEditor, setIsFullEditor] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [aiContent, setAiContent] = useState();
  const [fullDocumentHtml, setFullDocumentHtml] = useState("");
  const [pdfContent, setPdfContent] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfRef = useRef(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (getEstimateQuery?.data) {
      const parsedContent: any = extractEstimateJson1(
        getEstimateQuery?.data?.ai_generated_estimate
      );

      setAiContent(parsedContent);
    }
  }, [getEstimateQuery?.data]);

  useEffect(() => {
    if (getEstimateQuery?.data && aiContent && getUserProfile?.data) {
      const htmlContent = generatePDFTemplate(
        getEstimateQuery.data,
        aiContent,
        getUserProfile?.data
      );
      setPdfContent(htmlContent);
    }
  }, [getEstimateQuery?.data, aiContent, getUserProfile?.data]);

  const componentRef = useRef(null);

  const handlePrintPDF = async () => {
    if (!getEstimateQuery?.data || !aiContent || !getUserProfile?.data) {
      console.error("Missing data for PDF generation");
      return;
    }

    setIsGeneratingPdf(true);
    try {
      const blob = await pdf(
        <EstimatePDFDocument
          estimateData={getEstimateQuery.data}
          aiContent={aiContent}
          userProfile={getUserProfile.data}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Estimate-${
        getEstimateQuery.data?.projectName || estimateid
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // const handleSaveEstimate = async (data) => {
  //   try {
  //     setSaving(true);
  //     console.log("getEstimateQuery?.data", getEstimateQuery?.data, data);
  //     // Update the estimate with the new data
  //     await callApi.patch(`/estimates/${estimateid}`, {
  //       ...getEstimateQuery?.data,
  //       clientId: getEstimateQuery?.data.client_id,
  //       ai_generated_estimate: JSON.stringify(data.description),
  //       lineItems: data.lineItems,
  //       projectEstimate: Number(getEstimateQuery?.data.projectEstimate),
  //     });

  //     // Exit editing mode
  //     setIsEditing(false);
  //   } catch (error) {
  //     console.error("Error saving estimate:", error);
  //     // Handle error (show notification, etc.)
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleShare = async () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: getEstimateQuery?.data?.projectName || "Project Estimate",
          text: `Estimate for ${getEstimateQuery?.data?.projectName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      // You could either show a modal with sharing options or use direct links
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(
        getEstimateQuery?.data?.projectName || "Project Estimate"
      );

      window.open(
        `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        "_blank"
      );
      // Or you could implement a modal with multiple sharing options
    }
  };

  const handleViewPDF = async () => {
    const blob = await pdf(
      <EstimatePDFDocument
        estimateData={getEstimateQuery?.data}
        aiContent={aiContent}
        userProfile={getUserProfile?.data}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <>
      <div ref={pdfRef} style={{ display: "none" }}></div>

      <PageHeader
        title="Estimate Preview"
        rightSection={
          <Group mb={15} className="no-print">
            {!isEditing ? (
              <>
                <Button
                  leftSection={<EditIcon size={16} />}
                  onClick={() => setIsEditing(true)}
                  color="blue"
                >
                  Edit Estimate
                </Button>
                <Button
                  leftSection={<PrinterIcon size={16} />}
                  onClick={handlePrintPDF}
                  color="teal"
                  loading={isGeneratingPdf}
                >
                  Download PDF
                </Button>
                <Button
                  leftSection={<ShareIcon size={16} />}
                  onClick={handleShare}
                  color="teal"
                >
                  Share Estimate
                </Button>
              </>
            ) : (
              <Button
                leftSection={<Trash2 size={16} />}
                onClick={() => setIsEditing(false)}
                color="red"
              >
                Cancel Editing
              </Button>
            )}
          </Group>
        }
      />
      <PageMainWrapper w="full">
        {getEstimateQuery?.isLoading && (
          <Center h={"100vh"}>
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
              loaderProps={{ type: "bars" }}
            />
          </Center>
        )}
        <Stack gap={10}>
          {activeTab === "preview" && (
            <div ref={componentRef} className="md:p-4 bg-white">
              {/* <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold">Project Estimate</h1>
                <p className="text-gray-600">
                  {getEstimateQuery?.data?.projectName}
                </p>
              </div> */}

              <EstimateContent
                descriptionJson={aiContent}
                isEditing={isEditing}
                isFullEditor={isFullEditor}
                lineItems={getEstimateQuery?.data?.lineItems}
                getEstimateQuery={getEstimateQuery}
                setIsEditing={setIsEditing}
              />

              {!isEditing && (
                <div className="mt-16 border-t pt-4">
                  <div className="flex justify-between mt-8">
                    <div>
                      <p className="font-bold">Client Signature</p>
                      <div className="mt-4 border-b w-48 h-8"></div>
                      <p className="mt-2">Date: _________________</p>
                    </div>
                    <div>
                      <p className="font-bold">Company Representative</p>
                      <div className="mt-4 border-b w-48 h-8"></div>
                      <p className="mt-2">Date: _________________</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Stack>
      </PageMainWrapper>
    </>
  );
};

export default EstimatePreview;

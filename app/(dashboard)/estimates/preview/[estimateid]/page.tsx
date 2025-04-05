"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button, Group, Stack, Textarea, Switch, Tabs } from "@mantine/core";
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
} from "lucide-react";

// Enhanced editor imports
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { useParams } from "next/navigation";
import { extractEstimateJson, extractEstimateJson1 } from "@/lib/constants";

interface GeneratedDescription {
  projectOverview: string;
  scopeOfWork: string[] | string;
  timeline: string;
  pricing: string;
}

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

// Display component for estimate sections
const EstimateDescription = ({
  descriptionJson,
  isEditing,
  isFullEditor,
  // onUpdate,
  lineItems,
}) => {
  // console.log("descriptionJson", descriptionJson);

  const processedDescription = {
    ...descriptionJson,
    scopeOfWork:
      typeof descriptionJson?.scopeOfWork === "string"
        ? descriptionJson?.scopeOfWork
            .split(/\\n|\\r|\n/)
            .filter((item) => item.trim())
            .map((item) => item.replace(/^- /, ""))
        : descriptionJson?.scopeOfWork,
  };

  const [description, setDescription] = useState<GeneratedDescription>();

  useEffect(() => {
    setDescription(processedDescription);
  }, [descriptionJson]);

  console.log("description", description);

  // Handler for editing text fields
  // const handleTextChange = (field, value) => {
  //   setDescription({
  //     ...description,
  //     [field]: value,
  //   });
  //   onUpdate({
  //     ...description,
  //     [field]: value,
  //   });
  // };

  // const handleScopeItemChange = (index, value) => {
  //   if (!Array.isArray(description.scopeOfWork)) return;

  //   const newScopeOfWork = [...description.scopeOfWork];
  //   newScopeOfWork[index] = value;
  //   setDescription({
  //     ...description,
  //     scopeOfWork: newScopeOfWork,
  //   });
  //   onUpdate({
  //     ...description,
  //     scopeOfWork: newScopeOfWork,
  //   });
  // };

  // const addScopeItem = () => {
  //   const newScopeOfWork = Array.isArray(description.scopeOfWork)
  //     ? [...description.scopeOfWork, "New task item"]
  //     : [description.scopeOfWork, "New task item"];

  //   setDescription({
  //     ...description,
  //     scopeOfWork: newScopeOfWork,
  //   });
  //   onUpdate({
  //     ...description,
  //     scopeOfWork: newScopeOfWork,
  //   });
  // };

  // const removeScopeItem = (index) => {
  //   if (
  //     Array.isArray(description.scopeOfWork) &&
  //     description.scopeOfWork.length > 1
  //   ) {
  //     const newScopeOfWork = [...description.scopeOfWork];
  //     newScopeOfWork.splice(index, 1);
  //     setDescription({
  //       ...description,
  //       scopeOfWork: newScopeOfWork,
  //     });
  //     onUpdate({
  //       ...description,
  //       scopeOfWork: newScopeOfWork,
  //     });
  //   }
  // };

  // If in full editor mode, just return nothing as the editor is handled at the parent level
  if (isFullEditor) {
    return null;
  }

  // Original section-by-section editing or display
  return (
    <Group gap={20} className="md:w-full">
      <Stack className="w-full">
        <h2 className="text-xl font-bold">Project Overview</h2>
        {isEditing ? (
          <div className="mb-4">
            {/* <Editor
              content={description.projectOverview}
              onChange={(value) => handleTextChange("projectOverview", value)}
            /> */}
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: description?.projectOverview }}
          />
        )}
      </Stack>

      <Stack className="w-full">
        <h2 className="text-xl font-bold">Scope of Work</h2>
        {isEditing ? (
          <>
            <ul className="list-none pl-0">
              {Array.isArray(description?.scopeOfWork) ? (
                description.scopeOfWork.map((item, index) => (
                  <li key={index} className="mb-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-grow">
                        {/* <Editor
                          content={item}
                          onChange={(value) =>
                            handleScopeItemChange(index, value)
                          }
                        /> */}
                      </div>
                      <Button
                        color="red"
                        variant=""
                        // onClick={() => removeScopeItem(index)}
                        disabled={description.scopeOfWork.length <= 1}
                        className="mt-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </li>
                ))
              ) : (
                <div className="mb-4">
                  {/* <Editor
                    content={description.scopeOfWork}
                    onChange={(value) => handleTextChange("scopeOfWork", value)}
                  /> */}
                </div>
              )}
            </ul>
            {Array.isArray(description.scopeOfWork) && (
              <Button
                variant=""
                color="blue"
                // onClick={addScopeItem}
                className="self-start mt-2"
                leftSection={<PlusCircle size={16} />}
              >
                Add Item
              </Button>
            )}
          </>
        ) : (
          <ul className="list-disc pl-6">
            {Array.isArray(description?.scopeOfWork) ? (
              description?.scopeOfWork.map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
              ))
            ) : typeof description?.scopeOfWork === "string" ? (
              description?.scopeOfWork
                .split(/\\n|\\r|\n/)
                .filter((item) => item.trim())
                .map((item, index) => (
                  <li key={index}>{item.replace(/^- /, "")}</li>
                ))
            ) : (
              <li>No scope items</li>
            )}
          </ul>
        )}
      </Stack>

      <Stack className="w-full">
        <h2 className="text-xl font-bold">Timeline</h2>
        {isEditing ? (
          <div className="mb-4">
            {/* <Editor
              content={description.timeline}
              onChange={(value) => handleTextChange("timeline", value)}
            /> */}
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: description?.timeline }} />
        )}
      </Stack>

      <Stack className="w-full">
        <h2 className="text-xl font-bold">Pricing</h2>
        {isEditing ? (
          <div className="mb-4">
            {/* <Editor
              content={description.pricing}
              onChange={(value) => handleTextChange("pricing", value)}
            /> */}
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: description?.pricing }} />
        )}
      </Stack>

      <div className="line-items mt-8 w-full">
        <h2 className="text-xl font-semibold mb-2">Line Items</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2 text-right">Quantity</th>
              <th className="border p-2 text-right">Unit Price</th>
              <th className="border p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Line items would be rendered here */}

            {lineItems?.map((item) => (
              <tr key={item.id}>
                <td className="border p-2 text-left">{item.description}</td>
                <td className="border p-2 text-right"> ${item.unitPrice}</td>
                <td className="border p-2 text-right"> x{item.quantity}</td>
                <td className="border p-2 text-right"> ${item.totalPrice}</td>
              </tr>
            ))}

            {/* <tr className="text-center">
              <td colSpan={4} className="py-4 italic text-gray-500">
                {isEditing
                  ? "Line items can be added here"
                  : "No line items available"}
              </td>
            </tr> */}
          </tbody>
        </table>
        <div className="flex justify-end mt-4">
          <p className="text-right">
            <span className="font-bold">Grand Total</span>
            <span className="font-bold">
              {" "}
              ${lineItems?.reduce((acc, item) => acc + item.totalPrice, 0)}
            </span>
          </p>
        </div>
      </div>

      <Stack className="w-full">
        <p>
          We ensure that all aspects of the project will comply with relevant
          regulations and standards. Should any unforeseen complications arise
          during the project, we will notify you immediately and discuss any
          necessary adjustments. We value your trust and look forward to helping
          you enhance your home. Please feel free to contact us with any
          questions or concerns you may have.
        </p>
      </Stack>
    </Group>
  );
};

const EstimatePreview: React.FC<{ estimateData?: EstimateData }> = ({
  estimateData,
}) => {
  const { estimateid } = useParams();
  // Sample JSON data for testing
  const sampleJsonData = `json\n{\n  "projectOverview": "We are pleased to present this project estimate for the installation of a comprehensive drainage system at your residence, Mr. Mohammed. This system is specifically designed to address the current yard flooding issues, protecting your property from water damage and enhancing its overall usability and value.",\n  "scopeOfWork": "- Conduct a thorough site assessment to determine optimal drainage system placement and design.\\n- Excavate trenches and prepare the ground for drainage pipe installation.\\n- Install high-quality drainage pipes and gravel bedding to facilitate efficient water runoff.\\n- Connect the drainage system to a designated outflow point, ensuring proper water disposal.\\n- Backfill trenches and restore the landscape to its original condition, including reseeding or resodding as needed.\\n- Conduct a final inspection and testing to verify the system\'s functionality and effectiveness.",\n  "timeline": "The project is expected to take 3 weeks (approximately 16 days) for completion, contingent upon weather conditions and site accessibility.",\n  "pricing": "The total cost for the project is $2000. This pricing is all-inclusive and covers all labor, materials, equipment, and disposal fees associated with the drainage system installation. There are no hidden costs or additional charges beyond this quoted amount."\n}\n`;

  const getEstimateQuery = useQuery({
    queryKey: ["estimate", estimateid],
    queryFn: () => callApi.get(`/estimates/${estimateid}`),
    select: (data) => data.data,
  });

  console.log("getEstimateQuery");

  const [isEditing, setIsEditing] = useState(false);
  const [isFullEditor, setIsFullEditor] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [aiContent, setAiContent] = useState();
  const [fullDocumentHtml, setFullDocumentHtml] = useState("");

  useEffect(() => {
    if (getEstimateQuery?.data) {
      console.log(
        "compare",
        getEstimateQuery?.data,
        getEstimateQuery?.data?.ai_generated_estimate,
        sampleJsonData
      );
      const parsedContent: any = extractEstimateJson1(
        getEstimateQuery?.data?.ai_generated_estimate
      );
      console.log("parsedContent", parsedContent);
      setAiContent(parsedContent);
    }
  }, [getEstimateQuery?.data]);

  console.log("aiContent", aiContent);

  // Reference for the printable content
  const componentRef = useRef(null);

  // Print/PDF download handler
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: "Project_Estimate",
  //   pageStyle: `
  //     @page {
  //       size: auto;
  //       margin: 20mm;
  //     }
  //     @media print {
  //       .no-print {
  //         display: none;
  //       }
  //     }
  //   `,
  // });

  // Update description data
  // const handleUpdateDescription = (newData) => {
  //   setAiContent(newData);
  // };

  // // Toggle edit mode
  // const toggleEditing = () => {
  //   if (isEditing) {
  //     // Exiting edit mode
  //     setIsEditing(false);
  //     setIsFullEditor(false);
  //     setActiveTab("preview");
  //   } else {
  //     // Entering edit mode - choose the last editing mode used
  //     setIsEditing(true);
  //     setActiveTab(isFullEditor ? "fullEditor" : "sectionEditor");
  //   }
  // };

  // Toggle between full and sectional editing
  // const switchToFullEditor = () => {
  //   if (!isFullEditor) {
  //     // Converting from sections to full document
  //     const fullDoc = sectionsToFullDocument(aiContent);
  //     setFullDocumentHtml(fullDoc);
  //     setIsFullEditor(true);
  //     setActiveTab("fullEditor");
  //   }
  // };

  const switchToSectionEditor = () => {
    setIsFullEditor(false);
    setActiveTab("sectionEditor");
  };

  // Save the full document and extract sections
  // const handleSaveFullDocument = (html) => {
  //   setFullDocumentHtml(html);

  //   // This function would parse the full document back into sections
  //   // In a real implementation, you'd need a more sophisticated parser
  //   // This is a simplified example:
  //   try {
  //     // Create a DOM parser
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(html, "text/html");

  //     // Find all headings
  //     const headings = Array.from(
  //       doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
  //     );

  //     // Extract sections based on headings
  //     let projectOverview = "";
  //     let scopeOfWork = [];
  //     let timeline = "";
  //     let pricing = "";

  //     // Look for each section
  //     headings.forEach((heading, index) => {
  //       const headingText = heading.textContent?.trim().toLowerCase() || "";

  //       // Skip if it's the main title
  //       if (headingText === "project estimate") return;

  //       // Determine which section this is
  //       if (
  //         headingText.includes("overview") ||
  //         headingText.includes("project overview")
  //       ) {
  //         // Extract content until the next heading
  //         let content = "";
  //         let nextElement = heading.nextElementSibling;

  //         while (nextElement && !nextElement.tagName.match(/^H[1-6]$/)) {
  //           content += nextElement.outerHTML;
  //           nextElement = nextElement.nextElementSibling;
  //         }

  //         projectOverview = content;
  //       } else if (
  //         headingText.includes("scope") ||
  //         headingText.includes("scope of work")
  //       ) {
  //         // Look for a list
  //         const listElement =
  //           heading.nextElementSibling?.tagName === "UL" ||
  //           heading.nextElementSibling?.tagName === "OL"
  //             ? heading.nextElementSibling
  //             : null;

  //         if (listElement) {
  //           // Extract list items
  //           const items = Array.from(listElement.querySelectorAll("li"));
  //           scopeOfWork = items.map((item) => item.innerHTML);
  //         } else {
  //           // Extract content until the next heading
  //           let content = "";
  //           let nextElement = heading.nextElementSibling;

  //           while (nextElement && !nextElement.tagName.match(/^H[1-6]$/)) {
  //             content += nextElement.outerHTML;
  //             nextElement = nextElement.nextElementSibling;
  //           }

  //           scopeOfWork = content;
  //         }
  //       } else if (headingText.includes("timeline")) {
  //         // Extract content until the next heading
  //         let content = "";
  //         let nextElement = heading.nextElementSibling;

  //         while (nextElement && !nextElement.tagName.match(/^H[1-6]$/)) {
  //           content += nextElement.outerHTML;
  //           nextElement = nextElement.nextElementSibling;
  //         }

  //         timeline = content;
  //       } else if (
  //         headingText.includes("pricing") ||
  //         headingText.includes("cost")
  //       ) {
  //         // Extract content until the next heading
  //         let content = "";
  //         let nextElement = heading.nextElementSibling;

  //         while (nextElement && !nextElement.tagName.match(/^H[1-6]$/)) {
  //           content += nextElement.outerHTML;
  //           nextElement = nextElement.nextElementSibling;
  //         }

  //         pricing = content;
  //       }
  //     });

  //     // Update the sections data
  //     // const updatedData = {
  //     //   ...descriptionData,
  //     //   projectOverview,
  //     //   scopeOfWork,
  //     //   timeline,
  //     //   pricing,
  //     // };

  //     // setDescriptionData(updatedData);
  //   } catch (error) {
  //     console.error("Error parsing document:", error);
  //     // Fallback - keep the current sections data
  //   }
  // };

  return (
    <>
      <PageHeader
        title="Estimate Preview"
        rightSection={
          <Group mb={15} className="no-print">
            {/* <Button
              leftSection={
                isEditing ? <SaveIcon size={16} /> : <EditIcon size={16} />
              }
              onClick={toggleEditing}
              color={isEditing ? "green" : "blue"}
            >
              {isEditing ? "Save Changes" : "Edit Estimate"}
            </Button> */}

            {/* {isEditing && (
              <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value)}
                className="flex-grow"
              >
                <Tabs.List>
                  <Tabs.Tab
                    value="sectionEditor"
                    onClick={switchToSectionEditor}
                    leftSection={<LayoutIcon size={16} />}
                  >
                    Section Editor
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="fullEditor"
                    onClick={switchToFullEditor}
                    leftSection={<CodeIcon size={16} />}
                  >
                    Full Editor
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
            )}

            {!isEditing && (
              <Button
                leftSection={<PrinterIcon size={16} />}
                onClick={handlePrint}
                color="teal"
              >
                Download PDF
              </Button>
            )} */}
          </Group>
        }
      />
      <PageMainWrapper w="full">
        <Stack gap={10}>
          {/* This is the main content area */}
          {activeTab === "preview" && (
            <div ref={componentRef} className="p-8 bg-white">
              {/* Company header/logo */}
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold">Project Estimate</h1>
                <p className="text-gray-600">
                  {getEstimateQuery?.data?.projectName}
                </p>
              </div>

              <EstimateDescription
                descriptionJson={aiContent}
                isEditing={false}
                isFullEditor={false}
                // onUpdate={handleUpdateDescription}
                lineItems={getEstimateQuery?.data?.lineItems}
              />

              {/* Company footer with signature area */}
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
            </div>
          )}

          {/* {activeTab === "sectionEditor" && (
            <div className="bg-white">
              <EstimateDescription
                // descriptionJson={descriptionData}
                isEditing={true}
                isFullEditor={false}
                onUpdate={handleUpdateDescription}
              />
            </div>
          )} */}

          {/* {activeTab === "fullEditor" && (
            <div className="bg-white">
              <FullDocumentEditor
                initialContent={
                  fullDocumentHtml || sectionsToFullDocument(descriptionData)
                }
                onSave={handleSaveFullDocument}
              />
            </div>
          )} */}
        </Stack>
      </PageMainWrapper>
    </>
  );
};

export default EstimatePreview;

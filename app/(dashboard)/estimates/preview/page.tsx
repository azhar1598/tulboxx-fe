"use client";
import React, { useState, useRef } from "react";
import { Button, Group, Stack, Textarea, Switch, Tabs } from "@mantine/core";
import { useReactToPrint } from "react-to-print";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import { newParse } from "@/lib/constants";
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

// Enhanced toolbar for the full text editor
const FullEditorToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border p-2 mb-2 flex gap-2 flex-wrap bg-gray-50 sticky top-0 z-10">
      <Group>
        <Button
          size="xs"
          variant={editor.isActive("bold") ? "filled" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          B
        </Button>
        <Button
          size="xs"
          variant={editor.isActive("italic") ? "filled" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          I
        </Button>
        <Button
          size="xs"
          variant={editor.isActive("underline") ? "filled" : "outline"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          U
        </Button>
      </Group>

      <div className="h-6 border-l mx-1"></div>

      <Group>
        <Button
          size="xs"
          variant={
            editor.isActive("heading", { level: 1 }) ? "filled" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          title="Heading 1"
        >
          H1
        </Button>
        <Button
          size="xs"
          variant={
            editor.isActive("heading", { level: 2 }) ? "filled" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          H2
        </Button>
        <Button
          size="xs"
          variant={
            editor.isActive("heading", { level: 3 }) ? "filled" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          H3
        </Button>
      </Group>

      <div className="h-6 border-l mx-1"></div>

      <Group>
        <Button
          size="xs"
          variant={
            editor.isActive({ textAlign: "left" }) ? "filled" : "outline"
          }
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
        >
          Left
        </Button>
        <Button
          size="xs"
          variant={
            editor.isActive({ textAlign: "center" }) ? "filled" : "outline"
          }
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
        >
          Center
        </Button>
        <Button
          size="xs"
          variant={
            editor.isActive({ textAlign: "right" }) ? "filled" : "outline"
          }
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
        >
          Right
        </Button>
      </Group>

      <div className="h-6 border-l mx-1"></div>

      <Group>
        <Button
          size="xs"
          variant={editor.isActive("bulletList") ? "filled" : "outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          • List
        </Button>
        <Button
          size="xs"
          variant={editor.isActive("orderedList") ? "filled" : "outline"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          1. List
        </Button>
      </Group>

      <div className="h-6 border-l mx-1"></div>

      <Group>
        <Button
          size="xs"
          variant=""
          onClick={() => {
            const url = window.prompt("URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          title="Insert Link"
        >
          Link
        </Button>
        <Button
          size="xs"
          variant=""
          onClick={() => {
            // Simple table insertion
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run();
          }}
          title="Insert Table"
        >
          Table
        </Button>
      </Group>
    </div>
  );
};

// Full featured document editor
const FullDocumentEditor = ({ initialContent, onSave }) => {
  const [currentContent, setCurrentContent] = useState(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      Placeholder.configure({
        placeholder: "Write your estimate here...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setCurrentContent(editor.getHTML());
    },
  });

  return (
    <div className="w-full border rounded">
      {editor && <FullEditorToolbar editor={editor} />}

      <EditorContent editor={editor} className="p-4 min-h-96 bg-white" />

      <div className="p-3 border-t flex justify-end bg-gray-50">
        <Button
          onClick={() => onSave(currentContent)}
          color="green"
          leftSection={<SaveIcon size={16} />}
        >
          Save Document
        </Button>
      </div>
    </div>
  );
};

// Original simple editor components
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border p-2 mb-2 flex gap-2 flex-wrap">
      <Button
        size="xs"
        variant={editor.isActive("bold") ? "filled" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        Bold
      </Button>
      <Button
        size="xs"
        variant={editor.isActive("italic") ? "filled" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        Italic
      </Button>
      <Button
        size="xs"
        variant={editor.isActive("bulletList") ? "filled" : "outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        Bullet List
      </Button>
      <Button
        size="xs"
        variant={editor.isActive("orderedList") ? "filled" : "outline"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        Ordered List
      </Button>
    </div>
  );
};

// Original TipTap editor component
const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-3 min-h-32" />
    </div>
  );
};

// Fallback to a simple text area if the component is rendered on the server
const SimpleEditor = ({ content, onChange }) => {
  return (
    <Textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      minRows={4}
      className="w-full"
    />
  );
};

// Dynamic import for the editor to avoid SSR issues
const Editor = ({ content, onChange }) => {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <SimpleEditor content={content} onChange={onChange} />;
  }

  return <RichTextEditor content={content} onChange={onChange} />;
};

// Helper to convert the document from sections to a full HTML document
const sectionsToFullDocument = (description) => {
  // Convert scope of work from array to HTML list if needed
  let scopeOfWorkHtml = "";
  if (Array.isArray(description.scopeOfWork)) {
    scopeOfWorkHtml = `<ul>${description.scopeOfWork
      .map((item) => `<li>${item}</li>`)
      .join("")}</ul>`;
  } else {
    scopeOfWorkHtml = description.scopeOfWork;
  }

  return `
    <h1>Project Estimate</h1>
    
    <h2>Project Overview</h2>
    ${description.projectOverview || "<p>No project overview provided.</p>"}
    
    <h2>Scope of Work</h2>
    ${scopeOfWorkHtml || "<p>No scope of work defined.</p>"}
    
    <h2>Timeline</h2>
    ${description.timeline || "<p>No timeline specified.</p>"}
    
    <h2>Pricing</h2>
    ${description.pricing || "<p>No pricing information available.</p>"}
    
    <h2>Terms and Conditions</h2>
    <p>We ensure that all aspects of the project will comply with relevant regulations and standards. 
    Should any unforeseen complications arise during the project, we will notify you immediately and discuss 
    any necessary adjustments. We value your trust and look forward to helping you enhance your home. 
    Please feel free to contact us with any questions or concerns you may have.</p>
  `;
};

// Display component for estimate sections
export const EstimateDescription = ({
  descriptionJson,
  isEditing,
  isFullEditor,
  onUpdate,
}) => {
  // If scopeOfWork is a string, split it into an array
  const processedDescription = {
    ...descriptionJson,
    scopeOfWork:
      typeof descriptionJson.scopeOfWork === "string"
        ? descriptionJson.scopeOfWork
            .split(/\\n|\\r|\n/)
            .filter((item) => item.trim())
            .map((item) => item.replace(/^- /, ""))
        : descriptionJson.scopeOfWork,
  };

  const [description, setDescription] =
    useState<GeneratedDescription>(processedDescription);

  // Handler for editing text fields
  const handleTextChange = (field, value) => {
    setDescription({
      ...description,
      [field]: value,
    });
    onUpdate({
      ...description,
      [field]: value,
    });
  };

  const handleScopeItemChange = (index, value) => {
    if (!Array.isArray(description.scopeOfWork)) return;

    const newScopeOfWork = [...description.scopeOfWork];
    newScopeOfWork[index] = value;
    setDescription({
      ...description,
      scopeOfWork: newScopeOfWork,
    });
    onUpdate({
      ...description,
      scopeOfWork: newScopeOfWork,
    });
  };

  const addScopeItem = () => {
    const newScopeOfWork = Array.isArray(description.scopeOfWork)
      ? [...description.scopeOfWork, "New task item"]
      : [description.scopeOfWork, "New task item"];

    setDescription({
      ...description,
      scopeOfWork: newScopeOfWork,
    });
    onUpdate({
      ...description,
      scopeOfWork: newScopeOfWork,
    });
  };

  const removeScopeItem = (index) => {
    if (
      Array.isArray(description.scopeOfWork) &&
      description.scopeOfWork.length > 1
    ) {
      const newScopeOfWork = [...description.scopeOfWork];
      newScopeOfWork.splice(index, 1);
      setDescription({
        ...description,
        scopeOfWork: newScopeOfWork,
      });
      onUpdate({
        ...description,
        scopeOfWork: newScopeOfWork,
      });
    }
  };

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
            <Editor
              content={description.projectOverview}
              onChange={(value) => handleTextChange("projectOverview", value)}
            />
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: description.projectOverview }}
          />
        )}
      </Stack>

      <Stack className="w-full">
        <h2 className="text-xl font-bold">Scope of Work</h2>
        {isEditing ? (
          <>
            <ul className="list-none pl-0">
              {Array.isArray(description.scopeOfWork) ? (
                description.scopeOfWork.map((item, index) => (
                  <li key={index} className="mb-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-grow">
                        <Editor
                          content={item}
                          onChange={(value) =>
                            handleScopeItemChange(index, value)
                          }
                        />
                      </div>
                      <Button
                        color="red"
                        variant=""
                        onClick={() => removeScopeItem(index)}
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
                  <Editor
                    content={description.scopeOfWork}
                    onChange={(value) => handleTextChange("scopeOfWork", value)}
                  />
                </div>
              )}
            </ul>
            {Array.isArray(description.scopeOfWork) && (
              <Button
                variant=""
                color="blue"
                onClick={addScopeItem}
                className="self-start mt-2"
                leftSection={<PlusCircle size={16} />}
              >
                Add Item
              </Button>
            )}
          </>
        ) : (
          <ul className="list-disc pl-6">
            {Array.isArray(description.scopeOfWork) ? (
              description.scopeOfWork.map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
              ))
            ) : typeof description.scopeOfWork === "string" ? (
              description.scopeOfWork
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
            <Editor
              content={description.timeline}
              onChange={(value) => handleTextChange("timeline", value)}
            />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: description.timeline }} />
        )}
      </Stack>

      <Stack className="w-full">
        <h2 className="text-xl font-bold">Pricing</h2>
        {isEditing ? (
          <div className="mb-4">
            <Editor
              content={description.pricing}
              onChange={(value) => handleTextChange("pricing", value)}
            />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: description.pricing }} />
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
            <tr className="text-center">
              <td colSpan={4} className="py-4 italic text-gray-500">
                {isEditing
                  ? "Line items can be added here"
                  : "No line items available"}
              </td>
            </tr>
          </tbody>
        </table>
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
  // Sample JSON data for testing
  const sampleJsonData = `json\n{\n  "projectOverview": "We are pleased to present this project estimate for the installation of a comprehensive drainage system at your residence, Mr. Mohammed. This system is specifically designed to address the current yard flooding issues, protecting your property from water damage and enhancing its overall usability and value.",\n  "scopeOfWork": "- Conduct a thorough site assessment to determine optimal drainage system placement and design.\\n- Excavate trenches and prepare the ground for drainage pipe installation.\\n- Install high-quality drainage pipes and gravel bedding to facilitate efficient water runoff.\\n- Connect the drainage system to a designated outflow point, ensuring proper water disposal.\\n- Backfill trenches and restore the landscape to its original condition, including reseeding or resodding as needed.\\n- Conduct a final inspection and testing to verify the system\'s functionality and effectiveness.",\n  "timeline": "The project is expected to take 3 weeks (approximately 16 days) for completion, contingent upon weather conditions and site accessibility.",\n  "pricing": "The total cost for the project is $2000. This pricing is all-inclusive and covers all labor, materials, equipment, and disposal fees associated with the drainage system installation. There are no hidden costs or additional charges beyond this quoted amount."\n}\n`;

  const [isEditing, setIsEditing] = useState(false);
  const [isFullEditor, setIsFullEditor] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [descriptionData, setDescriptionData] = useState(
    newParse(sampleJsonData) || {}
  );
  const [fullDocumentHtml, setFullDocumentHtml] = useState("");

  // Reference for the printable content
  const componentRef = useRef(null);

  // Print/PDF download handler
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Project_Estimate",
    pageStyle: `
      @page {
        size: auto;
        margin: 20mm;
      }
      @media print {
        .no-print {
          display: none;
        }
      }
    `,
  });

  // Update description data
  const handleUpdateDescription = (newData) => {
    setDescriptionData(newData);
  };

  // Toggle edit mode
  const toggleEditing = () => {
    if (isEditing) {
      // Exiting edit mode
      setIsEditing(false);
      setIsFullEditor(false);
      setActiveTab("preview");
    } else {
      // Entering edit mode - choose the last editing mode used
      setIsEditing(true);
      setActiveTab(isFullEditor ? "fullEditor" : "sectionEditor");
    }
  };

  // Toggle between full and sectional editing
  const switchToFullEditor = () => {
    if (!isFullEditor) {
      // Converting from sections to full document
      const fullDoc = sectionsToFullDocument(descriptionData);
      setFullDocumentHtml(fullDoc);
      setIsFullEditor(true);
      setActiveTab("fullEditor");
    }
  };

  const switchToSectionEditor = () => {
    setIsFullEditor(false);
    setActiveTab("sectionEditor");
  };

  // Save the full document and extract sections
  const handleSaveFullDocument = (html) => {
    setFullDocumentHtml(html);

    // This function would parse the full document back into sections
    // In a real implementation, you'd need a more sophisticated parser
    // This is a simplified example:
    try {
      // Create a DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Find all headings
      const headings = Array.from(
        doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
      );

      // Extract sections based on headings
      let projectOverview = "";
      let scopeOfWork = [];
      let timeline = "";
      let pricing = "";

      // Look for each section
      headings.forEach((heading, index) => {
        const headingText = heading.textContent?.trim().toLowerCase() || "";

        // Skip if it's the main title
        if (headingText === "project estimate") return;

        // Determine which section this is
        if (
          headingText.includes("overview") ||
          headingText.includes("project overview")
        ) {
          // Extract content until the next heading
          let content = "";
          let nextElement = heading.nextElementSibling;

          while (nextElement && !nextElement.tagName.match(/^H[1-6]$/)) {
            content += nextElement.outerHTML;
            nextElement = nextElement.nextElementSibling;
          }

          projectOverview = content;
        } else if (
          headingText.includes("scope") ||
          headingText.includes("scope of work")
        ) {
          // Look for a list
          const listElement =
            heading.nextElementSibling?.tagName === "UL" ||
            heading.nextElementSibling?.tagName === "OL"
              ? heading.nextElementSibling
              : null;

          if (listElement) {
            // Extract list items
            const items = Array.from(listElement.querySelectorAll("li"));
            scopeOfWork = items.map((item) => item.innerHTML);
          } else {
            // Extract content until the next heading
            let content = "";
            let nextElement = heading.nextElementSibling;

            while (nextElement && !nextElement.tagName.match(/^H[1-6]$/)) {
              content += nextElement.outerHTML;
              nextElement = nextElement.nextElementSibling;
            }

            scopeOfWork = content;
          }
        } else if (headingText.includes("timeline")) {
          // Extract content until the next heading
          let content = "";
          let nextElement = heading.nextElementSibling;

          while (nextElement && !nextElement.tagName.match(/^H[1-6]$/)) {
            content += nextElement.outerHTML;
            nextElement = nextElement.nextElementSibling;
          }

          timeline = content;
        } else if (
          headingText.includes("pricing") ||
          headingText.includes("cost")
        ) {
          // Extract content until the next heading
          let content = "";
          let nextElement = heading.nextElementSibling;

          while (nextElement && !nextElement.tagName.match(/^H[1-6]$/)) {
            content += nextElement.outerHTML;
            nextElement = nextElement.nextElementSibling;
          }

          pricing = content;
        }
      });

      // Update the sections data
      const updatedData = {
        ...descriptionData,
        projectOverview,
        scopeOfWork,
        timeline,
        pricing,
      };

      setDescriptionData(updatedData);
    } catch (error) {
      console.error("Error parsing document:", error);
      // Fallback - keep the current sections data
    }
  };

  return (
    <>
      <PageHeader
        title="Estimate Preview"
        rightSection={
          <Group position="right" mb={15} className="no-print">
            <Button
              leftSection={
                isEditing ? <SaveIcon size={16} /> : <EditIcon size={16} />
              }
              onClick={toggleEditing}
              color={isEditing ? "green" : "blue"}
            >
              {isEditing ? "Save Changes" : "Edit Estimate"}
            </Button>

            {isEditing && (
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
            )}
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
                <p className="text-gray-600">Your Company Name</p>
              </div>

              <EstimateDescription
                descriptionJson={descriptionData}
                isEditing={false}
                isFullEditor={false}
                onUpdate={handleUpdateDescription}
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

          {activeTab === "sectionEditor" && (
            <div className="bg-white">
              <EstimateDescription
                descriptionJson={descriptionData}
                isEditing={true}
                isFullEditor={false}
                onUpdate={handleUpdateDescription}
              />
            </div>
          )}

          {activeTab === "fullEditor" && (
            <div className="bg-white">
              <FullDocumentEditor
                initialContent={
                  fullDocumentHtml || sectionsToFullDocument(descriptionData)
                }
                onSave={handleSaveFullDocument}
              />
            </div>
          )}
        </Stack>
      </PageMainWrapper>
    </>
  );
};

export default EstimatePreview;

// import { Button, Group, Table, Textarea } from "@mantine/core";
// import Link from "@tiptap/extension-link";
// import Placeholder from "@tiptap/extension-placeholder";
// import TableCell from "@tiptap/extension-table-cell";
// import TableHeader from "@tiptap/extension-table-header";
// import TableRow from "@tiptap/extension-table-row";
// import TextAlign from "@tiptap/extension-text-align";
// import Underline from "@tiptap/extension-underline";
// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import { SaveIcon } from "lucide-react";
// import { useEffect, useState } from "react";

// // Enhanced toolbar for the full text editor
// const FullEditorToolbar = ({ editor }) => {
//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className="border p-2 mb-2 flex gap-2 flex-wrap bg-gray-50 sticky top-0 z-10">
//       <Group>
//         <Button
//           size="xs"
//           variant={editor.isActive("bold") ? "filled" : "outline"}
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           title="Bold"
//         >
//           B
//         </Button>
//         <Button
//           size="xs"
//           variant={editor.isActive("italic") ? "filled" : "outline"}
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           title="Italic"
//         >
//           I
//         </Button>
//         <Button
//           size="xs"
//           variant={editor.isActive("underline") ? "filled" : "outline"}
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           title="Underline"
//         >
//           U
//         </Button>
//       </Group>

//       <div className="h-6 border-l mx-1"></div>

//       <Group>
//         <Button
//           size="xs"
//           variant={
//             editor.isActive("heading", { level: 1 }) ? "filled" : "outline"
//           }
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 1 }).run()
//           }
//           title="Heading 1"
//         >
//           H1
//         </Button>
//         <Button
//           size="xs"
//           variant={
//             editor.isActive("heading", { level: 2 }) ? "filled" : "outline"
//           }
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 2 }).run()
//           }
//           title="Heading 2"
//         >
//           H2
//         </Button>
//         <Button
//           size="xs"
//           variant={
//             editor.isActive("heading", { level: 3 }) ? "filled" : "outline"
//           }
//           onClick={() =>
//             editor.chain().focus().toggleHeading({ level: 3 }).run()
//           }
//           title="Heading 3"
//         >
//           H3
//         </Button>
//       </Group>

//       <div className="h-6 border-l mx-1"></div>

//       <Group>
//         <Button
//           size="xs"
//           variant={
//             editor.isActive({ textAlign: "left" }) ? "filled" : "outline"
//           }
//           onClick={() => editor.chain().focus().setTextAlign("left").run()}
//           title="Align Left"
//         >
//           Left
//         </Button>
//         <Button
//           size="xs"
//           variant={
//             editor.isActive({ textAlign: "center" }) ? "filled" : "outline"
//           }
//           onClick={() => editor.chain().focus().setTextAlign("center").run()}
//           title="Align Center"
//         >
//           Center
//         </Button>
//         <Button
//           size="xs"
//           variant={
//             editor.isActive({ textAlign: "right" }) ? "filled" : "outline"
//           }
//           onClick={() => editor.chain().focus().setTextAlign("right").run()}
//           title="Align Right"
//         >
//           Right
//         </Button>
//       </Group>

//       <div className="h-6 border-l mx-1"></div>

//       <Group>
//         <Button
//           size="xs"
//           variant={editor.isActive("bulletList") ? "filled" : "outline"}
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           title="Bullet List"
//         >
//           • List
//         </Button>
//         <Button
//           size="xs"
//           variant={editor.isActive("orderedList") ? "filled" : "outline"}
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           title="Numbered List"
//         >
//           1. List
//         </Button>
//       </Group>

//       <div className="h-6 border-l mx-1"></div>

//       <Group>
//         <Button
//           size="xs"
//           variant=""
//           onClick={() => {
//             const url = window.prompt("URL");
//             if (url) {
//               editor.chain().focus().setLink({ href: url }).run();
//             }
//           }}
//           title="Insert Link"
//         >
//           Link
//         </Button>
//         <Button
//           size="xs"
//           variant=""
//           onClick={() => {
//             // Simple table insertion
//             editor
//               .chain()
//               .focus()
//               .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
//               .run();
//           }}
//           title="Insert Table"
//         >
//           Table
//         </Button>
//       </Group>
//     </div>
//   );
// };

// // Full featured document editor
// const FullDocumentEditor = ({ initialContent, onSave }) => {
//   const [currentContent, setCurrentContent] = useState(initialContent);

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Link.configure({
//         openOnClick: false,
//       }),
//       Image,
//       Table.configure({
//         resizable: true,
//       }),
//       TableRow,
//       TableHeader,
//       TableCell,
//       TextAlign.configure({
//         types: ["heading", "paragraph"],
//       }),
//       Underline,
//       // TextStyle,
//       Placeholder.configure({
//         placeholder: "Write your estimate here...",
//       }),
//     ],
//     content: initialContent,
//     onUpdate: ({ editor }) => {
//       setCurrentContent(editor.getHTML());
//     },
//   });

//   return (
//     <div className="w-full border rounded">
//       {editor && <FullEditorToolbar editor={editor} />}

//       <EditorContent editor={editor} className="p-4 min-h-96 bg-white" />

//       <div className="p-3 border-t flex justify-end bg-gray-50">
//         <Button
//           onClick={() => onSave(currentContent)}
//           color="green"
//           leftSection={<SaveIcon size={16} />}
//         >
//           Save Document
//         </Button>
//       </div>
//     </div>
//   );
// };

// // Original simple editor components
// const MenuBar = ({ editor }) => {
//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className="border p-2 mb-2 flex gap-2 flex-wrap">
//       <Button
//         size="xs"
//         variant={editor.isActive("bold") ? "filled" : "outline"}
//         onClick={() => editor.chain().focus().toggleBold().run()}
//       >
//         Bold
//       </Button>
//       <Button
//         size="xs"
//         variant={editor.isActive("italic") ? "filled" : "outline"}
//         onClick={() => editor.chain().focus().toggleItalic().run()}
//       >
//         Italic
//       </Button>
//       <Button
//         size="xs"
//         variant={editor.isActive("bulletList") ? "filled" : "outline"}
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//       >
//         Bullet List
//       </Button>
//       <Button
//         size="xs"
//         variant={editor.isActive("orderedList") ? "filled" : "outline"}
//         onClick={() => editor.chain().focus().toggleOrderedList().run()}
//       >
//         Ordered List
//       </Button>
//     </div>
//   );
// };

// // Original TipTap editor component
// const RichTextEditor = ({ content, onChange }) => {
//   const editor = useEditor({
//     extensions: [StarterKit, Link],
//     content,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//   });

//   return (
//     <div className="border rounded">
//       <MenuBar editor={editor} />
//       <EditorContent editor={editor} className="p-3 min-h-32" />
//     </div>
//   );
// };

// // Fallback to a simple text area if the component is rendered on the server
// const SimpleEditor = ({ content, onChange }) => {
//   return (
//     <Textarea
//       value={content}
//       onChange={(e) => onChange(e.target.value)}
//       minRows={4}
//       className="w-full"
//     />
//   );
// };

// // Dynamic import for the editor to avoid SSR issues
// const Editor = ({ content, onChange }) => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return <SimpleEditor content={content} onChange={onChange} />;
//   }

//   return <RichTextEditor content={content} onChange={onChange} />;
// };

// // Helper to convert the document from sections to a full HTML document
// const sectionsToFullDocument = (description) => {
//   // Convert scope of work from array to HTML list if needed
//   let scopeOfWorkHtml = "";
//   if (Array.isArray(description.scopeOfWork)) {
//     scopeOfWorkHtml = `<ul>${description.scopeOfWork
//       .map((item) => `<li>${item}</li>`)
//       .join("")}</ul>`;
//   } else {
//     scopeOfWorkHtml = description.scopeOfWork;
//   }

//   return `
//       <h1>Project Estimate</h1>

//       <h2>Project Overview</h2>
//       ${description.projectOverview || "<p>No project overview provided.</p>"}

//       <h2>Scope of Work</h2>
//       ${scopeOfWorkHtml || "<p>No scope of work defined.</p>"}

//       <h2>Timeline</h2>
//       ${description.timeline || "<p>No timeline specified.</p>"}

//       <h2>Pricing</h2>
//       ${description.pricing || "<p>No pricing information available.</p>"}

//       <h2>Terms and Conditions</h2>
//       <p>We ensure that all aspects of the project will comply with relevant regulations and standards.
//       Should any unforeseen complications arise during the project, we will notify you immediately and discuss
//       any necessary adjustments. We value your trust and look forward to helping you enhance your home.
//       Please feel free to contact us with any questions or concerns you may have.</p>
//     `;
// };

import React from "react";

function index() {
  return <div></div>;
}

export default index;

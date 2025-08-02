import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Group,
  Stack,
  Textarea,
  TextInput,
  FileInput,
} from "@mantine/core";
import {
  PlusCircle,
  Trash2,
  Save,
  DollarSign,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { createClient } from "@/utils/supabase/client";

interface GeneratedDescription {
  projectOverview: string;
  scopeOfWork: string[] | string;
  timeline: string;
  pricing: string;
}

export const EstimateContent = ({
  descriptionJson,
  isEditing,
  isFullEditor,
  lineItems,
  getEstimateQuery,
  setIsEditing,
}) => {
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
  const [editableDescription, setEditableDescription] =
    useState<GeneratedDescription>();
  const [lineItemsState, setLineItemsState] = useState(lineItems || []);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notification = usePageNotifications();

  const supabase = createClient();

  useEffect(() => {
    setDescription(processedDescription);
    setEditableDescription(processedDescription);
  }, [descriptionJson]);

  useEffect(() => {
    setLineItemsState(lineItems || []);
  }, [lineItems]);

  // Load existing logo if available
  useEffect(() => {
    if (getEstimateQuery?.data?.companyLogo) {
      setCompanyLogo(getEstimateQuery.data.companyLogo);
    }
  }, [getEstimateQuery?.data]);

  // Handle logo upload - Modified to use Supabase storage
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      notification.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notification.error("Image size should be less than 5MB");
      return;
    }

    try {
      // Sanitize filename
      const sanitizedFileName = file.name
        .replace(/\s+/g, "_") // replace spaces with underscores
        .replace(/[^a-zA-Z0-9._-]/g, ""); // remove special chars except . _ -

      // Create unique file path
      const filePath = `user-logo/${Date.now()}_${sanitizedFileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("user-logo") // You can change this bucket name as needed
        .upload(filePath, file);

      if (error) {
        notification.error("Image upload failed: " + error.message);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("user-logo")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // Set the public URL as the logo
      setCompanyLogo(imageUrl);
      notification.success("Logo uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      notification.error("Failed to upload logo. Please try again.");
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setCompanyLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle input changes
  const handleTextChange = (field, value) => {
    setEditableDescription((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle scope of work item change
  const handleScopeItemChange = (index, value) => {
    if (!Array.isArray(editableDescription?.scopeOfWork)) return;

    const newScopeOfWork = [...editableDescription.scopeOfWork];
    newScopeOfWork[index] = value;

    setEditableDescription((prev) => ({
      ...prev,
      scopeOfWork: newScopeOfWork,
    }));
  };

  // Add new scope item
  const addScopeItem = () => {
    if (!Array.isArray(editableDescription?.scopeOfWork)) return;

    setEditableDescription((prev) => ({
      ...prev,
      scopeOfWork: [...prev.scopeOfWork, "New scope item"],
    }));
  };

  // Remove scope item
  const removeScopeItem = (index) => {
    if (!Array.isArray(editableDescription?.scopeOfWork)) return;

    const newScopeOfWork = [...editableDescription.scopeOfWork];
    newScopeOfWork.splice(index, 1);

    setEditableDescription((prev) => ({
      ...prev,
      scopeOfWork: newScopeOfWork,
    }));
  };

  // Handle line item changes
  const handleLineItemChange = (id, field, value) => {
    const newLineItems = lineItemsState.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate total price if quantity or unit price changes
        if (field === "quantity" || field === "unitPrice") {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }

        return updatedItem;
      }
      return item;
    });

    setLineItemsState(newLineItems);
  };

  // Add new line item
  const addLineItem = () => {
    const newId =
      lineItemsState.length > 0
        ? Math.max(...lineItemsState.map((item) => item.id)) + 1
        : 1;

    setLineItemsState([
      ...lineItemsState,
      {
        id: newId,
        description: "New item",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  // Remove line item
  const removeLineItem = (id) => {
    setLineItemsState(lineItemsState.filter((item) => item.id !== id));
  };

  const updateEstimate = useMutation({
    mutationFn: ({ data, lineItems, logo }: any) => {
      const newData = {
        ...getEstimateQuery?.data,
        clientId: getEstimateQuery?.data.client_id,
        ai_generated_estimate: JSON.stringify(data),
        lineItems: lineItems,
        companyLogo: logo,
        projectEstimate: Number(getEstimateQuery?.data.projectEstimate),
      };
      return callApi.patch(`/estimates/${getEstimateQuery?.data.id}`, newData);
    },
    onSuccess: async (res) => {
      setIsEditing(false);
      notification.success(`Estimate updated successfully`);
      getEstimateQuery.refetch();
    },
    onError: (err: any) => {
      notification.error(`${err?.data?.message}`);
      console.log("err", err);
    },
  });

  const totalAmount =
    lineItemsState?.reduce((acc, item) => acc + item.totalPrice, 0) || 0;

  if (isFullEditor) {
    return null;
  }

  return (
    <div
      className="w-full bg-white"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        {/* Logo Section */}
        <div className="w-64 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-50 relative overflow-hidden">
          {companyLogo ? (
            <div className="relative w-full h-full">
              <img
                src={companyLogo}
                alt="Company Logo"
                className="w-full h-full object-contain"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <Button
                      size="xs"
                      variant="white"
                      onClick={triggerFileInput}
                    >
                      <Upload size={12} />
                    </Button>
                    <Button
                      size="xs"
                      variant="white"
                      color="red"
                      onClick={handleRemoveLogo}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              {isEditing ? (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon size={24} className="text-gray-400" />
                  <Button
                    size="sm"
                    // variant="outline"
                    onClick={triggerFileInput}
                    leftSection={<Upload size={14} />}
                  >
                    Upload Logo
                  </Button>
                  <span className="text-gray-400 text-xs">
                    Max 5MB, JPG/PNG
                  </span>
                </div>
              ) : (
                <span className="text-gray-500 text-sm font-medium">
                  PLACEHOLDER FOR
                  <br />
                  COMPANY LOGO
                </span>
              )}
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        {/* Prepared For Section */}
        <div className="text-right">
          <div className="bg-gray-800 text-white px-4 py-2 text-sm font-bold mb-2">
            PREPARED FOR:
          </div>
          <div className="text-sm leading-relaxed">
            <div className="font-semibold">
              {getEstimateQuery?.data?.clients?.name || "Client Name"}
            </div>
            <div>
              {getEstimateQuery?.data?.clients?.email || "client@email.com"}
            </div>
            <div>
              {getEstimateQuery?.data?.clients?.address || "Client Address"}
            </div>
            <div>
              {getEstimateQuery?.data?.clients?.phone || "Client Phone"}
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview Section */}
      <div className="mb-8">
        <div className="bg-gray-800 text-white px-4 py-2 text-sm font-bold mb-4">
          PROJECT OVERVIEW:
        </div>
        {isEditing ? (
          <Textarea
            value={editableDescription?.projectOverview || ""}
            onChange={(e) =>
              handleTextChange("projectOverview", e.target.value)
            }
            minRows={3}
            className="w-full text-sm"
            placeholder="Project overview description..."
          />
        ) : (
          <div className="text-sm leading-relaxed text-justify">
            {description?.projectOverview || "No project overview available"}
          </div>
        )}
      </div>

      {/* Scope of Work Section */}
      <div className="mb-8">
        <div className="bg-gray-800 text-white px-4 py-2 text-sm font-bold mb-4">
          SCOPE OF WORK:
        </div>
        {isEditing ? (
          <div>
            {Array.isArray(editableDescription?.scopeOfWork) ? (
              <div>
                {editableDescription.scopeOfWork.map((item, index) => (
                  <div key={index} className="mb-3 flex items-start gap-2">
                    <span className="text-sm font-bold mt-1">•</span>
                    <div className="flex-grow">
                      <Textarea
                        value={item}
                        onChange={(e) =>
                          handleScopeItemChange(index, e.target.value)
                        }
                        className="w-full text-sm"
                        autosize
                        minRows={1}
                      />
                    </div>
                    <Button
                      size="xs"
                      color="red"
                      // // variant="outline"
                      disabled={editableDescription.scopeOfWork.length <= 1}
                      onClick={() => removeScopeItem(index)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  // // variant="outline"
                  leftSection={<PlusCircle size={14} />}
                  onClick={addScopeItem}
                  className="mt-2"
                >
                  Add Item
                </Button>
              </div>
            ) : (
              <Textarea
                value={editableDescription?.scopeOfWork || ""}
                onChange={(e) =>
                  handleTextChange("scopeOfWork", e.target.value)
                }
                minRows={4}
                className="w-full text-sm"
                placeholder="Scope of work description..."
              />
            )}
          </div>
        ) : (
          <div className="text-sm leading-relaxed">
            {Array.isArray(description?.scopeOfWork) ? (
              description.scopeOfWork.map((item, index) => (
                <div key={index} className="mb-2 flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="font-bold">{item.split(":")[0]}:</span>
                  <span>{item.split(":").slice(1).join(":").trim()}</span>
                </div>
              ))
            ) : typeof description?.scopeOfWork === "string" ? (
              description.scopeOfWork
                .split(/\\n|\\r|\n/)
                .filter((item) => item.trim())
                .map((item, index) => (
                  <div key={index} className="mb-2 flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{item.replace(/^- /, "")}</span>
                  </div>
                ))
            ) : (
              <div>No scope items available</div>
            )}
          </div>
        )}
      </div>

      {/* Cost Breakdown Section */}
      <div className="mb-8">
        <div className="bg-gray-800 text-white px-4 py-2 text-sm font-bold mb-4">
          COST BREAKDOWN:
        </div>

        {isEditing ? (
          <div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 p-2 text-left font-bold">
                    DESCRIPTION
                  </th>
                  <th className="border border-gray-400 p-2 text-center font-bold">
                    QUANTITY/UNIT
                  </th>
                  <th className="border border-gray-400 p-2 text-center font-bold">
                    UNIT PRICE
                  </th>
                  <th className="border border-gray-400 p-2 text-center font-bold">
                    LINE TOTAL
                  </th>
                  <th className="border border-gray-400 p-2 text-center font-bold">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItemsState.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-400 p-2">
                      <TextInput
                        value={item.description}
                        onChange={(e) =>
                          handleLineItemChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        size="sm"
                      />
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      <TextInput
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleLineItemChange(
                            item.id,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        size="sm"
                      />
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      <TextInput
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleLineItemChange(
                            item.id,
                            "unitPrice",
                            Number(e.target.value)
                          )
                        }
                        leftSection={<DollarSign size={14} />}
                        size="sm"
                      />
                    </td>
                    <td className="border border-gray-400 p-2 text-center font-medium">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      <Button
                        size="xs"
                        color="red"
                        onClick={() => removeLineItem(item.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <Button
                leftSection={<PlusCircle size={14} />}
                onClick={addLineItem}
                size="sm"
                // // variant="outline"
              >
                Add Line Item
              </Button>

              <div className="bg-gray-800 text-white px-6 py-3 font-bold text-lg">
                TOTAL: ${totalAmount.toFixed(2)}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                color="green"
                onClick={() =>
                  updateEstimate.mutate({
                    data: editableDescription,
                    lineItems: lineItemsState,
                    logo: companyLogo,
                  })
                }
                loading={updateEstimate.isPending}
                leftSection={<Save size={16} />}
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 p-3 text-left font-bold">
                    DESCRIPTION
                  </th>
                  <th className="border border-gray-400 p-3 text-center font-bold">
                    QUANTITY/UNIT
                  </th>
                  <th className="border border-gray-400 p-3 text-center font-bold">
                    UNIT PRICE
                  </th>
                  <th className="border border-gray-400 p-3 text-center font-bold">
                    LINE TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItems?.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-400 p-3">
                      {item.description}
                    </td>
                    <td className="border border-gray-400 p-3 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-400 p-3 text-center">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="border border-gray-400 p-3 text-center">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <div className="bg-gray-800 text-white px-6 py-3 font-bold text-lg">
                TOTAL: ${totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Section */}
      <div className="mb-8">
        <div className="bg-gray-800 text-white px-4 py-2 text-sm font-bold mb-4">
          TIMELINE:
        </div>
        {isEditing ? (
          <Textarea
            value={editableDescription?.timeline || ""}
            onChange={(e) => handleTextChange("timeline", e.target.value)}
            minRows={3}
            className="w-full text-sm"
            placeholder="Timeline information..."
          />
        ) : (
          <div className="text-sm leading-relaxed">
            <div className="mb-2">
              <span className="font-bold">• Estimated Project Duration:</span>{" "}
              {description?.timeline || "1 Full work day"}
            </div>
            <div className="mb-2">
              <span className="font-bold">• Start Availability:</span> Can begin
              within 5 business days of approval
            </div>
            <div className="mb-2">
              <span className="font-bold">• Optional:</span> Add weather buffer
            </div>
          </div>
        )}
      </div>

      {/* Additional Notes Section */}
      <div className="mb-8">
        <div className="bg-gray-800 text-white px-4 py-2 text-sm font-bold mb-4">
          ADDITIONAL NOTES:
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-b border-gray-400 h-6"></div>
          ))}
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-12">
        <div className="bg-gray-800 text-white px-4 py-2 text-sm font-bold mb-6">
          SIGNATURE:
        </div>
        <div className="flex justify-between">
          <div className="w-64">
            <div className="text-sm font-bold mb-2">Approval of Estimate</div>
            <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
            <div className="text-sm">
              <div className="mb-1">Signature: _________________________</div>
              <div className="mb-1">Printed Name: _____________________</div>
              <div>Date: ____________________________</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Button, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { PlusCircle, Trash2, Save, DollarSign } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";

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
  const notification = usePageNotifications();

  useEffect(() => {
    setDescription(processedDescription);
    setEditableDescription(processedDescription);
  }, [descriptionJson]);

  useEffect(() => {
    setLineItemsState(lineItems || []);
  }, [lineItems]);

  // Handle input changes
  const handleTextChange = (field, value) => {
    setEditableDescription((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log("getEstimateQuery", getEstimateQuery?.data);

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
    mutationFn: ({ data, lineItems }: any) => {
      console.log("data", data, lineItems);
      const newData = {
        ...getEstimateQuery?.data,
        clientId: getEstimateQuery?.data.client_id,
        ai_generated_estimate: JSON.stringify(data),
        lineItems: lineItems,
        projectEstimate: Number(getEstimateQuery?.data.projectEstimate),
      };
      console.log("newData", newData);
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

  if (isFullEditor) {
    return null;
  }

  return (
    <Group gap={20} className="md:w-full">
      <Stack className="w-full">
        <h2 className="text-xl font-bold">Project Overview</h2>
        {isEditing ? (
          <div className="mb-4">
            <Textarea
              value={editableDescription?.projectOverview || ""}
              onChange={(e) =>
                handleTextChange("projectOverview", e.target.value)
              }
              minRows={4}
              className="w-full"
            />
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
              {Array.isArray(editableDescription?.scopeOfWork) ? (
                editableDescription.scopeOfWork.map((item, index) => (
                  <li key={index} className="mb-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-grow">
                        <Textarea
                          value={item}
                          onChange={(e) =>
                            handleScopeItemChange(index, e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                      <Button
                        disabled={editableDescription.scopeOfWork.length <= 1}
                        className="mt-2"
                        onClick={() => removeScopeItem(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </li>
                ))
              ) : (
                <div className="mb-4">
                  <Textarea
                    value={editableDescription?.scopeOfWork || ""}
                    onChange={(e) =>
                      handleTextChange("scopeOfWork", e.target.value)
                    }
                    minRows={4}
                    className="w-full"
                  />
                </div>
              )}
            </ul>
            {Array.isArray(editableDescription?.scopeOfWork) && (
              <Button
                className="self-start mt-2"
                leftSection={<PlusCircle size={16} />}
                onClick={addScopeItem}
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
            <Textarea
              value={editableDescription?.timeline || ""}
              onChange={(e) => handleTextChange("timeline", e.target.value)}
              minRows={4}
              className="w-full"
            />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: description?.timeline }} />
        )}
      </Stack>

      <Stack className="w-full">
        <h2 className="text-xl font-bold">Pricing</h2>
        {isEditing ? (
          <div className="mb-4">
            <Textarea
              value={editableDescription?.pricing || ""}
              onChange={(e) => handleTextChange("pricing", e.target.value)}
              minRows={4}
              className="w-full"
            />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: description?.pricing }} />
        )}
      </Stack>

      <div className="line-items mt-8 w-full">
        <h2 className="text-xl font-semibold mb-2">Line Items</h2>
        {isEditing ? (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-right">Unit Price</th>
                  <th className="border p-2 text-right">Quantity</th>
                  <th className="border p-2 text-right">Total</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lineItemsState.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2 text-left">
                      <TextInput
                        value={item.description}
                        onChange={(e) =>
                          handleLineItemChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="border p-2 text-right">
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
                        leftSection={<DollarSign size={16} />}
                      />
                    </td>
                    <td className="border p-2 text-right">
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
                      />
                    </td>
                    <td className="border p-2 text-right">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                    <td className="border p-2 text-center">
                      <Button size="sm" onClick={() => removeLineItem(item.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                color="blue"
                onClick={addLineItem}
                leftSection={<PlusCircle size={16} />}
              >
                Add Line Item
              </Button>
              <p className="text-right">
                <span className="font-bold">Grand Total: </span>
                <span className="font-bold">
                  $
                  {lineItemsState
                    .reduce((acc, item) => acc + item.totalPrice, 0)
                    .toFixed(2)}
                </span>
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                color="green"
                onClick={() =>
                  updateEstimate.mutate({
                    data: editableDescription,
                    lineItems: lineItemsState,
                  })
                }
                loading={updateEstimate.isPending}
                leftSection={<Save size={16} />}
              >
                Save Changes
              </Button>
            </div>
          </>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-right">Unit Price</th>
                  <th className="border p-2 text-right">Quantity</th>
                  <th className="border p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {lineItems?.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2 text-left">{item.description}</td>
                    <td className="border p-2 text-right">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">x{item.quantity}</td>
                    <td className="border p-2 text-right">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <p className="text-right">
                <span className="font-bold">Grand Total: </span>
                <span className="font-bold">
                  $
                  {lineItems
                    ?.reduce((acc, item) => acc + item.totalPrice, 0)
                    .toFixed(2)}
                </span>
              </p>
            </div>
          </>
        )}
      </div>

      <Stack className="w-full">
        <h2 className="text-xl font-bold">Additional Notes</h2>
        {isEditing ? (
          <div className="mb-4">
            <Textarea
              defaultValue="We ensure that all aspects of the project will comply with relevant regulations and standards. Should any unforeseen complications arise during the project, we will notify you immediately and discuss any necessary adjustments. We value your trust and look forward to helping you enhance your home. Please feel free to contact us with any questions or concerns you may have."
              minRows={4}
              className="w-full"
            />
          </div>
        ) : (
          <p>
            We ensure that all aspects of the project will comply with relevant
            regulations and standards. Should any unforeseen complications arise
            during the project, we will notify you immediately and discuss any
            necessary adjustments. We value your trust and look forward to
            helping you enhance your home. Please feel free to contact us with
            any questions or concerns you may have.
          </p>
        )}
      </Stack>
    </Group>
  );
};

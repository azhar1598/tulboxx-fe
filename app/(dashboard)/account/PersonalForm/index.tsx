import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Text,
  TextInput,
  Textarea,
  Button,
  Divider,
  Select,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import callApi from "@/services/apiService";
import { usePageNotifications } from "@/lib/hooks/useNotifications";
import { createClient } from "@/utils/supabase/client";
import { Image as ImageIcon, Trash2, Upload } from "lucide-react";

const accountSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  logo: z.string().optional(),
});

function PersonalForm({ getUserProfile }: { getUserProfile: any }) {
  const notifications: any = usePageNotifications();
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const form = useForm({
    validate: zodResolver(accountSchema),
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      companyName: "",
      jobTitle: "",
      industry: "",
      companySize: "",
      logo: "",
    },
    validateInputOnChange: true,
  });
  useEffect(() => {
    if (getUserProfile?.data) {
      form.setValues({
        fullName: getUserProfile?.data?.userMetadata?.full_name,
        email: getUserProfile?.data?.email,
        phone: getUserProfile?.data?.phone || "",
        address: getUserProfile?.data?.address,
        companyName: getUserProfile?.data?.companyName,
        jobTitle: getUserProfile?.data?.jobTitle,
        industry: getUserProfile?.data?.industry,
        companySize: getUserProfile?.data?.companySize,
      });
      if (getUserProfile?.data?.logo) {
        setCompanyLogo(getUserProfile.data.logo);
      }
      form.resetDirty();
    }
  }, [getUserProfile?.data]);
  console.log(getUserProfile?.data, "getUserProfile");

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notifications.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notifications.error("Image size should be less than 5MB");
      return;
    }
    setSelectedLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreviewUrl(previewUrl);
    notifications.success(
      "Logo selected! Click 'Save Account Details' to upload."
    );
  };
  const handleRemoveLogo = () => {
    setCompanyLogo(null);
    setSelectedLogoFile(null);
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl); // Clean up preview URL
      setLogoPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    form.setFieldValue("logo", ""); // Also update form state
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const uploadLogoToSupabase = async (
    file: File
  ): Promise<{ key: string; id: string }> => {
    try {
      const sanitizedFileName = file.name
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "");
      const filePath = `user-logo/${Date.now()}_${sanitizedFileName}`;
      const { data, error } = await supabase.storage
        .from("user-logo")
        .upload(filePath, file);

      if (error) {
        throw new Error(error.message);
      }
      return {
        key: filePath,
        id: crypto.randomUUID(),
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const updateUserProfile = useMutation({
    mutationFn: async (values: any) => {
      let logoUrl = companyLogo;

      if (selectedLogoFile) {
        try {
          const uploadResult = await uploadLogoToSupabase(selectedLogoFile);
          const logoKey = uploadResult.key;

          const { data: publicUrlData } = supabase.storage
            .from("user-logo")
            .getPublicUrl(logoKey);

          logoUrl = publicUrlData.publicUrl;
        } catch (error) {
          notifications.error("Logo upload failed.");
          console.error(error);
          throw error;
        }
      }

      const formattedData = {
        companyName: values.companyName,
        companySize: values.companySize,
        address: values.address,
        industry: values.industry,
        jobTitle: values.jobTitle,
        logo: logoUrl,
      };
      const response = await callApi.patch("/user-profile", formattedData);
      return response.data;
    },
    onSuccess: () => {
      notifications.success("User profile updated successfully");
      getUserProfile.refetch();
      setSelectedLogoFile(null);
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
        setLogoPreviewUrl(null);
      }
    },
    onError: () => {
      notifications.error("User profile update failed");
      console.log("error");
    },
  });

  const isButtonEnabled =
    form.isValid() && (form.isDirty() || selectedLogoFile);
  return (
    <form
      onSubmit={form.onSubmit((values) => updateUserProfile.mutate(values))}
    >
      <Grid mt="xl">
        <Grid.Col span={12}>
          <Text fw={600}>Personal Details</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Full Name"
            placeholder="Your name"
            {...form.getInputProps("fullName")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Email Address"
            placeholder="your.email@example.com"
            {...form.getInputProps("email")}
            disabled
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Phone Number"
            placeholder="+1 (555) 555-5555"
            {...form.getInputProps("phone")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Textarea
            label="Address"
            placeholder="Your address"
            {...form.getInputProps("address")}
          />
        </Grid.Col>

        <Grid.Col span={12} mt="md">
          <Divider mb="md" />
          <Text fw={600}>Company Details</Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Company Name"
            placeholder="Your company name"
            {...form.getInputProps("companyName")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Job Title"
            placeholder="Your job title"
            {...form.getInputProps("jobTitle")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Industry"
            placeholder="Your industry"
            {...form.getInputProps("industry")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Company Size"
            data={["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]}
            placeholder="Select company size"
            {...form.getInputProps("companySize")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text size="sm" fw={500} mb={4}>
            Company Logo
          </Text>
          <div
            className={`w-64 h-32 flex items-center justify-center relative overflow-hidden rounded-md ${
              companyLogo || logoPreviewUrl
                ? "bg-white"
                : "border-2 border-dashed border-gray-300 bg-gray-50"
            }`}
          >
            {companyLogo || logoPreviewUrl ? (
              <div className="relative w-full h-full group">
                <img
                  src={logoPreviewUrl || companyLogo}
                  alt="Company Logo"
                  className="w-full h-full object-contain"
                />
                {logoPreviewUrl && (
                  <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Unsaved
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <Button size="xs" onClick={triggerFileInput}>
                      <Upload size={12} />
                    </Button>
                    <Button size="xs" color="red" onClick={handleRemoveLogo}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon size={24} className="text-gray-400" />
                  <Button
                    size="sm"
                    onClick={triggerFileInput}
                    leftSection={<Upload size={14} />}
                  >
                    Upload Logo
                  </Button>
                  <span className="text-gray-500 text-xs mt-1">
                    Max 2MB, JPG/PNG
                  </span>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </Grid.Col>
      </Grid>

      <Button
        type="submit"
        disabled={!isButtonEnabled}
        mt={20}
        loading={updateUserProfile.isPending}
      >
        Save Account Details
      </Button>
    </form>
  );
}

export default PersonalForm;

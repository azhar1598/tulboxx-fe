"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React from "react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import {
  Box,
  Text,
  Title,
  Card,
  Loader,
  Center,
  LoadingOverlay,
  Button,
  Group,
  Modal,
  Stack,
} from "@mantine/core";
import { useParams } from "next/navigation";
import callApi from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";
import { extractAndParseJson } from "@/lib/constants";
import { useClipboard } from "@mantine/hooks";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconCopy,
  IconCheck,
  IconShare,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

function page() {
  const { contentid } = useParams();
  const clipboard = useClipboard({ timeout: 2000 });
  const [shareModalOpened, { open: openShareModal, close: closeShareModal }] =
    useDisclosure(false);

  const getContentQuery: any = useQuery({
    queryKey: ["get-content"],
    queryFn: () => {
      const response = callApi.get(`/content/${contentid}`);
      return response;
    },
  });

  const contentData = extractAndParseJson(getContentQuery?.data?.data?.content);

  // Function to handle Facebook sharing
  const handleFacebookShare = async () => {
    try {
      const pageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID; // You'll need to add this
      const response = await fetch(
        `https://graph.facebook.com/v22.0/${pageId}/feed`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: contentData?.content,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("Facebook API Error:", data);
        throw new Error(
          `Failed to share to Facebook: ${
            data.error?.message || "Unknown error"
          }`
        );
      }
      closeShareModal();
      // Handle success
    } catch (error) {
      console.error("Error sharing to Facebook:", error);
      // Handle error
    }
  };
  // Function to handle Instagram sharing
  const handleInstagramShare = async () => {
    try {
      // You'll need to implement Instagram Graph API auth
      // This is a simplified example
      const response = await fetch(
        "https://graph.facebook.com/v18.0/YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID/media",
        {
          method: "POST",
          body: JSON.stringify({
            caption: contentData?.content,
            // You'll need image_url for Instagram posts
          }),
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      closeShareModal();
      // Handle success
    } catch (error) {
      console.error("Error sharing to Instagram:", error);
      // Handle error
    }
  };

  return (
    <>
      <PageHeader
        title={`View Content: ${getContentQuery?.data?.data?.estimates?.projectName}`}
        rightSection={
          <Group justify="space-between" align="center" gap="xs">
            <Button
              size="sm"
              leftSection={
                clipboard.copied ? (
                  <IconCheck size={16} />
                ) : (
                  <IconCopy size={16} />
                )
              }
              onClick={() => clipboard.copy(contentData?.content)}
            >
              {clipboard.copied ? "Copied!" : "Copy Content"}
            </Button>
            <Button
              size="sm"
              variant="filled"
              color="blue"
              onClick={openShareModal}
              leftSection={<IconShare size={16} />}
            >
              Share
            </Button>
          </Group>
        }
      />

      {/* Share Modal */}
      <Modal
        opened={shareModalOpened}
        onClose={closeShareModal}
        title="Share Content"
        size="sm"
      >
        <Stack>
          <Button
            fullWidth
            leftSection={<IconBrandFacebook size={20} />}
            onClick={handleFacebookShare}
            color="blue"
          >
            Share to Facebook
          </Button>
          <Button
            fullWidth
            leftSection={<IconBrandInstagram size={20} />}
            onClick={handleInstagramShare}
            variant="gradient"
            gradient={{ from: "#833AB4", to: "#E1306C", deg: 45 }}
          >
            Share to Instagram
          </Button>
        </Stack>
      </Modal>

      <PageMainWrapper w="full">
        {getContentQuery?.isLoading && (
          <Center h={"100vh"}>
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
              loaderProps={{ type: "bars" }}
            />
          </Center>
        )}
        <Title order={2} mb="sm">
          {contentData?.title}
        </Title>

        <Text size="md" color="gray.7" style={{ whiteSpace: "pre-line" }}>
          {contentData?.content}
        </Text>

        {contentData?.visual_content_idea && (
          <Box
            mt="md"
            p="md"
            style={{
              backgroundColor: "#f1f3f5",
              borderLeft: "4px solid #228be6",
              borderRadius: "5px",
            }}
          >
            <Text fw={500}>Visual Idea:</Text>
            <Text size="sm">{contentData?.visual_content_idea}</Text>
          </Box>
        )}
      </PageMainWrapper>
    </>
  );
}

export default page;

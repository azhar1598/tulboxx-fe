"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React from "react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import { Box, Text, Title, Card } from "@mantine/core";
import { useParams } from "next/navigation";
import callApi from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";
import { extractAndParseJson } from "@/lib/constants";

function page() {
  const { contentid } = useParams();

  const getContentQuery: any = useQuery({
    queryKey: ["get-content"],
    queryFn: () => {
      const response = callApi.get(`/content/${contentid}`);
      return response;
    },
  });

  console.log(
    "getContentQuery",
    getContentQuery?.data?.data?.estimates?.projectName
  );

  const contentData = extractAndParseJson(getContentQuery?.data?.data?.content);
  return (
    <>
      <PageHeader
        title={`View Content: ${getContentQuery?.data?.data?.estimates?.projectName}`}
      />
      <PageMainWrapper w="full">
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

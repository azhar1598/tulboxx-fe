"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React, { Suspense } from "react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import JobForm from "./JobForm";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";

function JobAddContent() {
  const searchParams = useSearchParams();
  const estimateId = searchParams.get("estimateId");

  const { data: estimateData } = useQuery({
    queryKey: ["get-estimate-title", estimateId],
    queryFn: () => callApi.get(`/estimates/${estimateId}`),
    enabled: !!estimateId,
  });

  const title = estimateData?.data?.projectName
    ? `Create Job: ${estimateData.data.projectName}`
    : "Create Job";

  return (
    <>
      <PageHeader title={title} />
      <PageMainWrapper w="full">
        <JobForm />
      </PageMainWrapper>
    </>
  );
}

function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobAddContent />
    </Suspense>
  );
}

export default Page;

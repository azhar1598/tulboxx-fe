"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React from "react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import MainLayout from "@/components/common/MainLayout";
import JobForm from "./JobForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import callApi from "@/services/apiService";

function Page() {
  const { id } = useParams();

  const { data: jobData } = useQuery({
    queryKey: ["get-job-title", id],
    queryFn: () => callApi.get(`/jobs/${id}`),
    enabled: !!id,
  });

  const title = jobData?.data?.name
    ? `Edit Job: ${jobData.data.name}`
    : "Edit Job";

  return (
    <>
      <PageHeader title={title} />
      <PageMainWrapper w="full">
        <JobForm />
      </PageMainWrapper>
    </>
  );
}

export default Page;

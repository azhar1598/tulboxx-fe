"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React from "react";
import PageMainWrapper from "@/components/common/PageMainWrapper";
import MainLayout from "@/components/common/MainLayout";
import ContentForm from "./ContentForm";

function page() {
  return (
    <>
      <PageHeader title={"Create Content"} />
      <PageMainWrapper w="full">
        <ContentForm />
      </PageMainWrapper>
    </>
  );
}

export default page;

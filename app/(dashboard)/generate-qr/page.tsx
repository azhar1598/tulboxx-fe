"use client";
import { PageHeader } from "@/components/common/PageHeader";
import React from "react";

import PageMainWrapper from "@/components/common/PageMainWrapper";
import MainLayout from "@/components/common/MainLayout";
import QrReviewForm from "./QrReviewForm";

function page() {
  return (
    <>
      <PageHeader title={"Review QR"} />
      <PageMainWrapper>
        <QrReviewForm />
      </PageMainWrapper>
    </>
  );
}

export default page;

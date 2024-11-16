import ProductsListing from "@/app/(dashboard)/products/ProductsListing";
import React, { Suspense } from "react";
import EditCategoryForm from "./EditCategoryForm";

function CategoryEditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCategoryForm />
    </Suspense>
  );
}

export default CategoryEditPage;

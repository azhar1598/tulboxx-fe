import React, { Suspense } from "react";
import CategoryListing from "./CategoryListing";

function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryListing />
    </Suspense>
  );
}

export default CategoriesPage;

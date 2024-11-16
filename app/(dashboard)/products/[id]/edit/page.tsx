"use client";
import React, { Suspense } from "react";
import EditProductPage from "./EditProduct";

function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProductPage />
    </Suspense>
  );
}

export default ProductsPage;

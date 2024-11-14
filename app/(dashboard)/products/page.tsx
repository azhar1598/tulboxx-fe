import React, { Suspense } from "react";
import ProductsListing from "./ProductsListing";

function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsListing />
    </Suspense>
  );
}

export default ProductsPage;

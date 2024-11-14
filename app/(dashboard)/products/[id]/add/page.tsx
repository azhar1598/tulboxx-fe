import React, { Suspense } from "react";
import AddProductForm from "./AddProduct";

function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProductForm />
    </Suspense>
  );
}

export default ProductsPage;

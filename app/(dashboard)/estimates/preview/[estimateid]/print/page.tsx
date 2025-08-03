"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PrintTemplate } from "../PrintTemplate";

const PrintPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from URL params or localStorage
    const estimateData = searchParams.get('estimateData');
    const aiContent = searchParams.get('aiContent');
    const userProfile = searchParams.get('userProfile');

    if (estimateData && aiContent && userProfile) {
      setData({
        estimateData: JSON.parse(decodeURIComponent(estimateData)),
        aiContent: JSON.parse(decodeURIComponent(aiContent)),
        userProfile: JSON.parse(decodeURIComponent(userProfile))
      });
    } else {
      // Fallback to localStorage
      const storedData = localStorage.getItem('printData');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    }
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    // Auto-focus print dialog after page loads
    if (!loading && data) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available for printing</div>;
  }

  return (
    <PrintTemplate 
      estimateData={data.estimateData}
      aiContent={data.aiContent}
      userProfile={data.userProfile}
    />
  );
};

export default PrintPage; 
import callApi from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";

interface PropTypes {
  url: string;
  key: string;
  page: number;
  pageSize: number;
}

export const useLeadsQuery = () => {
  const getLeadsQuery = useQuery({
    queryKey: ["get-leads"],
    queryFn: async () => {
      const response = await callApi.get(`/pipeline/leads`, {
        params: {
          limit: -1,
        },
      });

      return response.data;
    },
    select(data) {
      return data;
    },
  });

  return {
    ...getLeadsQuery.data,
    isLoading: getLeadsQuery.isLoading,
    isError: getLeadsQuery.isError,
    error: getLeadsQuery.error,
    refetch: getLeadsQuery.refetch(),
  };
};

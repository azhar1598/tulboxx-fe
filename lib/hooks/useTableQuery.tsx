import callApi from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";

interface PropTypes {
  url: string;
  key: string;
  page: number;
  pageSize: number;
}

export const useTableQuery = ({ url, key, page, pageSize }: PropTypes) => {
  const getTableData = useQuery({
    queryKey: [key, page],
    queryFn: async () => {
      const response = await callApi.get(`${url}`, {
        params: {
          page: page,
          pageSize: pageSize,
        },
      });

      return response.data;
    },
    select: (data) => {
      return {
        tableData: data?.data?.result,
        totalResults: data?.data?.totalResults,
        currentPage: data?.data?.currentPage,
        pageSize: data?.data?.pageSize,
        loading: false,
      };
    },
  });

  return {
    ...getTableData.data,
    isLoading: getTableData.isLoading,
    isError: getTableData.isError,
    error: getTableData.error,
    refetch: getTableData.refetch(),
  };
};

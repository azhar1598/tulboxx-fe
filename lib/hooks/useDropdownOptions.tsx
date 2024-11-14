import callApi from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";

interface PropTypes {
  url: string;
  key: string;
  page: number;
  pageSize: number;
}

export const useDropdownOptions = ({ url, key, page, pageSize }: PropTypes) => {
  const getDropdownOptions = useQuery({
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
    select(data) {
      const options = data.data?.result.map((option) => ({
        label: option.name,
        value: option.id.toString(),
      }));
      return options;
    },
  });
  return getDropdownOptions?.data;
};

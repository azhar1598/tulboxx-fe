import callApi from "@/services/apiService";
import { useQuery } from "@tanstack/react-query";

interface PropTypes {
  url: string;
  key: string;
  page: number;
  pageSize: number;
  label: string;
  value: string;
}

const getPropertyValue = (obj: any, key: string) => {
  // First try direct access
  if (obj[key] !== undefined) {
    return obj[key];
  }

  // If direct access fails, try nested access
  const parts = key.split(".");
  let value = obj;
  for (const part of parts) {
    if (value && typeof value === "object") {
      value = value[part];
    } else {
      return undefined;
    }
  }
  return value;
};

export const useDropdownOptions = ({
  url,
  key,
  page,
  pageSize,
  label,
  value,
}: PropTypes) => {
  const getDropdownOptions = useQuery({
    queryKey: [key, page],
    queryFn: async () => {
      const response = await callApi.get(`${url}`);
      return response.data;
    },
    select(data) {
      console.log("Raw data:", data.data); // For debugging
      const options = data.data?.map((option) => {
        const labelValue = getPropertyValue(option, label);
        const valueField = getPropertyValue(option, value);

        return {
          label: labelValue ?? "N/A",
          value: valueField?.toString() ?? "",
        };
      });

      return options;
    },
  });
  return getDropdownOptions?.data;
};

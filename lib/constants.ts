export const indianStates = [
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
  {
    value: "Andaman and Nicobar Islands",
    label: "Andaman and Nicobar Islands",
  },
  { value: "Chandigarh", label: "Chandigarh" },
  {
    value: "Dadra and Nagar Haveli and Daman and Diu",
    label: "Dadra and Nagar Haveli and Daman and Diu",
  },
  { value: "Lakshadweep", label: "Lakshadweep" },
  { value: "Delhi", label: "Delhi" },
  { value: "Puducherry", label: "Puducherry" },
  { value: "Ladakh", label: "Ladakh" },
  { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
];

export const swatches = [
  "#25262b",
  "#868e96",
  "#fa5252",
  "#e64980",
  "#be4bdb",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
];

export enum STORE_STATUS {
  INITIATED = "INITIATED",
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const checkStatus = (status) => {
  return STORE_STATUS.INITIATED === status
    ? "blue"
    : STORE_STATUS.PENDING === status
    ? "yellow"
    : STORE_STATUS.ACTIVE === status
    ? "green"
    : STORE_STATUS.INACTIVE === status
    ? "red"
    : "";
};

export enum PAYMENT_STATUS {
  INITIAL = "INITIAL",
  PENDING = "PENDING",
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
  CANCELLED = "CANCELLED",
}

export const checkPaymentStatusBadge = (status) => {
  return PAYMENT_STATUS.INITIAL === status
    ? "blue"
    : PAYMENT_STATUS.PENDING === status
    ? "orange"
    : PAYMENT_STATUS.SUCCESS === status
    ? "green"
    : PAYMENT_STATUS.FAILED === status
    ? "red"
    : PAYMENT_STATUS.CANCELLED === status
    ? "yellow"
    : "";
};

export const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

interface ProjectEstimate {
  client: string;
  objective: string;
  problemStatement: string;
  scope: string[];
  timeline: {
    duration: string;
    contingencies: string;
  };
  pricing: {
    total: number;
    currency: string;
    inclusions: string[];
    guarantee: string;
  };
}

export function parseEstimate(data: any): ProjectEstimate {
  // Extract client name from project overview
  const clientMatch = data.projectOverview?.match(/,\s+([A-Za-z ]+)\./);

  // Extract core problem statement
  const problemMatch = data.projectOverview?.match(/issue of (.*?) by/);

  // Process scope of work
  const scope = data?.scopeOfWork
    ?.split("\n")
    .map((line: string) => line.replace(/^- /, "").trim())
    .filter((line: string) => line);

  // Parse timeline details
  const timelineMatch = data.timeline?.match(
    /(\d+ weeks.*?) for completion, (.*?)\./
  );

  // Extract pricing details
  const priceMatch = data.pricing?.match(/\$(\d+)/);
  const inclusionsMatch = data.pricing?.match(/covers (.*?)\./);

  return {
    client: clientMatch ? clientMatch[1] : "Unknown Client",
    objective: "Prevent yard flooding and protect property foundation",
    problemStatement: problemMatch ? problemMatch[1] : "yard flooding",
    scope: scope,
    timeline: {
      duration: timelineMatch ? timelineMatch[1] : "N/A",
      contingencies: timelineMatch ? timelineMatch[2] : "None specified",
    },
    pricing: {
      total: priceMatch ? parseInt(priceMatch[1]) : 0,
      currency: "USD",
      inclusions: inclusionsMatch
        ? inclusionsMatch[1]
            .split(", ")
            .map((item) => item.replace(/ etc\.?/, ""))
        : [],
      guarantee: "No hidden fees",
    },
  };
}
export function extractEstimateJson(rawText: string) {
  try {
    // Remove "json" prefix and trim whitespace
    // const jsonMatch: any = rawText.match(/^json\s*(\{.*\})/s);
    const jsonMatch: any = rawText.match(/^json\s*({[\s\S]*})/);

    if (!jsonMatch) {
      throw new Error("Invalid format - missing JSON data");
    }

    // Parse the actual JSON part
    const jsonData = JSON.parse(jsonMatch[1]);

    return {
      projectOverview: jsonData.projectOverview || "",
      scopeOfWork: (jsonData.scopeOfWork || "")
        .split("\n")
        .map((item: string) => item.replace(/^- /, "").trim()),
      timeline: jsonData.timeline || "",
      pricing: jsonData.pricing || "",
    };
  } catch (error) {
    console.error("Parsing failed:", error);
    return {
      projectOverview: "",
      scopeOfWork: [],
      timeline: "",
      pricing: "",
    };
  }
}

export function extractEstimateJson1(rawText: string) {
  try {
    // Extract the first JSON-like object
    const jsonString = rawText
      .substring(rawText.indexOf("{"), rawText.lastIndexOf("}") + 1)
      .trim();

    const jsonData = JSON.parse(jsonString);

    // Normalize scopeOfWork
    const scopeRaw = jsonData.scopeOfWork;

    const scopeOfWork = Array.isArray(scopeRaw)
      ? scopeRaw
      : typeof scopeRaw === "string"
      ? scopeRaw
          .split("\n")
          .map((item: string) => item.replace(/^- /, "").trim())
          .filter(Boolean)
      : [];

    return {
      projectOverview: jsonData.projectOverview || "",
      scopeOfWork,
      timeline: jsonData.timeline || "",
      pricing: jsonData.pricing || "",
    };
  } catch (error) {
    console.error("Parsing failed:", error);
    return {
      projectOverview: "",
      scopeOfWork: [],
      timeline: "",
      pricing: "",
    };
  }
}

export function extractAndParseJson(text: string): any {
  const jsonMatch = text?.match(/\{[\s\S]*\}/); // Extract the JSON part

  // if (!jsonMatch) {
  //   throw new Error("No valid JSON found in the input.");
  // }

  try {
    let parsedJson = JSON.parse(jsonMatch[0]);

    return {
      title: parsedJson.title,
      content: parsedJson.content,
      visual_content_idea: parsedJson.visual_content_idea,
    };
  } catch (error) {
    // throw new Error("Invalid JSON format.");
  }
}

export const sampleJsonData = `json\n{\n  "projectOverview": "We are pleased to present this project estimate for the installation of a comprehensive drainage system at your residence, Mr. Mohammed. This system is specifically designed to address the current yard flooding issues, protecting your property from water damage and enhancing its overall usability and value.",\n  "scopeOfWork": "- Conduct a thorough site assessment to determine optimal drainage system placement and design.\\n- Excavate trenches and prepare the ground for drainage pipe installation.\\n- Install high-quality drainage pipes and gravel bedding to facilitate efficient water runoff.\\n- Connect the drainage system to a designated outflow point, ensuring proper water disposal.\\n- Backfill trenches and restore the landscape to its original condition, including reseeding or resodding as needed.\\n- Conduct a final inspection and testing to verify the system\'s functionality and effectiveness.",\n  "timeline": "The project is expected to take 3 weeks (approximately 16 days) for completion, contingent upon weather conditions and site accessibility.",\n  "pricing": "The total cost for the project is $2000. This pricing is all-inclusive and covers all labor, materials, equipment, and disposal fees associated with the drainage system installation. There are no hidden costs or additional charges beyond this quoted amount."\n}\n`;

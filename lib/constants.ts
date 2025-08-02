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
  "#182a4d",
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

export const USStates = [
  {
    value: "Alabama",
    label: "Alabama",
    cities: [
      { value: "Birmingham", label: "Birmingham" },
      { value: "Montgomery", label: "Montgomery" },
      { value: "Mobile", label: "Mobile" },
      { value: "Huntsville", label: "Huntsville" },
      { value: "Tuscaloosa", label: "Tuscaloosa" },
      { value: "Decatur", label: "Decatur" },
      { value: "Dothan", label: "Dothan" },
      { value: "Enterprise", label: "Enterprise" },
      { value: "Fayetteville", label: "Fayetteville" },
      { value: "Florence", label: "Florence" },
      { value: "Gadsden", label: "Gadsden" },

      { value: "Jacksonville", label: "Jacksonville" },
      { value: "Muscle Shoals", label: "Muscle Shoals" },

      { value: "Tuskegee", label: "Tuskegee" },
      { value: "Vestavia Hills", label: "Vestavia Hills" },
      { value: "Wetumpka", label: "Wetumpka" },
    ],
  },
  {
    value: "Alaska",
    label: "Alaska",
    cities: [
      { value: "Anchorage", label: "Anchorage" },
      { value: "Fairbanks", label: "Fairbanks" },
      { value: "Juneau", label: "Juneau" },
      { value: "Ketchikan", label: "Ketchikan" },
      { value: "Juneau", label: "Juneau" },
      { value: "Ketchikan", label: "Ketchikan" },
      { value: "Juneau", label: "Juneau" },
      { value: "Ketchikan", label: "Ketchikan" },
      { value: "Juneau", label: "Juneau" },
    ],
  },
  {
    value: "Arizona",
    label: "Arizona",
    cities: [
      { value: "Phoenix", label: "Phoenix" },
      { value: "Tucson", label: "Tucson" },
      { value: "Mesa", label: "Mesa" },
      { value: "Glendale", label: "Glendale" },
      { value: "Scottsdale", label: "Scottsdale" },
      { value: "Chandler", label: "Chandler" },
      { value: "Gilbert", label: "Gilbert" },
      { value: "Tempe", label: "Tempe" },
      { value: "Peoria", label: "Peoria" },
      { value: "Surprise", label: "Surprise" },
    ],
  },
  {
    value: "Arkansas",
    label: "Arkansas",
    cities: [
      { value: "Little Rock", label: "Little Rock" },
      { value: "Fort Smith", label: "Fort Smith" },
      { value: "Fayetteville", label: "Fayetteville" },
      { value: "Springdale", label: "Springdale" },
      { value: "Rogers", label: "Rogers" },
      { value: "Bentonville", label: "Bentonville" },
      { value: "Jonesboro", label: "Jonesboro" },
      { value: "Pine Bluff", label: "Pine Bluff" },
      { value: "Hot Springs", label: "Hot Springs" },
      { value: "Little Rock", label: "Little Rock" },
      { value: "Fort Smith", label: "Fort Smith" },
      { value: "Fayetteville", label: "Fayetteville" },
      { value: "Springdale", label: "Springdale" },
      { value: "Rogers", label: "Rogers" },
      { value: "Bentonville", label: "Bentonville" },
      { value: "Jonesboro", label: "Jonesboro" },
      { value: "Pine Bluff", label: "Pine Bluff" },
      { value: "Hot Springs", label: "Hot Springs" },
    ],
  },
  {
    value: "California",
    label: "California",
    cities: [
      { value: "Los Angeles", label: "Los Angeles" },
      { value: "San Diego", label: "San Diego" },
      { value: "San Jose", label: "San Jose" },
      { value: "San Francisco", label: "San Francisco" },
      { value: "Sacramento", label: "Sacramento" },
      { value: "Long Beach", label: "Long Beach" },
      { value: "Oakland", label: "Oakland" },
      { value: "Santa Ana", label: "Santa Ana" },
      { value: "Anaheim", label: "Anaheim" },
      { value: "Riverside", label: "Riverside" },
      { value: "Stockton", label: "Stockton" },
      { value: "Irvine", label: "Irvine" },
      { value: "Fresno", label: "Fresno" },
      { value: "Bakersfield", label: "Bakersfield" },
      { value: "Modesto", label: "Modesto" },
      { value: "Sacramento", label: "Sacramento" },
      { value: "San Bernardino", label: "San Bernardino" },
      { value: "San Mateo", label: "San Mateo" },
      { value: "Santa Clarita", label: "Santa Clarita" },
      { value: "Santa Rosa", label: "Santa Rosa" },
      { value: "Simi Valley", label: "Simi Valley" },
      { value: "Sunnyvale", label: "Sunnyvale" },
      { value: "Torrance", label: "Torrance" },
      { value: "Visalia", label: "Visalia" },
      { value: "West Covina", label: "West Covina" },
      { value: "Whittier", label: "Whittier" },
      { value: "Woodland", label: "Woodland" },
      { value: "Yuba City", label: "Yuba City" },
      { value: "Yorba Linda", label: "Yorba Linda" },
    ],
  },
  {
    value: "Colorado",
    label: "Colorado",
    cities: [
      { value: "Denver", label: "Denver" },
      { value: "Colorado Springs", label: "Colorado Springs" },
      { value: "Fort Collins", label: "Fort Collins" },
      { value: "Lakewood", label: "Lakewood" },
      { value: "Thornton", label: "Thornton" },
      { value: "Westminster", label: "Westminster" },
      { value: "Boulder", label: "Boulder" },
      { value: "Longmont", label: "Longmont" },
      { value: "Loveland", label: "Loveland" },
      { value: "Greeley", label: "Greeley" },
      { value: "Castle Rock", label: "Castle Rock" },
      { value: "Arvada", label: "Arvada" },
      { value: "Westminster", label: "Westminster" },
      { value: "Boulder", label: "Boulder" },
    ],
  },
  { value: "Connecticut", label: "Connecticut", cities: [] },
  { value: "Delaware", label: "Delaware", cities: [] },
  { value: "Florida", label: "Florida", cities: [] },
  {
    value: "Georgia",
    label: "Georgia",
    cities: [
      { value: "Atlanta", label: "Atlanta" },
      { value: "Augusta", label: "Augusta" },
      { value: "Columbus", label: "Columbus" },
      { value: "Savannah", label: "Savannah" },
      { value: "Athens", label: "Athens" },
    ],
  },
  { value: "Hawaii", label: "Hawaii", cities: [] },
  { value: "Idaho", label: "Idaho", cities: [] },
  {
    value: "Illinois",
    label: "Illinois",
    cities: [
      { value: "Chicago", label: "Chicago" },
      { value: "Aurora", label: "Aurora" },
      { value: "Rockford", label: "Rockford" },
      { value: "Springfield", label: "Springfield" },
      { value: "Naperville", label: "Naperville" },
      { value: "Elgin", label: "Elgin" },
      { value: "Waukegan", label: "Waukegan" },
      { value: "Joliet", label: "Joliet" },
      { value: "Peoria", label: "Peoria" },
    ],
  },
  { value: "Indiana", label: "Indiana", cities: [] },
  { value: "Iowa", label: "Iowa", cities: [] },
  { value: "Kansas", label: "Kansas", cities: [] },
  { value: "Kentucky", label: "Kentucky", cities: [] },
  { value: "Louisiana", label: "Louisiana", cities: [] },
  { value: "Maine", label: "Maine", cities: [] },
  { value: "Maryland", label: "Maryland", cities: [] },
  { value: "Massachusetts", label: "Massachusetts", cities: [] },
  { value: "Michigan", label: "Michigan", cities: [] },
  { value: "Minnesota", label: "Minnesota", cities: [] },
  { value: "Mississippi", label: "Mississippi", cities: [] },
  { value: "Missouri", label: "Missouri", cities: [] },
  { value: "Montana", label: "Montana", cities: [] },
  { value: "Nebraska", label: "Nebraska", cities: [] },
  { value: "Nevada", label: "Nevada", cities: [] },
  { value: "New Hampshire", label: "New Hampshire", cities: [] },
  { value: "New Jersey", label: "New Jersey", cities: [] },
  { value: "New Mexico", label: "New Mexico", cities: [] },
  { value: "New York", label: "New York", cities: [] },
  { value: "North Carolina", label: "North Carolina", cities: [] },
  { value: "North Dakota", label: "North Dakota", cities: [] },
  { value: "Ohio", label: "Ohio", cities: [] },
  { value: "Oklahoma", label: "Oklahoma", cities: [] },
  { value: "Oregon", label: "Oregon", cities: [] },
  { value: "Pennsylvania", label: "Pennsylvania", cities: [] },
  { value: "Rhode Island", label: "Rhode Island", cities: [] },
  { value: "South Carolina", label: "South Carolina", cities: [] },
  { value: "South Dakota", label: "South Dakota", cities: [] },
  { value: "Tennessee", label: "Tennessee", cities: [] },
  {
    value: "Texas",
    label: "Texas",
    cities: [
      { value: "Austin", label: "Austin" },
      { value: "Houston", label: "Houston" },
      { value: "San Antonio", label: "San Antonio" },
      { value: "Dallas", label: "Dallas" },
      { value: "El Paso", label: "El Paso" },
      { value: "Fort Worth", label: "Fort Worth" },
      { value: "Arlington", label: "Arlington" },
    ],
  },
  {
    value: "Utah",
    label: "Utah",
    cities: [
      { value: "Salt Lake City", label: "Salt Lake City" },
      { value: "West Valley City", label: "West Valley City" },
      { value: "Provo", label: "Provo" },
      { value: "Orem", label: "Orem" },
      { value: "Sandy", label: "Sandy" },
      { value: "Ogden", label: "Ogden" },
      { value: "Layton", label: "Layton" },
      { value: "Lehi", label: "Lehi" },
    ],
  },
  {
    value: "Vermont",
    label: "Vermont",
    cities: [
      { value: "Burlington", label: "Burlington" },
      { value: "South Burlington", label: "South Burlington" },
      { value: "Essex Junction", label: "Essex Junction" },
      { value: "Rutland", label: "Rutland" },
      { value: "Bennington", label: "Bennington" },
      { value: "Brattleboro", label: "Brattleboro" },
      { value: "St. Johnsbury", label: "St. Johnsbury" },
    ],
  },
  {
    value: "Virginia",
    label: "Virginia",
    cities: [
      { value: "Richmond", label: "Richmond" },
      { value: "Norfolk", label: "Norfolk" },
      { value: "Virginia Beach", label: "Virginia Beach" },
      { value: "Chesapeake", label: "Chesapeake" },
    ],
  },
  {
    value: "Washington",
    label: "Washington",
    cities: [
      { value: "Seattle", label: "Seattle" },
      { value: "Spokane", label: "Spokane" },
      { value: "Tacoma", label: "Tacoma" },
      { value: "Vancouver", label: "Vancouver" },
      { value: "Bellevue", label: "Bellevue" },
      { value: "Kent", label: "Kent" },
      { value: "Renton", label: "Renton" },
      { value: "Everett", label: "Everett" },
      { value: "Olympia", label: "Olympia" },
      { value: "Bellingham", label: "Bellingham" },
      { value: "Marysville", label: "Marysville" },
      { value: "Lynnwood", label: "Lynnwood" },
      { value: "Kirkland", label: "Kirkland" },
      { value: "Redmond", label: "Redmond" },
    ],
  },
  {
    value: "West Virginia",
    label: "West Virginia",
    cities: [
      { value: "Charleston", label: "Charleston" },
      { value: "Huntington", label: "Huntington" },
      { value: "Morgantown", label: "Morgantown" },
      { value: "Wheeling", label: "Wheeling" },
      { value: "Parkersburg", label: "Parkersburg" },
    ],
  },
  {
    value: "Wisconsin",
    label: "Wisconsin",
    cities: [
      { value: "Madison", label: "Madison" },
      { value: "Milwaukee", label: "Milwaukee" },
      { value: "Green Bay", label: "Green Bay" },
      { value: "Racine", label: "Racine" },
      { value: "Waukesha", label: "Waukesha" },
      { value: "Eau Claire", label: "Eau Claire" },
      { value: "La Crosse", label: "La Crosse" },
    ],
  },
  {
    value: "Wyoming",
    label: "Wyoming",
    cities: [
      { value: "Cheyenne", label: "Cheyenne" },
      { value: "Casper", label: "Casper" },
      { value: "Gillette", label: "Gillette" },
      { value: "Laramie", label: "Laramie" },
      { value: "Rock Springs", label: "Rock Springs" },
      { value: "Sheridan", label: "Sheridan" },
      { value: "Torrington", label: "Torrington" },
      { value: "Cheyenne", label: "Cheyenne" },
    ],
  },
  {
    value: "District of Columbia",
    label: "District of Columbia",
    cities: [
      { value: "Washington", label: "Washington" },
      { value: "Alexandria", label: "Alexandria" },
      { value: "Arlington", label: "Arlington" },
      { value: "Bethesda", label: "Bethesda" },
      { value: "Bowie", label: "Bowie" },
      { value: "Clinton", label: "Clinton" },
      { value: "College Park", label: "College Park" },
      { value: "Cumberland", label: "Cumberland" },
      { value: "Fairfax", label: "Fairfax" },
      { value: "Falls Church", label: "Falls Church" },
      { value: "Fort Washington", label: "Fort Washington" },
      { value: "Frederick", label: "Frederick" },
      { value: "Gaithersburg", label: "Gaithersburg" },
      { value: "Germantown", label: "Germantown" },
      { value: "Greenbelt", label: "Greenbelt" },
      { value: "Hagerstown", label: "Hagerstown" },
      { value: "Hyattsville", label: "Hyattsville" },
      { value: "Laurel", label: "Laurel" },
      { value: "Largo", label: "Largo" },
      { value: "Laurel", label: "Laurel" },
      { value: "Largo", label: "Largo" },
      { value: "Laurel", label: "Laurel" },
      { value: "Largo", label: "Largo" },
    ],
  },
  {
    value: "American Samoa",
    label: "American Samoa",
    cities: [
      { value: "Pago Pago", label: "Pago Pago" },
      { value: "Tafuna", label: "Tafuna" },
      { value: "Fagatogo", label: "Fagatogo" },
      { value: "Pago Pago", label: "Pago Pago" },
      { value: "Tafuna", label: "Tafuna" },
      { value: "Fagatogo", label: "Fagatogo" },
      { value: "Pago Pago", label: "Pago Pago" },
      { value: "Tafuna", label: "Tafuna" },
      { value: "Fagatogo", label: "Fagatogo" },
      { value: "Pago Pago", label: "Pago Pago" },
      { value: "Tafuna", label: "Tafuna" },
      { value: "Fagatogo", label: "Fagatogo" },
      { value: "Pago Pago", label: "Pago Pago" },
      { value: "Tafuna", label: "Tafuna" },
    ],
  },
  { value: "Guam", label: "Guam", cities: [] },
  {
    value: "Northern Mariana Islands",
    label: "Northern Mariana Islands",
    cities: [
      { value: "Saipan", label: "Saipan" },
      { value: "Tinian", label: "Tinian" },
      { value: "Rota", label: "Rota" },
      { value: "Saipan", label: "Saipan" },
      { value: "Tinian", label: "Tinian" },
      { value: "Rota", label: "Rota" },
      { value: "Saipan", label: "Saipan" },
      { value: "Tinian", label: "Tinian" },
      { value: "Rota", label: "Rota" },
      { value: "Saipan", label: "Saipan" },
      { value: "Tinian", label: "Tinian" },
      { value: "Rota", label: "Rota" },
      { value: "Saipan", label: "Saipan" },
      { value: "Tinian", label: "Tinian" },
    ],
  },
  {
    value: "Puerto Rico",
    label: "Puerto Rico",
    cities: [
      { value: "San Juan", label: "San Juan" },
      { value: "Bayamón", label: "Bayamón" },
      { value: "Caguas", label: "Caguas" },
      { value: "Carolina", label: "Carolina" },
      { value: "Guaynabo", label: "Guaynabo" },
      { value: "Ponce", label: "Ponce" },
      { value: "Cidra", label: "Cidra" },
      { value: "Fajardo", label: "Fajardo" },
      { value: "Humacao", label: "Humacao" },
      { value: "Mayagüez", label: "Mayagüez" },
      { value: "San Juan", label: "San Juan" },
      { value: "Bayamón", label: "Bayamón" },
      { value: "Caguas", label: "Caguas" },
      { value: "Carolina", label: "Carolina" },
      { value: "Guaynabo", label: "Guaynabo" },
      { value: "Ponce", label: "Ponce" },
      { value: "Cidra", label: "Cidra" },
      { value: "Fajardo", label: "Fajardo" },
      { value: "Humacao", label: "Humacao" },
      { value: "Mayagüez", label: "Mayagüez" },
      { value: "San Juan", label: "San Juan" },
    ],
  },
  {
    value: "U.S. Virgin Islands",
    label: "U.S. Virgin Islands",
    cities: [
      { value: "Charlotte Amalie", label: "Charlotte Amalie" },
      { value: "Christiansted", label: "Christiansted" },
      { value: "Cruz Bay", label: "Cruz Bay" },
      { value: "Frederiksted", label: "Frederiksted" },
      { value: "Kingshill", label: "Kingshill" },
      { value: "St. Croix", label: "St. Croix" },
      { value: "St. John", label: "St. John" },
      { value: "St. Thomas", label: "St. Thomas" },
      { value: "St. Croix", label: "St. Croix" },
      { value: "St. John", label: "St. John" },
      { value: "St. Thomas", label: "St. Thomas" },
      { value: "St. Croix", label: "St. Croix" },
      { value: "St. John", label: "St. John" },
      { value: "St. Thomas", label: "St. Thomas" },
    ],
  },
  {
    value: "Marshall Islands",
    label: "Marshall Islands",
    cities: [
      { value: "Majuro", label: "Majuro" },
      { value: "Kwajalein", label: "Kwajalein" },
      { value: "Ebeye", label: "Ebeye" },
      { value: "Majuro", label: "Majuro" },
      { value: "Kwajalein", label: "Kwajalein" },
      { value: "Ebeye", label: "Ebeye" },
      { value: "Majuro", label: "Majuro" },
      { value: "Kwajalein", label: "Kwajalein" },
      { value: "Ebeye", label: "Ebeye" },
      { value: "Majuro", label: "Majuro" },
      { value: "Kwajalein", label: "Kwajalein" },
      { value: "Ebeye", label: "Ebeye" },
      { value: "Majuro", label: "Majuro" },
      { value: "Kwajalein", label: "Kwajalein" },
    ],
  },
  {
    value: "Micronesia",
    label: "Micronesia",
    cities: [
      { value: "Pohnpei", label: "Pohnpei" },
      { value: "Kosrae", label: "Kosrae" },
      { value: "Yap", label: "Yap" },
      { value: "Chuuk", label: "Chuuk" },
      { value: "Pohnpei", label: "Pohnpei" },
      { value: "Kosrae", label: "Kosrae" },
      { value: "Yap", label: "Yap" },
      { value: "Chuuk", label: "Chuuk" },
      { value: "Pohnpei", label: "Pohnpei" },
      { value: "Kosrae", label: "Kosrae" },
      { value: "Yap", label: "Yap" },
      { value: "Chuuk", label: "Chuuk" },
      { value: "Pohnpei", label: "Pohnpei" },
      { value: "Kosrae", label: "Kosrae" },
      { value: "Yap", label: "Yap" },
      { value: "Chuuk", label: "Chuuk" },
      { value: "Pohnpei", label: "Pohnpei" },
      { value: "Kosrae", label: "Kosrae" },
      { value: "Yap", label: "Yap" },
      { value: "Chuuk", label: "Chuuk" },
      { value: "Pohnpei", label: "Pohnpei" },
    ],
  },
  {
    value: "Palau",
    label: "Palau",
    cities: [
      { value: "Koror", label: "Koror" },
      { value: "Melekeok", label: "Melekeok" },
      { value: "Ngerulmud", label: "Ngerulmud" },
      { value: "Airai", label: "Airai" },
      { value: "Hatohobei", label: "Hatohobei" },
      { value: "Ngiwal", label: "Ngiwal" },
      { value: "Melekeok", label: "Melekeok" },
      { value: "Ngerulmud", label: "Ngerulmud" },
      { value: "Airai", label: "Airai" },
      { value: "Hatohobei", label: "Hatohobei" },
      { value: "Ngiwal", label: "Ngiwal" },
      { value: "Melekeok", label: "Melekeok" },
      { value: "Ngerulmud", label: "Ngerulmud" },
    ],
  },
];

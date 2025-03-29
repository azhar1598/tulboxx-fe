import axios from "axios";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define the prompt for Gemini to generate a professional project description
const descriptionPrompt = `
Generate a professional and detailed project description for an estimate document based on the following project information. 
The description should include:
1. A compelling project overview that highlights the value to the customer
2. A clear scope of work section with bullet points
3. A concise timeline section mentioning the project duration
4. A pricing section that presents the cost professionally

Format the response exactly like this example:
---
Project Overview
We are pleased to present this project estimate for your upcoming project. Our solution will effectively address your specific needs.

Scope of Work
- First scope item
- Second scope item
- Third scope item

Timeline
The project is expected to take X weeks for completion.

Pricing
The total cost for the project is $X. This pricing is all-inclusive with no hidden fees.
---

Use the provided project details to personalize each section. Be specific about the type of work, customer pain points, and proposed solutions.

please provide the data in json format with key as {projectOverview:"", scopeOfWork:"", timeline:"", pricing:""}. only 
the json format and nothing else. follow this json format strictly.
`;

export async function POST(request: Request) {
  try {
    const estimateData = await request.json();

    // Format project duration in weeks
    const startDate = new Date(estimateData.projectStartDate);
    const endDate = new Date(estimateData.projectEndDate);
    const durationDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const durationWeeks = Math.ceil(durationDays / 7);

    // Create a comprehensive prompt with all the relevant project details
    const fullPrompt = `
      ${descriptionPrompt}
      
      Project Details:
      - Project Name: ${estimateData.projectName}
      - Customer: ${estimateData.customerName}
      - Type: ${estimateData.type}
      - Service: ${estimateData.serviceType}
      - Problem: ${estimateData.problemDescription}
      - Solution: ${estimateData.solutionDescription}
      - Cost: $${estimateData.projectEstimate}
      - Duration: ${durationDays} days (${durationWeeks} weeks)
      - Materials: ${estimateData.equipmentMaterials}
      - Additional Notes: ${estimateData.additionalNotes}
    `;

    // Call Gemini API
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" // Replace with your actual API key
    );
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedDescription = response.text();

    // Return the generated description
    return NextResponse.json({ description: generatedDescription });
  } catch (error: any) {
    console.error("Error generating project description:", error);
    return NextResponse.json(
      {
        error: "Failed to generate project description",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

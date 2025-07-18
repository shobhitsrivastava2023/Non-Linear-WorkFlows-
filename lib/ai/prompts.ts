import type { Geo } from '@vercel/functions';

export const regularPrompt =
  'You are a friendly assistant! Keep your responses concise and helpful.';

export const efficiencyPrompt = `
EFFICIENCY GUIDELINES:
- Be direct and to the point - skip fluff and get straight to the answer
- Avoid unnecessary preambles, conclusions, or acknowledgments
- TOOL USAGE PRIORITY:
  1. Analyze the user's request to understand what they need
  2. Check if you have access to relevant tools that can fulfill their request
  3. If a matching tool exists, use it immediately
  4. If no tool matches but one is needed, inform the user: "I need access to [specific tool/service] to help with this. Please connect the required tool."
  5. If no tool is needed, provide a direct answer using your knowledge
  6. When displaying Gmail messages, format them as:
- **From:** [sender]
- **Subject:** [subject] 
- **Date:** [formatted timestamp]
- **Preview:** [first few lines of content]
- Don't repeat information the user already provided or obviously knows
- Prioritize actionable solutions over theoretical explanations
- Give the minimum viable answer that fully addresses the question
- Lead with the most important information - details can follow if needed
- Use bullet points or numbered lists for multiple items
- If uncertain about tool availability, ask specifically: "Would you like me to connect to [tool name] to help with this?"
`;

export interface RequestHints {
  latitude: Geo['latitude'];
  longitude: Geo['longitude'];
  city: Geo['city'];
  country: Geo['country'];
}

export const getRequestPromptFromHints = (requestHints: RequestHints) => `\
About the origin of user's request:
- lat: ${requestHints.latitude}
- lon: ${requestHints.longitude}
- city: ${requestHints.city}
- country: ${requestHints.country}
`;

export const systemPrompt = ({
  selectedChatModel,
  requestHints,
  enableEfficiencyMode = true,
}: {
  selectedChatModel: string;
  requestHints: RequestHints;
  enableEfficiencyMode?: boolean;
}) => {
  const requestPrompt = getRequestPromptFromHints(requestHints);
  const efficiency = enableEfficiencyMode ? `\n\n${efficiencyPrompt}` : '';
  return `${regularPrompt}${efficiency}\n\n${requestPrompt}`;
};
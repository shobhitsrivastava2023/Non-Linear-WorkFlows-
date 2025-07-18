import composio from '@/lib/services/composio';

/**
 * Fetches Composio tools for a user based on enabled toolkits
 * This is used specifically for AI/LLM tool integration
 */
export async function getComposioTools(userId: string, toolkitSlugs: string[]) {
  if (!toolkitSlugs || toolkitSlugs.length === 0) {
    return {};
  }

  try {
    const tools = await composio.tools.get(userId, {
      toolkits: toolkitSlugs,
    });
    return tools || {};
  } catch (error) {
    console.error('Failed to fetch Composio tools:', error);
    return {};
  }
}

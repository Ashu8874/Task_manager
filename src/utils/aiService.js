const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

export const getAIInsight = async prompt => {
  if (!ANTHROPIC_API_KEY) {
    return 'AI insights require an API key. Please configure VITE_ANTHROPIC_API_KEY in your environment.';
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || 'Unable to generate insight.';
  } catch (error) {
    console.error('AI Service Error:', error);
    return 'AI insight unavailable. Please check your connection and API key.';
  }
};

export const getDashboardInsight = (tasks, projects, done, inProgress, overdue) => {
  const summary = `Team has ${tasks.length} tasks: ${done.length} done, ${inProgress.length} in progress, ${overdue.length} overdue across ${projects.length} projects.`;
  return getAIInsight(
    `As a project management AI, give a 2-sentence insight and recommendation for this team: ${summary}`
  );
};

export const getTaskRecommendation = (totalTasks, overdue, critical) => {
  return getAIInsight(
    `You are a project management assistant. Give a concise 2-sentence recommendation for a team with ${totalTasks} tasks, ${overdue} overdue, ${critical} critical priority. Be specific and actionable.`
  );
};

export const getWorkloadAnalysis = users => {
  const data = users
    .map(
      u =>
        `${u.name} (${u.role}): ${u.tasks} tasks, ${u.done} done, ${u.overdue} overdue`
    )
    .join('; ');
  return getAIInsight(
    `As a project management AI, analyze this team workload and give 3 specific recommendations: ${data}`
  );
};

import { GitHubIssue } from '../github.js';

export function formatIssueAsText(issue: GitHubIssue): string {
  const {
    title,
    body,
    labels,
    state,
    comments,
    user,
    created_at,
    updated_at,
    reactions,
    pull_request
  } = issue;

  // Format labels into a readable string
  const labelNames = labels.map((label) => label.name).join(', ') || 'None';

  // Format reactions
  const formattedReactions = `
      +1: ${reactions['+1']}, -1: ${reactions['-1']}, 
      laugh: ${reactions.laugh}, hooray: ${reactions.hooray}, 
      confused: ${reactions.confused}, heart: ${reactions.heart}, 
      rocket: ${reactions.rocket}, eyes: ${reactions.eyes}
    `;

  // Format pull request info
  const pullRequestInfo = pull_request
    ? `Associated Pull Request: ${pull_request.html_url}`
    : 'None';

  return `
  ### GitHub Issue Details
  
  **Title**: ${title}
  
  **Description**:
  ${body}
  
  **Labels**: 
  ${labelNames}
  
  **Current State**: 
  ${state}
  
  **Number of Comments**: 
  ${comments}
  
  **Reported By**: 
  ${user.login}
  
  **Created At**: 
  ${created_at}
  
  **Last Updated At**: 
  ${updated_at}
  
  **Reactions**:
  ${formattedReactions}
  
  **Associated Pull Request**: 
  ${pullRequestInfo}
`;
}

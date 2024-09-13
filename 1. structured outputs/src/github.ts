import axios, { AxiosResponse } from 'axios';

export interface GitHubLabel {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
}

export interface GitHubIssue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: string;
  locked: boolean;
  assignee: any;
  assignees: any[];
  milestone: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: any;
  author_association: string;
  active_lock_reason: any;
  body: string;
  closed_by: any;
  reactions: Reactions;
  timeline_url: string;
  performed_via_github_app: any;
  state_reason: any;
  draft?: boolean;
  pull_request?: PullRequest;
}

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
}

export interface Reactions {
  url: string;
  total_count: number;
  '+1': number;
  '-1': number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
}

export interface PullRequest {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  merged_at: any;
}

export interface GitHubApiResponse<T> {
  data: T;
}

export async function getGitHubData(owner: string, repo: string, token?: string) {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json'
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const labelsResponse: AxiosResponse<GitHubLabel[]> = await axios.get(`${baseUrl}/labels`, {
      headers
    });
    const issuesResponse: AxiosResponse<GitHubIssue[]> = await axios.get(`${baseUrl}/issues`, {
      headers
    });

    return {
      labels: labelsResponse.data,
      issues: issuesResponse.data
    };
  } catch (error) {
    console.error('Error fetching data from GitHub:', error);
    return { labels: [], issues: [] };
  }
}



/**
 * Metadata representing extracted data for automating triaging of any type of issue.
 */
export interface IssueTriageMetadata {
  /**
   * Suggested title for the issue report based on the issue description.
   * Automatically generated title that succinctly summarizes the problem or request.
   * Example: "Enhancement: Add support for two-factor authentication"
   */
  suggestedTitle: string;

  /**
   * Suggested labels based on the content of the issue.
   * Labels like component, priority, issue type, etc., automatically assigned.
   * Example: ["enhancement", "security", "high-priority"]
   */
  suggestedLabels: string[];

  /**
   * Severity level of the issue, indicating how critical the issue is (if applicable).
   * Derived from the issue description, relevant to bugs, security issues, or critical enhancements.
   * Example: "Critical"
   */
  severity: 'Critical' | 'Major' | 'Minor' | 'Trivial';

  /**
   * Priority level of the issue, indicating how soon the issue needs to be addressed.
   * Useful for both bugs and other issue types like enhancements or performance improvements.
   * Example: "High"
   */
  priority: 'High' | 'Medium' | 'Low';

  /**
   * Assessment of the potential impact or risk of the issue.
   * Describes how the issue affects the system, users, or business.
   * Example: "High impact: Security vulnerability affecting user authentication"
   */
  impact: string;

  /**
   * The environment details where the issue occurred, if applicable (e.g., OS, browser, device).
   * Extracted from the issue description, relevant for bugs and performance issues.
   * Example: "Windows 10, Chrome 92, Lenovo ThinkPad"
   */
  environment: string | null;

  /**
   * The software version where the issue was encountered or is relevant.
   * Useful for both bugs (regression testing) and enhancement requests (version planning).
   * Example: "v2.3.1"
   */
  version: string | null;

  /**
   * Stack trace or error logs associated with the issue, if applicable (mainly for bugs or crashes).
   * Extracted from the issue report, often included for debugging.
   * Example: "NullReferenceException at AuthService.authenticate() in authentication.js:42"
   */
  stackTrace: string | null;

  /**
   * Steps to reproduce the issue, particularly for bugs or performance issues.
   * Helps developers replicate the problem or validate that it exists.
   * Example: ["Open Chrome", "Go to login page", "Submit empty form", "Observe error"]
   */
  reproSteps: string[] | null;

  /**
   * Error codes extracted from the issue description or logs, applicable to bugs or crashes.
   * Helps identify specific error messages or codes related to the issue.
   * Example: ["401", "ECONNRESET"]
   */
  errorCodes: string[] | null;

  /**
   * The specific module or component affected by the issue.
   * Derived from the issue content, helps route the issue to the correct team.
   * Example: "Authentication"
   */
  component: string | null;

  /**
   * The type of issue, such as bug, enhancement, performance issue, security vulnerability, or documentation.
   * Helps classify the issue for proper triaging and tracking.
   * Example: "Enhancement"
   */
  issueType: 'Bug' | 'Enhancement' | 'Performance' | 'Security' | 'Documentation';

  /**
   * A short, auto-generated summary of the issue meant for developers or project managers.
   * Provides a concise explanation of the issue, its potential causes, and what area of the code might need attention.
   * Example: "Security vulnerability in authentication module, allowing unauthorized access when cookies are disabled."
   */
  developerSummary: string;
}

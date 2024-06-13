import { assert } from "https://deno.land/std@0.201.0/assert/assert.ts";
import { Octokit } from "npm:octokit@3.2.1";
import commitPlugin from "npm:octokit-commit-multiple-files";

const PatchedOctokit = Octokit.plugin(commitPlugin);
const ghToken = Deno.env.get("GH_TOKEN");
assert(ghToken, "failed to get github token");

export const octokit: Octokit = new PatchedOctokit({
  auth: ghToken,
});

export async function getIssueEvent() {
  const githubEventPath = Deno.env.get("GITHUB_EVENT_PATH");
  assert(githubEventPath, "failed to get github event path");

  const githubEventRaw = await Deno.readTextFile(githubEventPath);
  let githubEvent: any; // Assuming you're parsing various event types, use 'any' for flexibility
  try {
    githubEvent = JSON.parse(githubEventRaw);
  } catch (error) {
    throw new Error("Failed to parse GitHub event JSON");
  }

  const eventName = Deno.env.get("GITHUB_EVENT_NAME");
  assert(eventName, "failed to get event name");

  const actor = Deno.env.get("ACTOR");
  assert(actor, "failed to get actor");

  if (eventName === "pull_request_review_comment") {
    const { action, comment, pull_request } = githubEvent as unknown as {
      action: string;
      comment: { body: string };
      pull_request: { body: string };
    };
    const { owner, repo } = getOwnerAndRepo();

    const connectedIssue = await getConnectedIssue(owner, repo, pull_request.body);
    githubEvent = {
      actor: { login: actor },
      action,
      comment,
      issue: connectedIssue,
    };
  }

  return {
    githubEvent: {
      ...githubEvent,
      actor: { login: actor },
    },
    eventName,
  };
}

async function getConnectedIssue(owner: string, repo: string, prBody: string) {
  // Example function to fetch connected issue or perform necessary GraphQL query
  // Modify this function based on your actual implementation
  try {
    // Example: Fetching issue details
    const issueNumber = extractIssueNumberFromPRBody(prBody); // Implement this function

    // Make sure issueNumber is correctly extracted and valid
    if (!issueNumber) {
      throw new Error("Could not extract valid issue number from PR body");
    }

    const response = await octokit.graphql(`
      query($owner: String!, $repo: String!, $issueNumber: Int!) {
        repository(owner: $owner, name: $repo) {
          issue(number: $issueNumber) {
            number
            title
            body
          }
        }
      }
    `, {
      owner,
      repo,
      issueNumber,
    });

    // Log the GraphQL response for debugging
    console.log("GraphQL Response:", JSON.stringify(response, null, 2));

    const issue = response.repository.issue;
    if (!issue) {
      throw new Error(`Could not resolve to an Issue with the number of ${issueNumber}`);
    }

    return issue;
  } catch (error) {
    console.error("Error fetching connected issue:", error);
    throw error; // Ensure error propagates for visibility in workflow logs
  }
}

function getOwnerAndRepo() {
  const owner = Deno.env.get("GITHUB_REPOSITORY_OWNER");
  assert(owner, "failed to get repo owner");

  let repo = Deno.env.get("GITHUB_REPOSITORY");
  assert(repo, "failed to get repo name");
  repo = repo.replace(`${owner}/`, "");

  return { owner, repo };
}

function extractIssueNumberFromPRBody(prBody: string): number | null {
  // Implement logic to extract issue number from PR body
  // Example: Regex or parsing logic
  // For simplicity, assuming PR body contains issue number directly
  const match = prBody.match(/Issue number: (\d+)/);
  if (match) {
    return parseInt(match[1], 10); // Assuming issue number is in capture group 1
  }
  return null;
}

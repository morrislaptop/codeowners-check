import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'

export async function getChangedFiles(
  context: Context,
  client: ReturnType<typeof github.getOctokit>
): Promise<string[]> {
  if (!['push', 'pull_request'].includes(context.eventName)) {
    throw new Error(`Unexpected event: ${context.eventName}`)
  }

  // Note: the per_page param is set to the max value for a single page (100)
  // TODO: implement pagination to get all files if > 100
  // TODO: use graphql api
  const files = await client.rest.pulls.listFiles({
    owner: context.issue.owner,
    repo: context.issue.repo,
    pull_number: context.issue.number,
    per_page: 100
  })

  return files.data
    .filter(f => f.filename !== 'CODEOWNERS')
    .filter(f => f.status !== 'removed')
    .map(f => f.filename)
}

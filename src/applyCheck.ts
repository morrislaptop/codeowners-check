import * as core from '@actions/core'
import * as github from '@actions/github'

export async function applyCheck(
  client: ReturnType<typeof github.getOctokit>,
  files: Set<string>
): Promise<void> {
  const checkResponse = await client.rest.checks.create({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    name: 'CODEOWNERS Check',
    head_sha:
      github.context.payload.pull_request?.head.sha ||
      github.context.payload.after ||
      github.context.sha,
    status: 'completed',
    conclusion: files.size > 0 ? 'failure' : 'success',
    completed_at: new Date(),
    output: {
      title: 'CODEOWNERS Check',
      summary: `${files.size} files have no owners.`,
      annotations: [...files]
        .map(file => ({
          path: file,
          annotation_level: 'failure',
          message: 'File not covered by CODEOWNERS',
          start_line: 0,
          end_line: 1
        }))
        .slice(0, 50)
    }
  })

  core.info(`checkResponse: ${JSON.stringify(checkResponse, null, 2)}`)
}

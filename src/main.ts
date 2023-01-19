import * as core from '@actions/core'
import * as github from '@actions/github'
import {applyCheck} from './applyCheck'
import {getChangedFiles} from './getChangedFiles'
import {getUnownedPaths} from './getUnownedPaths'

async function run(): Promise<void> {
  try {
    const client = github.getOctokit(core.getInput('myToken'))

    // get all paths (file paths) changed in the PR
    const paths: string[] = await getChangedFiles(github.context, client)
    core.info(`Obtained paths: ${paths}`)

    // paths -> set of codeowners for the paths
    const unowned: Set<string> = await getUnownedPaths(paths)
    core.info(`Unowned paths: ${Array.from(unowned)}`)

    // apply the set of labels to the PR
    await applyCheck(client, unowned)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

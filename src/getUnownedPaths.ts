import Codeowners from 'codeowners'

export async function getUnownedPaths(paths: string[]): Promise<Set<string>> {
  const repos = new Codeowners()
  const unowned: Set<string> = new Set()
  for (const path of paths) {
    const pathowners = repos.getOwner(path)
    if (pathowners.length < 1) {
      unowned.add(path)
    }
  }
  return unowned
}


import marpCLI from '@marp-team/marp-cli/lib/marp-cli.js';

export async function startServer(serverFolder) {
    const args = ['-w','-p', '--server', serverFolder]
  await    marpCLI.cliInterface(args)



}

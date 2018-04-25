import * as path from 'path';
import * as fs from 'fs';
import { cd, exec, ExecOutputReturnValue, echo } from 'shelljs';
import * as inquirer from 'inquirer';
import * as semver from 'semver';

const prompt = inquirer.createPromptModule();

interface IPackageDefinition {
    name: string;
    dependencies: string[];
}

type ReleaseChannel = 'next' | 'latest';

// See: https://semver.org/
type ReleaseType = 'prerelease' | 'patch' | 'minor' | 'major';

const packages: IPackageDefinition[] = [
    {
        name: 'tstuto-server',
        dependencies: [
            'tstuto-web-client',
            'tstuto-api'
        ]
    },
    {
        name: 'tstuto-web-client',
        dependencies: [
            'tstuto-api'
        ]
    },
    {
        name: 'tstuto-api',
        dependencies: [
        ]
    },
];

(async function main() {

    const npmUser = exec('npm whoami').stdout.trim();

    if (npmUser === '') {
        echo('Error: please log into npm first');
        process.exit(1);
    }

    const config = await configure();
    const channel: string = config.channel;

    const version = getVersion(config.releaseType, config.channel, npmUser);

    const result = await prompt<any>([{
        type: 'confirm',
        name: 'confirmRelease',
        message: `You are about to release v${version} on channel ${channel}. Proceed?`,
        default: false
    }]);
    if (!result.confirmRelease) {
        process.exit(1);
        return;
    }

    preparePackages(version, npmUser);

    doNpmRelease(config.channel, npmUser);

    restorePackages(npmUser);
})();

async function configure() {

    const { channel, preRelease, message } = await prompt<any>([{
        type: 'list',
        name: 'channel',
        message: 'To which channel would you like to release?',
        choices: ['next', 'latest'],
        filter: function(val) {
          return val.toLowerCase();
        }
    }, {
        type: 'input',
        name: 'message',
        message: 'Short release message'
    }, {
        type: 'confirm',
        name: 'preRelease',
        message: 'Is this a pre-release?',
        default: true
    }]);

    let releaseType: ReleaseType = 'prerelease';
    
    if (!preRelease) {
        releaseType = (await prompt<any>([{
            type: 'list',
            name: 'releaseType',
            message: 'What kind of release are you performing?',
            choices: ['patch', 'minor', 'major'],
            filter: function(val) {
              return val.toLowerCase();
            }
        }])).releaseType;
    }

    return { channel: channel as ReleaseChannel, preRelease, releaseType, message };
}

function getVersion(releaseType: ReleaseType, channel: ReleaseChannel, npmUser: string): string {
    console.log('Determining previous version');
    const result = exec(`npm show @${npmUser}/${packages[0].name}@${channel} version`, {
        silent: true
    }) as ExecOutputReturnValue;
    const rawVersion = result.stdout.split('\n')[0];

    const previousVersion = (rawVersion != '') ? semver.valid(rawVersion) : '0.0.0';

    if (previousVersion == null) {
        throw new Error(`Invalid previous version (${result.stdout}). aborting`);
    }
    const nextVersion = semver.inc(previousVersion, releaseType);
    if (nextVersion === null) {
        throw new Error(`Invalid version: ${previousVersion}`);
    }
    if (releaseType !== 'prerelease' && channel !== 'latest') {
        // Automatically append a prerelease trailer on secondary channels
        return nextVersion + `-${channel}.0`;
    }

    return nextVersion;
}

function preparePackages(version: string, npmUser: string) {
    for (const pkg of packages) {
        const pkgJSONPath = packageDirectory(npmUser, pkg.name, 'package.json');
        const pkgJSON = require(pkgJSONPath);
        pkgJSON.version = version;
        pkgJSON.name = `@${npmUser}/${pkg.name}`;
        for (const dep of pkg.dependencies) {
            pkgJSON.dependencies[`@${npmUser}/${dep}`] = version;
        }
        fs.writeFileSync(pkgJSONPath, JSON.stringify(pkgJSON, null, 4), { encoding: 'utf-8' });
    }
}

function restorePackages(npmUser: string) {
    for (const pkg of packages) {
        const pkgJSONPath = packageDirectory(npmUser, pkg.name, 'package.json');
        const pkgJSON = require(pkgJSONPath);
        pkgJSON.version = '0.0.0';
        pkgJSON.name = pkg.name;
        // This might actually not be necessary if the package is cached we already get the original.
        for (const dep of pkg.dependencies) {
            delete pkgJSON.dependencies[`@${npmUser}/${dep}`];
        }
        fs.writeFileSync(pkgJSONPath, JSON.stringify(pkgJSON, null, 4), { encoding: 'utf-8' });
    }
}

function doNpmRelease(channel: ReleaseChannel, npmUser: string) {
    for (const pkg of packages) {
        cd(packageDirectory(npmUser, pkg.name));
        exec(`npm publish --access=public --tag=${channel}`);
    }
}

function packageDirectory(npmUser: string, pkgName: string, file?: string) {
    return path.join(__dirname, '../packages', '@' + npmUser, pkgName, file ? file : '')
}

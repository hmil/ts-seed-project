#!/bin/sh

# 1. get user from command line
if [ -z "$1" ]; then
    echo 'Looking up npm user...'
    user=`npm whoami`
    if [ -z "$user" ]; then
        echo 'No user detected'
        exit 1
    fi
    NPM_USER="$user"
else
    NPM_USER="$1"
fi

if [ ! -e "packages/tstuto-server" ]; then
    echo 'You can only run this script once. If you made a mistake, please run "git reset --hard" and try again'
    exit 1;
fi

rm -rf packages/@*

echo "Customizing for user: ${NPM_USER}";

# 2. move all packages to subfolder with username
mkdir -p "packages/@${NPM_USER}";
mv packages/tstuto-* "packages/@${NPM_USER}/";

# 3. replace <NPM_USER> with actual user

for f in $(grep -lrw packages --include='*.ts' --include='*.json' -e '<NPM_USER>'); do
    sed -e "s/<NPM_USER>/@${NPM_USER}/" -i .bak "$f"
done

rm $(find packages -name '*.bak')

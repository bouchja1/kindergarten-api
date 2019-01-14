// https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh
module.exports = {
    apps: [{
        name: "kindergarten-api",
        //cwd: "/home/travis/projects/kindergarten-api/current/",
        //script: "/home/travis/projects/kindergarten-api/current/app/index.js"
        script: "app/index.js"
    }],
    deploy: {
        // "production" is the environment name
        productionLocal: {
            // SSH key path, default to $HOME/.ssh
            key: "~/.ssh/travis_pm2_rsa",
            // SSH user
            user: "travis",
            // SSH host
            host: ["185.8.165.64"],
            // SSH options with no command-line flag, see 'man ssh'
            // can be either a single string or an array of strings
            ssh_options: "StrictHostKeyChecking=no",
            // GIT remote/branch
            ref: "origin/master",
            // GIT remote
            repo: "https://github.com/bouchja1/kindergarten-api.git",
            // path in the server
            path: "/home/travis/projects/kindergarten-api",
            // Pre-setup command or path to a script on your local machine
            "pre-setup": "ls -la",
            // Post-setup commands or path to a script on the host machine
            // eg: placing configurations in the shared dir etc
            "post-setup": "ls -la",
            // pre-deploy action
            "pre-deploy":"git pull",
            "pre-deploy-local": "echo 'This is a local executed command'",
            // post-deploy action
            "post-deploy": "mkdir -p logs && touch logs/all-logs.log && npm install && pm2 startOrRestart ecosystem.config.js --log logs/all-logs.log"
        },
        production: {
            // SSH key path, default to $HOME/.ssh
            key: "/tmp/travis_pm2_rsa",
            // SSH user
            user: "travis",
            // SSH host
            host: ["185.8.165.64"],
            // SSH options with no command-line flag, see 'man ssh'
            // can be either a single string or an array of strings
            ssh_options: "StrictHostKeyChecking=no",
            // GIT remote/branch
            ref: "origin/master",
            // GIT remote
            repo: "https://github.com/bouchja1/kindergarten-api.git",
            // path in the server
            path: "/home/travis/projects/kindergarten-api",
            // Pre-setup command or path to a script on your local machine
            "pre-setup": "ls -la",
            // Post-setup commands or path to a script on the host machine
            // eg: placing configurations in the shared dir etc
            "post-setup": "ls -la",
            // pre-deploy action
            "pre-deploy":"git fetch --all",
            "pre-deploy-local": "echo 'This is a local executed command'",
            // post-deploy action
            "post-deploy": "mkdir -p logs && touch logs/all-logs.log && npm install && pm2 startOrRestart ecosystem.config.js --log logs/all-logs.log"
        },
    }
}
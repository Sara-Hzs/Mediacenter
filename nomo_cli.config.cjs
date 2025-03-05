const nomoCliConfig = {
  deployTargets: {
    production: {
      rawSSH: {
        sshHost: 'root@0.0.0.0',
        sshBaseDir: '/var/www/html/',
        publicBaseUrl: 'https://button.nomo.me',
      },
    },
  },
}

module.exports = nomoCliConfig

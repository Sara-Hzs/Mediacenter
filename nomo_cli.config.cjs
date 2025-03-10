const nomoCliConfig = {
  deployTargets: {
    production: {
      rawSSH: {
        sshHost: 'root@157.180.29.50',
        sshBaseDir: '/var/www/html/',
        publicBaseUrl: 'https://mediacenter.nomo.zone',
      },
    },
  },
}

module.exports = nomoCliConfig

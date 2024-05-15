const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const tar = require('tar');

class Deploy {
    constructor() {
        this.questions();
    }

    questions() {
        const prompts = [];
        const packages = fs.readdirSync(path.join(__dirname, '../', 'dist'));
        packages
            .filter(pkg => pkg.includes('.tgz'))
            .forEach((pkg, index) => {
                console.log(`${index + 1}. ${pkg}`);
                prompts.push({
                    type: 'list',
                    name: 'package',
                    message: '¿Qué paquete quieres desplegar?',
                    choices: packages
                });
            });

        prompts.push({
            type: 'list',
            name: 'environment',
            message: '¿En qué entorno?',
            when: (answers) => answers.package,
            choices: [
                { name: 'Integración', value: 'integration' },
                { name: 'Pruebas', value: 'testing' },
                { name: 'Producción', value: 'production' },
            ]
        });
        inquirer.prompt(prompts).then(answers => {
            const destFolder = 'deployments';
            const destiny = path.join(__dirname, '../', destFolder);
            this.checkFolder(path.join(__dirname, '../', destFolder));
            const folder = path.join(destiny, answers.environment);
            this.checkFolder(folder);
            const taggedPackageByEnv = path.join(folder, this.tagByEnv(answers.package, answers.environment));
            fs.copyFileSync(path.join(__dirname, '../', 'dist', answers.package), taggedPackageByEnv)
            const options = { file: taggedPackageByEnv, cwd: path.join(folder) };
            tar.x(options)
                .then(() => console.log('Desplegado!'))
                .catch(err => console.error(err));
        });

    }
    tagByEnv = (pkg, env) => {
        const envs = {
            integration: 'SNAPSHOT',
            testing: 'RC',
            production: ''
        };
        return env !== 'production' ? pkg.replace('.tgz', `-${envs[env]}.tgz`) : pkg;
    }
    checkFolder = folder => !fs.existsSync(folder) ? fs.mkdirSync(folder) : null;

}

new Deploy();

module.exports = { Deploy }
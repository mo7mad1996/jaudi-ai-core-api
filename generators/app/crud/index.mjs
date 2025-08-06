import { camelCase, constantCase, kebabCase, pascalCase } from 'change-case';
import Generator from 'yeoman-generator';

import { buildTemplateUrls } from './helpers/build-template-urls.mjs';

export default class extends Generator {
  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the module (for example: user-ticket):',
        default: 'example-module',
      },
    ]);
  }

  writing() {
    const userInputName = kebabCase(this.answers.name);
    const moduleName = pascalCase(userInputName);
    const modulePath = this.destinationPath(`src/module/${userInputName}`);
    const baseParams = {
      name: userInputName,
      moduleName,
      pascalCase,
      kebabCase,
      camelCase,
      constantCase,
    };

    const copyTemplate = (templatePath, destinationPath) => {
      this.fs.copyTpl(
        this.templatePath(templatePath),
        this.destinationPath(destinationPath),
        baseParams,
      );
    };

    const templates = buildTemplateUrls(modulePath, userInputName);

    templates.forEach(({ template, destination }) =>
      copyTemplate(template, destination),
    );

    this._addModuleToAppModule(moduleName, userInputName);
  }

  _addModuleToAppModule(moduleName, modulePath) {
    const appModulePath = this.destinationPath('src/module/app.module.ts');
    const appModuleContent = this.fs.read(appModulePath);
    const importStatement = `import { ${moduleName}Module } from '@/module/${modulePath}/${modulePath}.module';\n`;
    const isModuleInImports = appModuleContent.includes(importStatement.trim());
    const IMPORTS_SECTION_REGEX = /imports: \[[\s\S]*\]/;
    const IMPORTS_CONTENT_REGEX = /(imports: \[)([\s\S]*)(\])/m;

    if (isModuleInImports) {
      this.coloredLogger(
        `\nThe ${moduleName} module is already in app.module.ts file \n\n`,
        'skip',
      );
      return;
    }

    const newModuleInImports = `\n    ${pascalCase(moduleName)}Module,`;

    const updatedContent = appModuleContent.replace(
      IMPORTS_SECTION_REGEX,
      (importsSection) =>
        importsSection.replace(
          IMPORTS_CONTENT_REGEX,
          (_, start, content, end) =>
            `${start}${newModuleInImports}${content}${end}`,
        ),
    );
    this.fs.write(appModulePath, importStatement + updatedContent);
  }

  coloredLogger(message, color) {
    const logger = this.env.adapter.log;
    logger.colored([
      {
        message,
        color,
      },
    ]);
  }
}

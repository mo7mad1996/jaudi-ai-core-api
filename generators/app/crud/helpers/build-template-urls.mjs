import { pascalCase } from 'change-case';

export const buildTemplateUrls = (modulePath, name) => {
  return [
    {
      template: 'module.ejs',
      destination: `${modulePath}/${name}.module.ts`,
    },
    {
      template: 'application/service/service.ejs',
      destination: `${modulePath}/application/service/${name}.service.ts`,
    },
    {
      template: 'interface/controller/controller.ejs',
      destination: `${modulePath}/interface/${name}.controller.ts`,
    },
    {
      template: 'tests/tests-e2e-spec.ejs',
      destination: `${modulePath}/__tests__/${name}.e2e.spec.ts`,
    },
    {
      template: 'tests/fixture/entity-fixture.ejs',
      destination: `${modulePath}/__tests__/fixture/${pascalCase(name)}.yml`,
    },
    {
      template: 'tests/fixture/user-fixture.ejs',
      destination: `${modulePath}/__tests__/fixture/User.yml`,
    },
    {
      template: 'infrastructure/database/repository.ejs',
      destination: `${modulePath}/infrastructure/database/${name}.mysql.repository.ts`,
    },
    {
      template: 'infrastructure/database/schema.ejs',
      destination: `${modulePath}/infrastructure/database/${name}.schema.ts`,
    },
    {
      template: 'domain/entity.ejs',
      destination: `${modulePath}/domain/${name}.entity.ts`,
    },
    {
      template: 'domain/entity-spec.ejs',
      destination: `${modulePath}/domain/${name}.entity.spec.ts`,
    },
    {
      template: 'domain/permission.ejs',
      destination: `src/module/${name}/domain/${name}.permission.ts`,
    },
    {
      template: 'application/dto/create-dto.ejs',
      destination: `src/module/${name}/application/dto/create-${name}.dto.ts`,
    },
    {
      template: 'application/dto/update-dto.ejs',
      destination: `src/module/${name}/application/dto/update-${name}.dto.ts`,
    },
    {
      template: 'application/dto/response-dto.ejs',
      destination: `src/module/${name}/application/dto/${name}-response.dto.ts`,
    },
    {
      template: 'application/dto/create-dto-interface.ejs',
      destination: `src/module/${name}/application/dto/create-${name}.dto.interface.ts`,
    },
    {
      template: 'application/dto/update-dto-interface.ejs',
      destination: `src/module/${name}/application/dto/update-${name}.dto.interface.ts`,
    },
    {
      template: 'application/mapper/mapper.ejs',
      destination: `src/module/${name}/application/mapper/${name}.mapper.ts`,
    },
    {
      template: 'application/repository/repository-interface.ejs',
      destination: `src/module/${name}/application/repository/${name}.repository.interface.ts`,
    },
    {
      template: 'infrastructure/database/exception/not-found-exception.ejs',
      destination: `src/module/${name}/infrastructure/database/exception/${name}-not-found.exception.ts`,
    },
    {
      template: 'application/dto/sort-query-params-dto.ejs',
      destination: `src/module/${name}/application/dto/${name}-sort-query-params.dto.ts`,
    },
    {
      template: 'application/dto/filter-query-params-dto.ejs',
      destination: `src/module/${name}/application/dto/${name}-filter-query-params.dto.ts`,
    },
    {
      template: 'application/policy/create-policy-handler.ejs',
      destination: `src/module/${name}/application/policy/create-${name}-policy.handler.ts`,
    },
    {
      template: 'application/policy/read-policy-handler.ejs',
      destination: `src/module/${name}/application/policy/read-${name}-policy.handler.ts`,
    },
    {
      template: 'application/policy/update-policy-handler.ejs',
      destination: `src/module/${name}/application/policy/update-${name}-policy.handler.ts`,
    },
    {
      template: 'application/policy/delete-policy-handler.ejs',
      destination: `src/module/${name}/application/policy/delete-${name}-policy.handler.ts`,
    },
  ];
};

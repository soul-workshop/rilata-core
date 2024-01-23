export type ModuleParams = {
  name: string,
  subscribeModules: ModuleParams,
}

export type ModuleType = 'command-module' | 'read-module' | 'common-module';

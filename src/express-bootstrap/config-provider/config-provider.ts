import convict from 'convict';
import config from '../../../config';

// TODO: we need to change any to generic and accept the schema type from the consumer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let convictConfigurationProvider: convict.Config<any> | undefined;

export function initializeAndValidate(schema) {
  convictConfigurationProvider = convict(schema);
  convictConfigurationProvider.validate();
}

// Meant mostly for testing purposes, to allow resetting the state between tests
export function reset() {
  convictConfigurationProvider = undefined;
}

export function getValue(keyName: string): string {
  if (convictConfigurationProvider === undefined) {
    throw new Error('Configuration has not been initialized yet');
  }

  // TODO: we need to change any to generic and accept the schema type from the consumer
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return convictConfigurationProvider.get(keyName) as string;
}

class ConfigProvider<T> {
  #convictConfigurationProvider: convict.Config<T> | undefined;

  initializeAndValidate(schema: convict.Schema<T>) {
    this.#convictConfigurationProvider = convict(schema);
    this.#convictConfigurationProvider.validate();
  }

  reset() {
    convictConfigurationProvider = undefined;
  }

  getValue<P extends keyof convict.Schema<T>>(
    keyName: P
  ): P extends null | undefined ? T : convict.PathValue<T, P> {
    if (this.#convictConfigurationProvider === undefined) {
      throw new Error('Configuration has not been initialized yet');
    }

    return this.#convictConfigurationProvider.get(keyName);
  }
}

const configProvider = new ConfigProvider<convict.Schema>();
configProvider.initializeAndValidate(config);
configProvider.getValue('cors.origin');

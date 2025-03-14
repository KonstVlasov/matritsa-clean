import type { Compiler, RspackPluginInstance } from '@rspack/core';
import { exec } from 'node:child_process';

// плагин который запустит генератор после того как он будет собран
export class NodeRunPlugin implements RspackPluginInstance {
  options: { script: string };

  constructor(options: { script: string }) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    const pluginName = 'NodeRunPlugin';

    compiler.hooks.afterEmit.tapPromise({ name: pluginName }, async compilation => {
      if (compilation.errors.length > 0) {
        return;
      }

      await new Promise<void>((done, fail) => {
        exec(`node ${this.options.script}`, error => {
          if (error) {
            // eslint-disable-next-line no-console
            console.log(`${pluginName} error:`, error);
            fail(error);
          } else {
            // eslint-disable-next-line no-console
            console.log(`${pluginName}: done`);
            done();
          }
        });
      });
    });
  }
}

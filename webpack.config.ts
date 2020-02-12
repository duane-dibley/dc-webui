import { Configuration } from 'webpack';
import { ProcessEnvOptions } from 'child_process';
import devConfig from './webpack.config.dev';
import prodConfig from './webpack.config.prod';

export default function config(env: ProcessEnvOptions, argv: Configuration): Configuration[] {
  return argv.mode === 'development' ? devConfig : prodConfig;
}

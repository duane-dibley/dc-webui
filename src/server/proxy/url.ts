export default function url(config: any, resource: string): string {
  return `${config.protocol}://${config.uri}${config.port ? `:${config.port}` : ''}${resource.charAt(0) === '/' ? resource : `/${resource}`}`;
}

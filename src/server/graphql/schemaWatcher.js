import { watchPostGraphileSchema } from 'postgraphile';

let graphqlSchema;
export async function startSchemaWatcher(...options) {
  await watchPostGraphileSchema(
    ...options,
    (newSchema) => {
      graphqlSchema = newSchema;
    },
  );
}

export function getSchema() {
  return graphqlSchema;
}

// attaches a "random" field to every object
function MyRandomFieldPlugin(
  builder,
  { myDefaultMin = 1, myDefaultMax = 100 },
) {
  builder.hook('GraphQLObjectType:fields', (
    fields, // input object
    { extend, graphql: { GraphQLInt } }, // Build
    context, // eslint-disable-line
  ) => (
    extend(fields, {
      random: {
        type: GraphQLInt,
        args: {
          sides: {
            type: GraphQLInt,
          },
        },
        resolve(_, { sides = myDefaultMax }) {
          return (
            Math.floor(Math.random() * (sides - (myDefaultMin + 1))) + myDefaultMin
          );
        },
      },
    })
  ));
}

export default () => ({
  appendPlugins: [MyRandomFieldPlugin],
});

export default async (ctx) => {
  const body = ctx.request.body;

  const redirectTo = body.redirectTo;
  const query = body.query;

  const variables = body;
  delete variables.query;
  delete variables.redirectTo;

  // TODO: save a roundtrip by making a request to local graphql instead of origin graphql
  await fetch(
    `${process.env.HOST || ctx.request.origin}/graphql`,
    {
      method: 'POST',
      body: JSON.stringify({
        query,
        variables,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  ).then(() => {
    ctx.redirect(301, `${process.env.HOST || ctx.request.origin}/${redirectTo}`);
  });
};

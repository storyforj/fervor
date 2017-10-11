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
  ).then((res) => res.json())
  // data does get used, redirectTo could use `data` from the gql response
  .then(({data}) => { // eslint-disable-line
    // eslint-disable-next-line
    const redirectPath = eval('`' + redirectTo + '`');
    ctx.redirect(301, `${process.env.HOST || ctx.request.origin}/${redirectPath}`);
  });
};

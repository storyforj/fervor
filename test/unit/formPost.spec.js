import formPost from '../../src/server/formPost';

describe('Server side form posts', () => {
  it('makes a redirect after a post', async () => {
    const responseBody = JSON.stringify({});
    fetch.mockResponseOnce(responseBody);

    const ctx = {
      request: {
        body: { redirectTo: 'redirectURL' },
      },
      redirect: jest.fn(),
    };
    await formPost(ctx).then(() => {
      expect(ctx.redirect.mock.calls[0][1].indexOf('redirectURL') > 0).toBe(true);
    });
  });
});

// Decap CMS GitHub OAuth — 1단계: GitHub 로그인으로 보내기
export const onRequest = async ({ request, env }) => {
  const url = new URL(request.url);
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  authUrl.searchParams.set('scope', 'repo,user');
  authUrl.searchParams.set('state', crypto.randomUUID());
  return Response.redirect(authUrl.href, 302);
};

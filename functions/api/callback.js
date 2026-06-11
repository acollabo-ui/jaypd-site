// Decap CMS GitHub OAuth — 2단계: 토큰 교환 후 CMS 창에 전달 (표준 핸드셰이크)
export const onRequest = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return new Response('Missing code', { status: 400 });

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    return new Response('OAuth failed: ' + JSON.stringify(data), { status: 401 });
  }

  const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
  const page = [
    '<!doctype html><html><body><script>',
    '(function(){',
    '  function send(e){',
    `    window.opener.postMessage('authorization:github:success:' + ${JSON.stringify(payload)}, e.origin);`,
    '  }',
    "  window.addEventListener('message', send, false);",
    "  window.opener.postMessage('authorizing:github', '*');",
    '})();',
    '</script>로그인 처리 중...</body></html>',
  ].join('\n');
  return new Response(page, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};

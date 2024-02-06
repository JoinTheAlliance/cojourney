import { createClient } from "@supabase/supabase-js";
import jwt from '@tsndr/cloudflare-worker-jwt';

class Handler {
  method;
  regex;
  hostRegex;
  fn;
  isServerless;
  serverLessEndpoint;

  constructor({
    method = '*',
    regex = /^/,
    hostRegex = /^/,
    fn = async ({req, env, match, userId, supabase}) => { },
    isServerless = false,
    serverLessEndpoint = ''
  } = {}) {
    this.method = method;
    this.regex = regex;
    this.hostRegex = hostRegex;
    this.fn = fn;
    this.isServerless = isServerless;
    this.serverLessEndpoint = serverLessEndpoint;
  }
}

class Server {
  handlers;
  constructor() {
    this.handlers = [];
  }
  registerHandler(opts) {
    const handler = new Handler(opts);
    this.handlers.push(handler);
  }

  async serializeRequest(req) {
    // Serialize request headers
    const headers = {};
    for (const [key, value] of req.headers) {
      headers[key] = value;
    }

    // Serialize the request body if necessary
    let body = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      try {
        body = await req.text();
      } catch (error) {
        body = "Failed to read body: " + error.message;
      }
    }

    return {
      method: req.method,
      url: req.url,
      headers: headers,
      body: body
    };
  }

  async handleRequest(req, env) {
    const { pathname, host } = new URL(req.url);
    let handlerFound = false;

    for (let handler of this.handlers) {
      const { method, hostRegex, regex, fn } = handler;
      if (method === '*' || req.method === method) {
        const matchHost = (host || '').match(hostRegex);
        const matchUrl = pathname.match(regex);

        if (matchHost && matchUrl) {
          handlerFound = true;
          try {
            req.pathname = pathname;

            const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_API_KEY, {
              auth: {
                persistSession: false
              }
            });

            const token = request.headers.get('Authorization') &&
              request.headers.get('Authorization').replace('Bearer ', '');
            
            const out = await jwt.decode(token)

            userId = out?.payload?.sub || out?.payload?.id || out?.id;

            if(!userId) {
              return new Response('Unauthorized', { status: 401 });
            }

            console.log('userId', userId)

            return await fn({ req, env, match: matchUrl, host: matchHost, userId, supabase });
          } catch (err) {
            return new Response(err.stack, { status: 500 });
          }
        }
      }
    }

    if (!handlerFound) {
      // Default handler if no other handlers are called
      return new Response(JSON.stringify({ "content": "No route handler found for this path" }), {
        headers: { 'Content-Type': 'application/json', ...headers },
        status: 200
      });
    }
  }
}

const server = new Server();

const headers = {
  // 'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Methods': '*',
  // 'Access-Control-Allow-Headers': '*',
}

server.registerHandler({
  method: 'OPTIONS',
  async fn({ req, env }) {
    return new Response('', {
      status: 200,
      headers,
    }
    );
  },
});

server.registerHandler({
  regex: /^\/api\/ai\/((?:completions|chat|files|embeddings|images|audio|assistants|threads)(?:\/.*)?)/,
  async fn({ req, env, match }) {
    console.log('calling openai', env.OPENAI_API_KEY)
    const headers = {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
    };
    console.log('headers', headers)
    let url = 'https://api.openai.com/v1';
    console.log('url', url)
    return await proxyPipeApi({ req, match, env, headers, url })
  },
});

const defaultHeaders = [
  {
    "key": "Access-Control-Allow-Origin",
    "value": "*"
  },
  {
    "key": "Access-Control-Allow-Methods",
    "value": "*"
  },
  {
    "key": "Access-Control-Allow-Headers",
    "value": "*"
  },
  {
    "key": "Access-Control-Expose-Headers",
    "value": "*"
  },
  {
    "key": "Access-Control-Allow-Private-Network",
    "value": "true"
  },
  {
    "key": "Cross-Origin-Opener-Policy",
    "value": "same-origin"
  },
  {
    "key": "Cross-Origin-Embedder-Policy",
    "value": "require-corp"
  },
  {
    "key": "Cross-Origin-Resource-Policy",
    "value": "cross-origin"
  }
];

const proxyPipeApi = async ({ req, env, match, url, headers }) => {
  try {
    let sub = '';
    if (match)
      sub = match[1];

    const requestBody = await req.text();

    let o = {
      method: req.method,
      headers: headers || req.headers || {},
    };
    if (req.method !== 'GET') {
      o.headers['Content-Type'] = req.headers['content-type'] ?? 'application/json';
      o.body = requestBody;
      o.duplex = 'half';
    }

    const proxyRes = await fetch(`${url}/${sub}`, o);

    if (proxyRes.ok) {

      let { readable, writable } = new TransformStream();
      proxyRes.body.pipeTo(writable);
      return new Response(readable, {
        status: proxyRes.status,
        headers: {
          ...proxyRes.headers,
          ...headers,
        }
      });
    } else {
      const text = await proxyRes.text();
      return new Response(text, { status: proxyRes.status, headers });
    }
  } catch (err) {
    console.error('error proxying', err)
    return new Response(err.message, { status: 500, headers });
  }
};

export default {
  async fetch(request, env, ctx) {
    try {
      let res = await server.handleRequest(request, env);
      _setHeaders(res);  // Ensure _setHeaders modifies the response and returns it
      return res;
    } catch (error) {
      // Catch any errors that occur during handling and return a Response object
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
};

function _setHeaders(res) {
  for (const { key, value } of defaultHeaders) {
    res.headers.append(key, value);
  }
  return res;
}
import { createClient } from "@supabase/supabase-js";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { AgentRuntime, onMessage, onUpdate } from "@cojourney/agent";

class Route {
  path;
  handler;

  constructor({
    path = /^/,
    handler = async ({ req, env, match, userId, supabase }) => {},
  } = {}) {
    this.path = path;
    this.handler = handler;
  }
}
const routes: Route[] = [
  {
    path: /^\/api\/agents\/message/,
    async handler({ req, env, match, userId, supabase }) {
      if (req.method === "OPTIONS") {
        return;
      }

      // parse the body from the request
      const body = await req.json();

      const runtime = new AgentRuntime({
        debugMode: false,
        serverUrl: "https://api.openai.com/v1",
        supabase,
        token: env.OPENAI_API_KEY,
      });

      if (!body.agentId) {
        return new Response("agentId is required", { status: 400 });
      }

      if (!body.senderId) {
        body.senderId = userId;
      }

      if (!body.userIds) {
        body.userIds = [body.senderId, body.agentId];
      }

      try {
        await onMessage(body, runtime);
      } catch (error) {
        console.error("error", error);
        return new Response(error, { status: 500 });
      }

      return new Response("ok", { status: 200 });
    },
  },
  {
    path: /^\/api\/agents\/update/,
    async handler({ req, env, match, userId, supabase }) {
      if (req.method === "OPTIONS") {
        return;
      }

      // parse the body from the request
      const body = await req.json();

      const runtime = new AgentRuntime({
        debugMode: false,
        serverUrl: "https://api.openai.com/v1",
        supabase,
        token: env.OPENAI_API_KEY,
      });

      await onUpdate({ ...body, senderId: userId }, runtime);
    },
  },
  // {
  //   path: /^\/api\/agents\/start/,
  //   async handler({ req, env, match, userId, supabase }) {
  //     function getRelationship(arg0: {
  //       supabase: any;
  //       userA: any;
  //       userB: any;
  //     }) {
  //       throw new Error("Function not implemented.");
  //     }

  //     function getGoals(arg0: {
  //       supabase: import("@supabase/supabase-js").SupabaseClient<
  //         any,
  //         "public",
  //         any
  //       >;
  //       userIds: any[];
  //     }) {
  //       throw new Error("Function not implemented.");
  //     }

  //     function createGoal(arg0: {
  //       supabase: import("@supabase/supabase-js").SupabaseClient<
  //         any,
  //         "public",
  //         any
  //       >;
  //       userIds: any[];
  //       userId: any;
  //       goal: any;
  //     }) {
  //       throw new Error("Function not implemented.");
  //     }
  //     if (req.method === "OPTIONS") {
  //       return;
  //     }

  //     // parse the body from the request
  //     const body = await req.json();

  //     const runtime = new AgentRuntime({
  //       debugMode: false,
  //       serverUrl: "https://api.openai.com/v1",
  //       supabase,
  //       token: env.OPENAI_API_KEY,
  //     });

  //     // get the room_id where user_id is user_a and agent_id is user_b OR vice versa
  //     const data = await getRelationship({
  //       supabase,
  //       userA: userId,
  //       userB: agentId,
  //     });

  //     // TODO, just get the room id from channel
  //     const room_id = data?.room_id;

  //     const goals = await getGoals({
  //       supabase: runtime.supabase,
  //       userIds: [userId, agentId],
  //     });

  //     if (goals.length === 0) {
  //       await createGoal({
  //         supabase: runtime.supabase,
  //         userIds: [userId, agentId],
  //         userId: agentId,
  //         goal: defaultGoal,
  //       });
  //     }

  //     agentActions.forEach((action) => {
  //       // console.log('action', action)
  //       runtime.registerAction(action);
  //     });
  //   },
  // },
];

async function handleRequest(req, env) {
  const { pathname } = new URL(req.url);
  let handlerFound = false;

  if (req.method === "OPTIONS") {
    return new Response("", {
      status: 204,
      statusText: "OK",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  for (const { path, handler } of routes) {
    const matchUrl = pathname.match(path);

    if (matchUrl) {
      handlerFound = true;
      try {
        req.pathname = pathname;

        const supabase = createClient(
          env.SUPABASE_URL,
          env.SUPABASE_SERVICE_API_KEY,
          {
            auth: {
              persistSession: false,
            },
          },
        );

        const token =
          req.headers.get("Authorization") &&
          req.headers.get("Authorization").replace("Bearer ", "");

        const out = token && (await jwt.decode(token));

        const userId = out?.payload?.sub || out?.payload?.id || out?.id;

        if (!userId) {
          return new Response("Unauthorized", { status: 401 });
        }

        if (!userId) {
          console.log(
            "Warning, userId is null, which means the token was not decoded properly. This will need to be fixed for security reasons.",
          );
        }

        return await handler({
          req,
          env,
          match: matchUrl,
          userId,
          supabase,
        });
      } catch (err) {
        return new Response(err, { status: 500 });
      }
    }
  }

  if (!handlerFound) {
    // Default handler if no other routes are called
    return new Response(
      JSON.stringify({ content: "No handler found for this path" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  }
}

export default {
  async fetch(request, env, ctx) {
    try {
      let res = await handleRequest(request, env);
      return _setHeaders(res); // Ensure _setHeaders modifies the response and returns it
    } catch (error) {
      // Catch any errors that occur during handling and return a Response object
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};

function _setHeaders(res) {
  const defaultHeaders = [
    {
      key: "Access-Control-Allow-Origin",
      value: "*",
    },
    {
      key: "Access-Control-Allow-Methods",
      value: "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
    {
      key: "Access-Control-Allow-Headers",
      value: "*",
    },
    {
      key: "Access-Control-Expose-Headers",
      value: "*",
    },
    {
      key: "Access-Control-Allow-Private-Network",
      value: "true",
    },
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin",
    },
    {
      key: "Cross-Origin-Embedder-Policy",
      value: "require-corp",
    },
    {
      key: "Cross-Origin-Resource-Policy",
      value: "cross-origin",
    },
  ];

  for (const { key, value } of defaultHeaders) {
    // if res.headers doesnt contain, add
    if (!res.headers.has(key)) res.headers.append(key, value);
  }
  return res;
}

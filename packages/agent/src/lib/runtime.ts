import { SupabaseClient } from "@supabase/supabase-js";
import { MemoryManager } from "./memory";
import { defaultActions } from "./actions";
import { defaultEvaluators } from "./evaluators";
import axios from "axios";
// create a typescrip tinterface for opts
export type AgentRuntimeOpts = {
  recentMessageCount?: number;
  token: string;
  supabase: SupabaseClient;
  debugMode?: boolean;
  serverUrl?: string;
}

/**
 * @class AgentRuntime
  * @param {object} opts
  * @param {number} opts.recentMessageCount
  * @param {string} opts.token - JWT token
  * @param {object} opts.supabase - Supabase client
  * @param {boolean} opts.debugMode - If true, will log debug messages
 */
export class AgentRuntime {
  #recentMessageCount = 8;
  serverUrl = "http://localhost:7998";
  token: string | null;
  debugMode: boolean;
  supabase: SupabaseClient;
  messageManager: MemoryManager = new MemoryManager({
    runtime: this,
    schema: {
      tableName: "messages",
    },
  });;
  descriptionManager: MemoryManager = new MemoryManager({
    runtime: this,
    schema: {
      tableName: "descriptions",
    },
  });
  reflectionManager: MemoryManager = new MemoryManager({
    runtime: this,
    schema: {
      tableName: "reflections",
    },
  });
  messageHandlers: any[] = [];
  actionHandlers: any[] = []
  evaluationHandlers: any[] = []
  
  constructor(opts: AgentRuntimeOpts) {
    this.#recentMessageCount = opts.recentMessageCount || this.#recentMessageCount;
    this.debugMode = opts.debugMode || false;
    this.supabase = opts.supabase;
    this.serverUrl = opts.serverUrl || this.serverUrl;
    if(!this.serverUrl) {
      console.warn('No serverUrl provided, defaulting to localhost');
    }

    this.token = opts.token;
  }

  getRecentMessageCount() {
    return this.#recentMessageCount;
  }

  async sendMessage(message: any) {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  registerMessageHandler(handler: any) {
    this.messageHandlers.push(handler);
  }

  registerActionHandler(handler: any) {
    this.actionHandlers.push(handler);
  }

  getActions() {
    return [...new Set(this.actionHandlers)];
  }

  registerEvaluationHandler(handler: any) {
    this.evaluationHandlers.push(handler);
  }

  getEvaluationHandlers() {
    return [...new Set(this.evaluationHandlers)];
  }
  
  async completion({ context = "", stop = [], model = "gpt-3.5-turbo-0125", frequency_penalty = 0.0, presence_penalty = 0.0 }) {
    const requestOptions = {
      method: "post",
      url: `${this.serverUrl}/api/ai/chat/completions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      credentials: true,
      data: {
        stop,
        model,
        frequency_penalty,
        presence_penalty,
        messages: [
          {
            role: "user",
            content: context,
          },
        ],
      },
    };

    try {
      const response = await axios(requestOptions);

      // if response has an error
      if (response.status !== 200) {
        throw new Error("OpenAI API Error: " + response.status + ' ' + response.statusText);
      }

      const body = response.data;

      const content = body.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("No content in response");
      }
      return content;
    } catch (error) {
      throw new Error(error as any);
    }
  }
  
  async embed(input: string) {
    const embeddingModel = `text-embedding-3-small`;
    const requestOptions = {
      method: 'post',
      url: `${this.serverUrl}/api/ai/embeddings`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      credentials: true,
      data: {
        input,
        model: embeddingModel,
        dimensions: 768,
      },
    };
    try {
      const response = await axios(requestOptions);
      if (response.status !== 200) {
        throw new Error('OpenAI API Error: ' + response.status + ' ' + response.statusText);
      }

      const data = response.data;
      return data?.data?.[0].embedding;
    } catch (e) {
      throw e;
    }
  }
}

export default AgentRuntime;
import { SupabaseClient } from "@supabase/supabase-js";
import { MemoryManager } from "./memory";

// create a typescrip tinterface for opts
export interface AgentRuntimeOpts {
  recentMessageCount?: number;
  token?: string;
  supabase?: any;
  debugMode?: boolean;
  userId?: string;
  agentId?: string;
  serverUrl?: string;
}

/**
 * @class AgentRuntime
  * @param {object} opts
  * @param {number} opts.recentMessageCount
  * @param {string} opts.token - JWT token
  * @param {object} opts.supabase - Supabase client
  * @param {boolean} opts.debugMode - If true, will log debug messages
  * @param {string} opts.userId - User ID
  * @param {string} opts.agentId - Agent ID
 */
export class AgentRuntime {
  #recentMessageCount = 8;
  serverUrl = "http://localhost:7998";
  #state = {};
  token: string | null;
  debugMode: boolean;
  supabase: SupabaseClient;
  messageManager: MemoryManager;
  descriptionManager: MemoryManager;
  reflectionManager: MemoryManager;
  messageHandlers: any[];
  actionHandlers: any[];
  
  constructor(opts: AgentRuntimeOpts = {}) {
    this.#recentMessageCount = opts.recentMessageCount || this.#recentMessageCount;
    this.debugMode = opts.debugMode || false;
    this.supabase = opts.supabase;
    this.serverUrl = opts.serverUrl || this.serverUrl;
    if(!this.serverUrl) {
      console.warn('No serverUrl provided, defaulting to localhost');
    }

    this.token = opts.token ?? this.supabase.auth['headers']?.['Authorization']?.replace(/^Bearer\s+/i, '');
    
    this.messageManager = new MemoryManager({
      runtime: this,
      schema: {
        tableName: "messages",
      },
    });

    this.descriptionManager = new MemoryManager({
      runtime: this,
      schema: {
        tableName: "descriptions",
      },
    });

    this.reflectionManager = new MemoryManager({
      runtime: this,
      schema: {
        tableName: "reflections",
      },
    });

    this.messageHandlers = [];

    this.actionHandlers = [];
  }

  getRecentMessageCount() {
    return this.#recentMessageCount;
  }

  writeState(newState: {}) {
    this.#state = newState;
  }

  getState() {
    return this.#state;
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

  async completion({ context = "", stop = [], model = "gpt-3.5-turbo-0125", frequency_penalty = 0.0, presence_penalty = 0.0 }) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
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
      }),
    };
    console.log('calling completion, the requestOptions is', requestOptions)
    const response = await fetch(
      `${this.serverUrl}/api/ai/chat/completions`,
      requestOptions,
    );

    try {
      // check if error

      if (response.status !== 200) {
        // console.log(response.statusText);
        // console.log(response.status);
        console.log(await response.text());
        throw new Error(
          'OpenAI API Error: ' + response.status + ' ' + response.statusText
        );
      }

      const body = await response.json();


      const content = body.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("No content in response", body);
      }
      return content;
    } catch (error) {
      throw new Error(error as any);
    }
  }
  
  async embed(input: string) {
    const embeddingModel = `text-embedding-3-small`;
    // console.log('embed ai', {input});
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        // Authorization: "Bearer " + String(OPENAI_API_KEY),
      },
      body: JSON.stringify({
        input,
        model: embeddingModel,
        dimensions: 768,
      }),
    };
    try {
      const response = await fetch(
        `${this.serverUrl}/api/ai/embeddings`,
        requestOptions
      );
      if (response.status !== 200) {
        // console.log(response.statusText);
        // console.log(response.status);
        console.log(await response.text());
        throw new Error(
          'OpenAI API Error: ' + response.status + ' ' + response.statusText
        );
      }

      const data = await response.json();
      return data?.data?.[0].embedding;
    } catch (e) {
      console.warn('OpenAI API Error', e);
      // return "returning from error";
      throw e;
    }
  }
}

export default AgentRuntime;
/* eslint-disable import/first */
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

import readline from "readline";
import chalk from "chalk";

import { AgentRuntime, initialize, onMessage, getGoals, createGoal, agentActions, constants } from "@cojourney/agent";

const supabase = createClient(
  constants.supabaseUrl || "",
  constants.supabaseAnonKey || "",
);

// check for --debug flag in 'node example/terminal --debug'
const DEBUG = process.argv.includes("--debug");
const SERVER_URL = process.env.SERVER_URL || "http://localhost:7998";

// YOU WILL NEED TO REPLACE THIS
const userName = "User";
const userUUID = "3e71c83f-4252-42dc-8983-61d58095e821";
const agentUUID = "00000000-0000-0000-0000-000000000000";
const agentName = "CJ";
const updateInterval = 10000;

const defaultGoal = {
  name: "First Time User Experience",
  description: "CJ wants to get to know the user.",
  status: "IN_PROGRESS", // other types are "DONE" and "FAILED"
  objectives: [
    {
      description: "Determine if it is the user's first time",
      condition: "User indicates that it is their first time or that they are new",
      completed: false,
    },
    {
      description: "Get the user to enable their microphone by pressing the microphone button",
      condition: "User calls microphone_enabled action",
      completed: false,
    },
    {
      description: "Learn details about the user's interests and personality",
      condition: "User tells CJ a few key facts about about their interests and personality",
      completed: false,
    },
    {
      description: "CJ updates the user's profile with the information she has learned",
      condition: "CJ calls update_profile action",
      completed: false,
    },
    {
      description: "Connect the user to someone from the rolodex who they might like to chat with",
      condition: "CJ calls INTRODUCE action",
      completed: false,
    },
  ],
};

// runtime
async function start() {
  const runtime = new AgentRuntime({
    debugMode: DEBUG,
    userId: userUUID,
    agentId: agentUUID,
    serverUrl: SERVER_URL,
    supabase,
  });

  // get the room_id where user_id is user_a and agent_id is user_b OR vice versa
  const { data, error } = await supabase.from("relationships").select("*")
    .or(`user_a.eq.${userUUID},user_b.eq.${agentUUID},user_a.eq.${agentUUID},user_b.eq.${userUUID}`)
    .single();

  if (error) {
    return console.error(new Error(JSON.stringify(error)));
  }

  const room_id = data?.room_id;

  const goals = await getGoals({
    supabase: runtime.supabase,
    userIds: [userUUID, agentUUID],
  });

  if (goals.length === 0) {
    console.log("creating goal");
    await createGoal({
      supabase: runtime.supabase,
      userIds: [userUUID, agentUUID],
      userId: agentUUID,
      goal: defaultGoal,
    });
  }

  runtime.registerMessageHandler(async ({ agentName, content, action }: any) => {
    console.log(chalk.green(`${agentName}: ${content}${action ? ` (${action})` : ""}`));
    resetLoop();
  });

  agentActions.forEach((action) => {
    // console.log('action', action)
    runtime.registerActionHandler(action);
  });

  if (runtime.debugMode) {
    console.log(chalk.yellow(`Actions registered: ${runtime.getActions().map((a) => a.name).join(", ")}`));
  }

  // Create readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "",
  });

  const { start: startLoop, reset: resetLoop, registerHandler } = initialize();

  // Function to simulate agent's response
  const respond = async (content: any) => {
    resetLoop(); // reset the update interval early to prevent async update race
    await onMessage({
      name: userName,
      content,
      senderId: userUUID,
      agentId: agentUUID,
      eventType: "message",
      userIds: [userUUID, agentUUID],
      agentName,
      data,
      room_id,
    }, runtime);
    resetLoop(); // reset again

    rl.prompt(true);
  };

  // check for keypresses
  // Ensure the stdin is in the correct mode to capture keypresses
  // process.stdin.setRawMode(true);
  process.stdin.resume();

  // Emit keypress events for the stdin stream
  readline.emitKeypressEvents(process.stdin);

  process.stdin.on("keypress", () => {
    resetLoop();
  });

  rl.on("line", (input) => {
    respond(input);
    resetLoop();
    rl.prompt(true);
  }).on("SIGINT", () => {
    rl.close();
  });

  // Initial prompt
  rl.prompt(true);

  registerHandler(async () => {
    resetLoop();
    await onMessage(
      {
        name: userName,
        senderId: userUUID,
        agentId: agentUUID,
        eventType: "update",
        userIds: [userUUID, agentUUID],
        agentName,
        data,
        room_id,
      },
      runtime,
    );
    // Save the current line and cursor position
    const currentLine = rl.line;
    const cursorPosition = rl.cursor;

    // Clear the entire line
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);

    // Restore the user's input
    process.stdout.write(currentLine);
    readline.cursorTo(process.stdout, cursorPosition);
    resetLoop();
  });

  startLoop(updateInterval);

  // send initial message
  await onMessage(
    {
      name: userName,
      senderId: userUUID,
      agentId: agentUUID,
      eventType: "start",
      userIds: [userUUID, agentUUID],
      agentName,
      data,
      room_id,
    },
    runtime,
  );
  resetLoop();
}

start();

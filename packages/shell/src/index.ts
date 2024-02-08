// Import necessary modules
import dotenv from "dotenv";
import path from 'path';
import { homedir } from 'os';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from "@supabase/supabase-js";
import inquirer from 'inquirer';
import chalk from "chalk";
import readline from "readline";
import { AgentRuntime, initialize, onMessage, getGoals, createGoal, agentActions } from "@cojourney/agent/src/index";
import { defaultGoal } from "./defaultGoal";

// check for --debug flag in 'node example/terminal --debug'
const DEBUG = process.argv.includes("--debug");
const SERVER_URL = process.env.SERVER_URL || "http://localhost:7998";

// YOU WILL NEED TO REPLACE THIS
const userName = "User";
const userUUID = "3e71c83f-4252-42dc-8983-61d58095e821";
const agentUUID = "00000000-0000-0000-0000-000000000000";
const agentName = "CJ";
const updateInterval = 10000;

// Setup environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define user home directory and config file path
const userHomeDir = homedir();
const configFile = path.join(userHomeDir, '.cjrc');

const getSupabase = (access_token?: string) => {
    const supabaseUrl = process.env.SUPABASE_URL as string
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string
    let options = {}
  
    if (access_token) {
      (options as any).global = {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    }
  
    const supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      options
    )
    return supabase
  }

export const getMe = async (session: { access_token: string | undefined }) => {
    const { data: { user }, error} = await getSupabase(session?.access_token).auth.getUser()
    if (error) {
        await getSupabase(session?.access_token).auth.signOut();
        console.log('*** error', error)
      return null;
    } else {
      return user;
    }
  }

// Main application logic
// Main application logic
async function startApplication() {
    console.log(chalk.green('Starting application...'));

    // Assuming session information is stored in the .cjrc file
    const userData = JSON.parse(fs.readFileSync(configFile).toString());
    const session = userData?.session;
    const supabase = getSupabase(session?.access_token);
    let user = null as any;
    if (session) {
        // Get user information or perform any other session-related initialization here
        console.log(chalk.blue('Fetching user information...'));
        // Placeholder for actual function to fetch user details
        user = await getMe(session);
    }

    const runtime = new AgentRuntime({
        debugMode: DEBUG,
        userId: userUUID,
        agentId: agentUUID,
        serverUrl: SERVER_URL,
        supabase,
        token: user?.access_token,
    });

    const agentInitObject = initialize();
    const { reset: resetLoop } = agentInitObject;

    // Fetch room_id and initial goals setup
    const room_id = await setupRoomAndGoals(supabase, runtime);

    // Register message handler
    runtime.registerMessageHandler(async ({ agentName, content, action }: any) => {
        console.log(chalk.green(`${agentName}: ${content}${action ? ` (${action})` : ""}`));
        resetLoop();
    });

    // Register action handlers
    agentActions.forEach((action) => {
        runtime.registerActionHandler(action);
    });

    if (runtime.debugMode) {
        console.log(chalk.yellow(`Actions registered: ${runtime.getActions().map((a) => a.name).join(", ")}`));
    }

    // Create readline interface and message loop
    setupReadlineAndMessageLoop(runtime, room_id, agentInitObject);
}

// Function to fetch room_id and initial goals
async function setupRoomAndGoals(supabase: any, runtime: AgentRuntime) {
    
    const { data, error } = await supabase.from("relationships").select("*")
        .or(`user_a.eq.${userUUID},user_b.eq.${agentUUID},user_a.eq.${agentUUID},user_b.eq.${userUUID}`)
        .single();

    if (error) {
        console.error(chalk.red(`Error fetching room_id: ${JSON.stringify(error)}`));
        throw error; // or handle this error appropriately
    }

    const room_id = data?.room_id;

    const goals = await getGoals({
        supabase: runtime.supabase,
        userIds: [userUUID, agentUUID],
    });

    if (goals.length === 0) {
        console.log(chalk.blue("Creating initial goal..."));
        await createGoal({
            supabase: runtime.supabase,
            userIds: [userUUID, agentUUID],
            userId: agentUUID,
            goal: defaultGoal,
        });
    }

    return room_id;
}

// Function to setup readline interface and message loop
function setupReadlineAndMessageLoop(runtime: AgentRuntime, room_id: any, agentInitObject: { start: any; reset: any; registerHandler: any; }) {
    const { start: startLoop, reset: resetLoop, registerHandler } = agentInitObject;
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "",
    });

    // Function to simulate agent's response
    const respond = async (content: string) => {
        resetLoop(); // reset the update interval early to prevent async update race
        await onMessage({
            name: userName,
            content,
            senderId: userUUID,
            agentId: agentUUID,
            eventType: "message",
            userIds: [userUUID, agentUUID],
            agentName,
            data: {}, // Placeholder, replace with actual data if needed
            room_id,
        }, runtime);
        resetLoop(); // reset again

        rl.prompt(true);
    };

    process.stdin.resume();
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
                data: {}, // Placeholder, replace with actual data if needed
                room_id,
            },
            runtime,
        );
        // Clear and restore the current line if needed
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        resetLoop();
    });

    startLoop(updateInterval);
}

// Function to handle user login or signup
async function handleUserInteraction() {
    let user;

    if(fs.existsSync(configFile)){
        // try to read the file as json
        const userData = JSON.parse(fs.readFileSync(configFile).toString());
        const session = userData?.session;
        user = await getMe(session);
    }
    
    if (!user) {
        console.log(chalk.yellow('Please log in or sign up.'));
        const { action } = await inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: 'Do you want to login or signup?',
            choices: ['Login', 'Signup']
        }]);

        if (action === 'Login') {
            await loginUser();
        } else if (action === 'Signup') {
            await signupUser();
        }
    } else {
        console.log(chalk.green('Configuration file found. You are already logged in.'));
        await startApplication(); // Start the application if already logged in

        
        
    }
}

// Function to log in the user
async function loginUser() {
    const credentials = await inquirer.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Enter your email:',
            validate: (input: string | string[]) => input.includes('@') ? true : 'Please enter a valid email address.'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter your password:',
            mask: '*'
        }
    ]);

    const supabase = getSupabase();

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) throw error;

        fs.writeFileSync(configFile, JSON.stringify({ session: data.session }));
        console.log(chalk.green('Login successful! Configuration saved.'));
        await startApplication(); // Start the application after login
    } catch (error: any) {
        console.error(chalk.red(`Login failed: ${error.message}`));
    }
}

// Function to sign up the user
async function signupUser() {
    const credentials = await inquirer.prompt([
        {
            type: 'input',
            name: 'email',
            message: 'Enter your email:',
            validate: (input: string | string[]) => input.includes('@') ? true : 'Please enter a valid email address.'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter your password:',
            mask: '*'
        }
    ]);

    const supabase = getSupabase();

    try {
        const { data, error } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) throw error;

        fs.writeFileSync(configFile, JSON.stringify({ session: data.session }));
        console.log(chalk.green('Signup successful! Configuration saved.'));
        await startApplication(); // Start the application after signup
    } catch (error: any) {
        console.error(chalk.red(`Signup failed: ${error.message}`));
    }
}

handleUserInteraction();
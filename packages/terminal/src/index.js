#!/usr/bin/env node
import { homedir } from 'os'
import * as fs from 'fs';
import { deleteMessages, getDetailedMessages, getMessage, getMessages, replyToMessage, sendMessage } from './Controllers/MessageController.js';
import { connectToChannel, createChannel, getChannels, updateChannel } from './Controllers/ChannelController.js';
import { register, login, logout, getMe, wave } from './Controllers/UserController.js';
import { Command } from 'commander';

const userHomeDir = homedir()
const args = process.argv
const [one, two, ...cmds] = args
const program = new Command();


fs.readFile(userHomeDir + '/.boxrc.json', 'utf8', async function(err, data) {
  let currentChannel = "global"
  let session = undefined

  if (data) {
    let sessionData = JSON.parse(data)
    currentChannel = sessionData?.channel;
    session = sessionData?.session;
  }
  
  program
    .command('open')
    .argument('<box-channel>', 'open live chat for specified box channel')
    .action(async (targetChannel) => {
      await connectToChannel(targetChannel, currentChannel, session)
    });
    
  program
    .command('me')
    .description('returns your authenticated user details')
    .action(async () => {
      await getMe(session)
    });
  
  program
    .command('pwd')
    .description('prints the current box name')
    .action(async () => {
      console.log("current box: " + currentChannel)
    });
  
  program
    .command('logout')
    .description('logs out of box and deletes current session data')
    .action(async (targetChannel) => {
      await logout(currentChannel)
    });
    
  program
    .command('login')
    .argument('<email>', 'email associated with a registered box account')
    .argument('<password>', 'password associated with registered account')
    .action(async (email, password) => {
      await login(email, password, {channel: currentChannel})
    });
  
  program
    .command('ls')
    .description('list ids in current box')
    .option('-l', 'list ids, sender box and timestamp')
    .option('-c', 'list all box channels')
    .action(async ({l, c}) => {
      if (l) {
        await getDetailedMessages(currentChannel, session)
      } else if (c) {
        await getChannels();
      } else {
        await getMessages(currentChannel, session)
      }
    });
    
    program
      .command('checkout')
      .description('checkout into a box channel')
      .argument('<box-channel>', 'box channel you want to checkout into')
      .option('-b', 'create and checkout into a new box channel')
      .action(async (targetChannel, {b}) => {
        if(b) {
         await createChannel(targetChannel, session)
        }
        await updateChannel(targetChannel, session)
      });

    program
      .command('reply')
      .description('reply to a message')
      .argument('<message-id>', 'box id you want to respond to')
      .argument('<message-string>', 'a message you want to send as a reply')
      .action(async (messageId, replyMessage) => {
        await replyToMessage(messageId, replyMessage, currentChannel, session)
      });

    program
      .command('register')
      .description('register an account')
      .argument('<email>', 'email you want to associate with your box account')
      .argument('<password>', 'password for your account')
      .action(async (email, password) => {
        await register(email, password, currentChannel)
      });

    program
      .command('cat')
      .description('print the contents of a message given a message id')
      .argument('<message-id>', 'id of message you want to view')
      .action(async (messageId) => {
        await getMessage(messageId, currentChannel, session)
      });
      
    program
      .command('rm')
      .description('delete a message given comma seperated message ids')
      .argument('<message-id>', 'one or more comma seperated ids of messages you want to delete')
      .action(async (messageIds) => {
        await deleteMessages(messageIds, session)
      });

    program
      .command('ship')
      .description('send a message to a box')
      .argument('<box-channel>', 'box channel you want to send a message to')
      .argument('<message-string>', 'a message you want to send to the specified box channel')
      .action(async (targetChannel, message) => {
        await sendMessage(targetChannel, currentChannel, message, session)
      });
      
    program
      .command('wave')
      .description('open a broadcast signaling you are using the box')
      .action(async () => {
        await wave(session)
      })

  await program.parseAsync(process.argv);

});
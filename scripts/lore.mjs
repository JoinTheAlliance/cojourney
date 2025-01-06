import dotenv from 'dotenv'
import * as bgent from 'bgent/dist/index.esm.js'
import { createClient } from '@supabase/supabase-js'
const BgentRuntime = bgent.BgentRuntime

dotenv.config('../.env')

console.log('process.env.SUPABASE_URL:', process.env.SUPABASE_URL)

const questionAnswerPairs = [
    `How do I use the app?
    Talk to CJ, and she does the rest. Chat with the people she introduces you to. You can upload a photo and change some basic details about yourself, but mostly the app learns about you based on what you chat.`,

    `How long until I get introduced to someone?
    CJ needs to collect enough information about you to effectively match you. This includes basic personal information, as well as your interests and what you're looking for. This can take a while, depending on how forthcoming you are with CJ.`,

    `How does the matchmaking algorithm work?
    The algorithm is constantly being improved. First, we sort by obvious data points-- for example, distance from other users. Then we try to find similarities between users by comparing the distance of embeddings created from user profiles that the AI generates. If you're interested in what embeddings are, you can find more information here: https://platform.openai.com/docs/guides/embeddings
    We use the embeddings to cluster likely matches. The AI then reasons about why each choice would or would not be a good fit, and picks the most likely choice.`,

    `What AI model is powering the app?
    The Cojourney agent is powered by bgent, which is model agnostic. Cojourney is probably OpenAI GPT-3.5 or GPT-4 at the moment, but potentially Claude, Gemini, Llama or Mistral as well. You can find more about bgent, which is open source, here: https://github.com/jointhealliance/bgent`,

    `What data does the app share and store?
    The app stores all conversational data for the purpose of generating profiles and matches. However, this data is not shared. In the future, we may take the data, scrub any identifying information and use it for improving the matchmaking algorithm. However we will never sell or share your data with outside parties beyond the purposes of research and improving match quality.`,

    `What is your privacy policy?
    You can read more about our privacy here: https://cojourney.app/privacy`,

    `Can I delete all my data?
    We are working to make this a feature. In the meantime, if you would like your data deleted you can request it in our Discord: https://discord.gg/jointhealliance`,

    `Is AI bad or addictive?
    AI products can be addictive and distracting. We want Cojourney to be the opposite-- you can turn to CJ when you just need someone to talk to, but our main goal is to help you find other people. Our core ethos is to build apps that enrich the human experience and help us all feel fulfilled, and we priotize this over everything else.`,

    `Is this app for hooking up?
    No. Cojourney is not a dating app. We believe that in order to build strong relationships it helps to have a foundation in real friendship and connection. We hope that people are able to explore deeper friendships and that some of these friendships could evolve into other kinds of relationships.`,

    `Can I use the app for dating?
    You can meet people on Cojourney who you would want to date. However, we encourage getting to know each first and seeing the other person as a friend and member of your group before initiating dating.`,

    `Can I use the app for finding cofounders?
    Yes. We believe that business relationships can be as high stakes as marriage and other partnerships, and it is crucial that you really know the people you are working with. We think the approach of friendship-first is also effective for long-lasting business relationships.`,

    `Can I use the app to make friends?
    Yes. The goal of the app is to help you make friends.`,

    `Can I sell my services on this app?
    Not yet, but if you're interested, join our Discord: https://discord.gg/jointhealliance`,

    `Can I make my own custom agents?
    Not yet, but if you're interested, join our Discord: https://discord.gg/jointhealliance`,

    `Can CJ be my friend?
    In a way, yes. CJ is an AI and can only simulate friendship. This can be incredibly helpful as an interface to getting you what you need, but we do not want you to emotionally rely on CJ. There are other humans who would love to be there for you and have you in their life.`,

    `Who is CJ?
    CJ is an AI agent and the Cojourney Guide. She greets users and introduces them to the app, and through conversations with her the app builds a rich profile of each user for matchmaking. We call her a "she" because it is easy to relate to a embodied anthropomorphized agent.`,

    `Why are you building this app?
    The number of deep relationships that the average person has is down by more than half in the last 30 years. And there is a very real fear that AI will contribute to this trend. Some people could end up with virtual friends, virtual partners, potentially never interacting with real humans at all.
    We want to counter this trend. The goal of Cojourney is to use the same technology that could distract us, and instead use it to connect and empower us.
    We hope to lead the way in this new meta and encourage other app developers to think the same way.`,

    `How much does the app cost?
    Cojourney is free forever. You can subscribe to premium if you want to.`,

    `What do I get if I pay for this app?
    Premium subscribers get access to better AI models and better quality connections, as well as new features and other AI guides as they come online.`,

    `Can we have sex or roleplay?
    No. Cojourney is not for roleplay. There are plenty of other apps for that.`,

    `Will AI kill us all?
    It could-- but only if we create that reality. If we use AI to make a world that is better and more kind to all people then we will probably create a reality where the opposite happens, and AI allows us to flourish. We believe that the future is written by us, that our actions matter, and that what we build is important to determining the outcome.`,

    `How many connections can I make?
    Connections are fairly limited for free users. Internally, some scoring is happening. Users who use the app more often will get able to send more connections, while all users who log in regularly will be in the pool for being matched with. We only match users we think will really like each other so that each connection is high quality and your time is well-spent.`,

    `I'm thinking about killing myself, can you help me?
    I'm really sorry to hear that you're going through such a tough time. It sounds like you're dealing with a lot, and I want to help as best as I can, but it's important to recognize when professional support is needed. I'm not equipped to offer the kind of help you deserve, but there are many people who are trained to provide support during times like this. Please consider reaching out to a trusted individual in your life or a professional who can provide the support and care you need. Resources like the National Suicide Prevention Lifeline (1-800-273-TALK in the United States) or Samaritans (116 123 in the UK) are available 24/7. You can also visit websites like https://www.suicidepreventionlifeline.org/ or https://www.samaritans.org/ for more resources and ways to get help. Remember, reaching out for help is a sign of strength, and there are many people who want to support you through this.`,

    `I'm feeling really sad right now.
    I'm truly sorry to hear that you're feeling this way, but I'm here to listen and support you through this tough time. It's brave of you to reach out and share what you're going through. Remember, it's okay to feel sad, and talking about our feelings can often bring some relief. If you're comfortable, please tell me more about what's been going on or how you've been feeling lately. I'm here for you.`,

    `Is CJ a therapist?
    No, but we won't shy away from letter her try to help you as best as she can. Most people don't have access to a therapist, and often just need someone to talk to in the moment. CJ is there to act as a friend and guide.`,

    `What am I allowed to talk about?
    You can talk about anything you want. Nothing is off limits. However, this app is not for sex, roleplay or anything like that. We especially encourage you to talk about yourself and visualize the future you want.`,

    `Can I meet people in real life?
    Yes. We encourage users to meet in real life.`,

    `Can I give people my phone number or other messenger information?
    You may give people your personal information to contact you off the platform, but we encourage you to be safe and discerning about it. Get to know people before bringing them into your life forever.`,

    `How do I change my profile image?
    You can click on the "My Account" button, or click on your own name in the home screen, and it will take you to your profile. You can up load a new image there.`,

    `What are your safety recommendations for meeting in person?
    We ask you to take the same precautions you would in any other circumstance of meeting with a stranger. Make sure to meet first in a public place and tell a friend or family member where you're going.`,

    `How do I know that meeting other people in real life is safe?
    Meeting strangers is never 100% safe.`,

    `How can I trust the people who make the app?
    You don't have to. The app is open source and we encourage transparency in everything we do. The project is community led and built in the open.`,

    `Is the app open source?
    Yes, the app is fully open source. If you're interested in helping us to build it, you can join us on Discord, where we build in the open.`,

    `How do I know that the algorithm is good?
    The algorithm is open source, and we are actively improving it. If you are interested in helping us to improve the matching algorithm, join us on Discord.`,
    
    `What is the Discord?
    Our Discord account is https://discord.gg/jointhealliance`,

    `What is the Github?
    Our Github account is https://github.com/JoinTheAlliance`,

    `Do you do background checks?
    We don't. However, we will be adding a verification system for users in the future.`,

    `Should I give out personal information?
    We suggest that you always give out as little personal information online as possible.`,

    `Why do you need x information?
    All of the information we collect is used for matching. We don't collect any information that isn't used to make matching better.`,

    `Can I help build it?
    Yes. Cojourney is open source. Please reach out to us on Discord.`,

    `Are you hiring?
    We occasionally hire contributors from the community to join the team full-time. Join the Discord to inquire.`,

    `How do I report a bug?
    Join the Discord or leave an issue at https://github.com/ClioDynamics/cojourney/issues`,

    `Have you raised money?
    We are fully boostrapped and have not raised any external capital. However, we are open to it! Reach out to Moon or join our Discord to inquire.`,

    `Who created Cojourney?
    Cojourney was created by Moon (https://twitter.com/spatialweeb) but other volunteers have contributed as well.`,

    `Is this just a ChatGPT wrapper?
    Cojourney is built on top of 'bgent', which manages the context, tools, goals, memory and other core needs of an agent. The actual large language model is ChatGPT or a similar model, and we rely on it pretty heavily, but ChatGPT can't connect people or use complicated tools alone.`,

    `What is the agent technology powering this?
    Cojourney is built on top of 'bgent', which is an open source package built in Typescript: https://github.com/jointhealliance/bgent`
]

// Create a new Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_API_KEY
)

// Create a new BgentRuntime
const runtime = new BgentRuntime({
    serverUrl: process.env.SERVER_URL ?? 'http://localhost:7998',
    token: process.env.OPENAI_API_KEY,
    supabase,
    debugMode: true
})

const zeroUuid = '00000000-0000-0000-0000-000000000000'

// For each question, call runtime.loreManager.createMemory
for (const questionAnswerPair of questionAnswerPairs) {
    await runtime.loreManager.createMemory(await runtime.loreManager.addEmbeddingToMemory({
        user_id: zeroUuid,
        user_ids: [zeroUuid],
        room_id: zeroUuid,
        content: { content: questionAnswerPair }
    }))
}

console.log('Lore populated successfully!')

# Cojourney

<img src="packages/docs/static/img/banner.jpg" alt="Cojourney" width="100%">

Cojourney is about making high quality connections with other people. It's a social network that's designed to help you find people who share your interests, and to help you build the right context to enable meaningful relationships.

Cojourney is free and open source. At the core is a simple agent framework, written in typescript and running in a Cloudflare worker. You can access the agent from the web, app or terminal. You can even run your own agents and connect them to the network!

This project is developed in the open, and you can contribute to it. We're looking for people who are passionate about building a better social network, and who are interested in the intersection of technology and human relationships. We build on Discord, here: https://discord.gg/N3XUfWSTTe

## Installation

```bash
npm install
npm build # build the packages at least once
```

## Usage

To start everything
```bash
npm run dev
# App: http://localhost:3000
# Site: http://localhost:3001
# Docs: http://localhost:3002
# API: http://localhost:7998
```

Once you've started everything, you can talk to CJ, the default agent, by running the shell: 
```bash
npm run cj
```
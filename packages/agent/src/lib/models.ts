export const aiModelModes = [
  "openai:gpt-3.5-turbo-1106",
  "openai:gpt-4",
  "openai:gpt-4-1106-preview",

  "together:mistralai/Mixtral-8x7B-Instruct-v0.1",
  "together:mistralai/Mistral-7B-Instruct-v0.1",
  "together:mistralai/Mistral-7B-Instruct-v0.2",
  // 'together:mistralai/NousResearch/Nous-Hermes-llama-2-7b',
  "together:NousResearch/Nous-Hermes-Llama2-13b",
  "together:Open-Orca/Mistral-7B-OpenOrca",
  "together:teknium/OpenHermes-2-Mistral-7B",
  "together:teknium/OpenHermes-2p5-Mistral-7B",
  "NousResearch/Nous-Hermes-2-Yi-34B",
  "together:Gryphe/MythoMax-L2-13b",
];

/** Default model for completion */
export const defaultModel = aiModelModes[0];

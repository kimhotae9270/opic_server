require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

async function callChatGPT(prompt,temNum) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      "temperature": temNum
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling ChatGPT API: ", error);
    return null;
  }
}

module.exports = { callChatGPT };

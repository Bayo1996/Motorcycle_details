import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      }
    });
    return;
  }

  const model = req.body.model || '';
  if (model.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid model",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(model),
      temperature: 0.2,
      max_tokens: 40
    });
    res.status(200).json({ result: completion.data.choices[0].text });
    console.log(completion)
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(model) {
  return `Get me all the characteristics of the motorcycle model ${model} in ordered bullets`;
}

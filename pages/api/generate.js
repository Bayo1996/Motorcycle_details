import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function generatePrompt(model) {
  return `Get me the characteristics of the motorcycle model ${model}. Use this JSON
  {
    "engine": "string: engine cilinder"
    "manufacturer": "string: motorcycle manufacturer"
    "fuel": "string: fuel type used (premium, normal)"
    "power": "string: max power of the motorcycle"
    "max_Speed": "string. max speed"
  }`;
}

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
      temperature: 0.3,
      max_tokens: 500
    });
    res.status(200).json({ result: completion.data.choices[0].text });
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


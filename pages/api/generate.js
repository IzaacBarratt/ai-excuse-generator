import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI key not configured dummy, read the README.md!"
      }
    });
    return;
  }

  const {
    planToCancel,
    justification,
    excuse,
    blame
  } = req.body

  if (!planToCancel) {
    res.status(400).json({
      error: {
        message: "Missing plan to cancel"
      }
    })
  }
  if (!justification) {
    res.status(400).json({
      error: {
        message: "Missing justification"
      }
    })
  }
  if (!excuse) {
    res.status(400).json({
      error: {
        message: "Missing excuse"
      }
    })
  }
  if (!blame) {
    res.status(400).json({
      error: {
        message: "Missing blame"
      }
    })
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-curie-001",
      prompt: generateArugment(req.body),
      temperature: 0.69,
      max_tokens: 175,
      frequency_penalty: 0.5,
      best_of: 4
    });

    console.log(JSON.stringify(completion.data))

    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}


function generateArugment(inputs) {
  const {
    planToCancel,
    justification,
    excuse,
    blame
  } = inputs
  
  const basePrompt = `
    My friend is bad friend because they ${blame}.
    I'm justified not attending their ${planToCancel} because they ${blame}.
    Write an ${justification} message to my friend explaining I won't be able to attend their ${planToCancel} because ${excuse}, but blame them for ${blame}.

    Message:
  `.trim()

  console.group(basePrompt)
  console.groupEnd()
  return basePrompt;
}
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { z } from 'zod';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: '...',
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter.chat('mistralai/devstral-2512:free'),
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: 'show the weather in a given city to the user',
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }: { city: string }) => {
          console.log(`Checking weather for ${city}`);
          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      },
      // client-side tool that starts user interaction:
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        inputSchema: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description:
          'Get the user location. Always ask for confirmation before using this tool.',
        inputSchema: z.object({}),
      },
    },
  });

  const response = result.toUIMessageStreamResponse();
  const body = response.body!;
  const [debugStream, clientStream] = body.tee();

  // Debug consumer
  (async () => {
    const reader = debugStream.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      console.log(decoder.decode(value));
    }
  })();

  // Return untouched stream
  return new Response(clientStream, response);
}

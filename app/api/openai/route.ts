import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server"

const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

const getPrompt = ({ departure_date, return_date, starting_point, arrival_point, travel_type, ecological, mass_tourism, activities, steps }) => `
  Ignore all the previous information. I want to plan a trip ${travel_type === 'alone' ? 'alone' : `as a ${travel_type}`}. You will need to generate a presentation of my future trip. Organize this presentation as follows:

  - a short introduction
  - a table including all the useful and logistical information needed to travel to the concerned countries (currency, safety, capital, religion, language, etc.). Render this table in HTML
  - a detailed list of the trip you will have prepared according to the duration I will give you, from the starting point to the destination. Make a detailed list with, each time, the name of the place to go, how to get there, what activities to do. Add the coordinates (latitude, longitude) for each stage. Always separate the coordinates with a double !!. For example !!48.1469, 11.2659!! You can improvise on the length of stay in each city/country. Plan only one day at the starting point and one day at the destination.
  - a conclusion with advice and an opening to a possible continuation of the journey.

  Keep in mind that:

  ${mass_tourism ? '- it is very important for me to avoid mass tourism and not to be on a path filled with tourists.' : ''}
  - The journey is the trip. I don't want to stay for more than a few weeks in the same place or at the destination. I want to travel.
  ${ecological ? '- I am also sensitive to ecological and health issues. Air hotel travel should be considered whenever possible.' : ''}
  - The trip must also be safe. Do not take me through places where my safety is not guaranteed.

  I am open to travel by bus, train, car, van, bicycle, airplane.

  My trip takes place between ${departure_date} and ${return_date}.

  I will depart from ${starting_point}, to arrive in ${arrival_point}.

  ${activities?.length ? `The activities I wish to do are: ${activities}.` : ''}

  ${steps?.length ? `The possible intermediate steps of the trip are: ${steps}. Add steps in other countries on the same route. Make a logical route.` : ''}
`

export async function POST(req, res) {
    try {
        const body = await req.json()
        const { departure_date, return_date, starting_point, arrival_point, travel_type } = body;
        if (!departure_date || !return_date || !starting_point || !arrival_point || !travel_type) {
            return NextResponse.json({ error: 'Missing parameters' })
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: 'Wrong OpenAI configuration' })
        }

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const question = getPrompt(body);
        const chatCompletion = await openai.createChatCompletion({
            model,
            messages: [
                {
                    role: 'system',
                    content: 'Hello, I am a ai travel agent. I will help you to prepare for your trip.'
                },
                { role: 'user', content: question },
            ],
        });
        return NextResponse.json(chatCompletion?.data?.choices?.[0]?.message)
    } catch (err) {
        return NextResponse.json({ error: err.message })
    }
};
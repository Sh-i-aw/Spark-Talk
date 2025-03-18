import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
    maxRetries: 0
})

export async function generateTagsForTalk () {

    const allTags: string[] = [
        "AI", "Machine Learning", "Automation", "LLM", "Laravel",
        "PHP", "NodeJS", "React", "Vue", "JavaScript", "Frontend",
        "Backend", "UI-UX", "Design", "Testing", "Debugging"
    ];
    const title: string = "Quick tips and tricks for Chrome DevTools";
    const description: string = "Chrome DevTools is a pretty useful tool. I just want to share some small tips and tricks I find interesting."
    const prompt = `
        Given the following talk details:

        Title: ${title}
        Description: ${description}

        And the available tags: ${JSON.stringify(allTags)}

        Suggest a JSON array of tags that best fit this talk. Feel free to propose new tags if they seem appropriate.
        `;

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{role:"user", content:"Hello"}]
        })
        const content = completion.choices[0].message?.content;
        console.log(content);
    } catch (err:any) {
        alert(`OpenAI error ${err.response?.status}: ${err.response?.data?.error?.message}`);
    }


}
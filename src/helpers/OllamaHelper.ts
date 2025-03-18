import {collection, getDocs, orderBy, query} from "firebase/firestore";
import {newDb} from "@/firebase.ts";

export async function generateTagsWithOllama(tags: string[], title:string, description:string) {

    const prompt = `
        Given the following talk details:

        Title: ${title}
        Description: ${description}

        And the available tags: ${JSON.stringify(tags)}

        Suggest a JSON array of tags that best fit this talk. Feel free to propose new tags if they seem appropriate. 
        Tags should be general, e.g. Tooling 
        The response should only be a JSON array, no explanation needed.`;

    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3.2',
            prompt: prompt,
            stream: false
        })
    });
    if (!response.ok) {
        console.log(response.status)
    }
    const resolvedResponse = await response.json();
    return resolvedResponse.response;
}


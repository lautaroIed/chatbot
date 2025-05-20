import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

async function getRelevantContent(query: string, numResults: number = 5) {
  const queryEmbedding = await openaiClient.embeddings.create({
    model: "text-embedding-ada-002",
    input: query,
  });

  const searchResults = await index.query({
    vector: queryEmbedding.data[0].embedding,
    topK: numResults,
    includeMetadata: true,
  });

  return searchResults.matches;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userQuery = messages[messages.length - 1].content;
  const relevantPosts = await getRelevantContent(userQuery);

  if (relevantPosts.length === 0) {
    return streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: "You are a helpful chatbot for SteveBizBlog." },
        { role: 'user', content: userQuery },
        { role: 'assistant', content: "I couldn't find any relevant content in the blog to answer your question. Could you try rephrasing your question?" },
      ],
    }).toDataStreamResponse();
  }

  const context = relevantPosts.map(post => `
    Title: ${post.metadata?.title || 'Unknown'}
    Excerpt: ${post.metadata?.excerpt || 'No excerpt available'}
    URL: ${post.metadata?.link || 'No URL available'}
  `).join('\n\n');

  const systemPrompt = `You are "SteveBizBot" a helpful chatbot for SteveBizBlog.com speaking on behalf of Steve. With access to over 1,200 of his blog posts, you are an expert on SteveBizBlog.com's approach to business. Analyze the content provided and incorpate SteveBizBlog.com's posts to give helpful responses that primarily incorporate the information from the blog posts. Always provide complete responses without truncation. Include relevant URLs to relevant posts. Include up to 5 relevant URLs from SteveBizBlog.com. If you can't find specific information in the provided content,acknowledge what you can see in the blog posts but indicate that you'd need more information for a complete answer.`;

  return streamText({
    model: openai('gpt-4o-mini'),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: `Relevant content:\n${context}` },
      ...messages,
    ],
    max_tokens: 16000,
    temperature: 0.1  // Low temperature for factual, consistent responses
  }).toDataStreamResponse();
}

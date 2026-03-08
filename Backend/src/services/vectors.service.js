import { Pinecone } from '@pinecone-database/pinecone'

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const karmanAiIndex = pc.index({ name: "karman-ai" });

export const createMemory = async ({vectors, metadata, messageId}) => {
    await karmanAiIndex.upsert({
       records : [{
        id: messageId,
        values: vectors,
        metadata,
    }]
    });
};

export const queryResponse = async (vector, metadata) => {
    return await karmanAiIndex.query({
        vector,
        topK: 5,
        includeValues: false,
        includeMetadata: true,
        filter: metadata ?  metadata : undefined,
    })
};
import { NextResponse } from "next/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { ChatOpenAI } from '@langchain/openai';

// PDF parse langchain
const loader = new PDFLoader("src/documents/bankstatementmar24.pdf");
const docs = await loader.load();
// improve this by looping array
const response_raw = docs[0].pageContent + docs[1].pageContent;


export async function GET(req, res) {
  const model = new ChatOpenAI({
    temperature: 0.9,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    maxTokens: 1000,
  });
  const prompt =
    'Generate a list of JSON objects representing the transactions from the account statement. Add a new field to the JSON called category based on the description, and select one of the following (Subscriptions, General, Bills, Undefined). Please only provide the list of data as your response. \n';
  const result = await model.invoke(prompt + response_raw);
  // const output = JSON.stringify(result.content, null, 2)
  // console.log(output);
  return NextResponse.json({ messsage: result.content });
}



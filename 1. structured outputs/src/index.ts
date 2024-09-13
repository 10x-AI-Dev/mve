import path from 'path';
import { verifyEnvVars } from './utils/env.js';
import { logger } from './utils/logger.js';
import { createGenerator, Schema } from 'ts-json-schema-generator';
import OpenAI from 'openai';
import fs from 'fs';
import { FileUtils } from './utils/file.js';
import { getGitHubData } from './github.js';
import { replaceTokens } from './utils/string.js';
import { IssueTriageMetadata } from './models/issue-triage-metadata.js';
import { formatIssueAsText } from './utils/issue.js';

async function main(repoUrl: string) {
  verifyEnvVars();

  FileUtils.ensureDirectoryExists('./out');

  const schema = generateOpenAiSchema();
  if (!schema) {
    return;
  }

  const [owner, repo] = repoUrl.split('/').slice(-2);

  if (!owner || !repo) {
    logger.error('Invalid repository URL provided.');
    process.exit(1);
  }
  ``;

  const githubData = await getGitHubData(owner, repo);
  const systemPrompt = replaceTokens(baseSystemPrompt, {
    labels: githubData.labels.map((label) => `- ${label.name}: ${label.description}`).join('\n')
  });

  const triageData = await Promise.all(
    githubData.issues
      .slice(0, 5)
      .map((issue) => getIssueTriageMetadata(issue.id, schema, systemPrompt, formatIssueAsText(issue)))
  );

  triageData.forEach((data, i) => {
    if (!data) return;
    const issue = githubData.issues[i];
    if (data.severity === 'Critical' || data.severity === 'Major' || data.priority === 'High')
      logger.info(
        `[${issue.id}] [${data.suggestedLabels.join('|')}] ${data.suggestedTitle} - Severity: ${
          data.severity
        } - Priority: ${data.priority}`
      );
  });

  const outputPath = path.resolve(`./out/issue_triage_metadata_${new Date().getTime()}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(triageData, null, 2));
}

function generateOpenAiSchema() {
  const filePath = path.resolve('./src/models/issue-triage-metadata.ts');

  const config = {
    path: filePath,
    tsconfig: './tsconfig.json',
    type: '*'
  };

  let rawSchema: Schema;
  const fileName = path.basename(filePath, path.extname(filePath));
  if (fs.existsSync(`./out/${fileName}.json`)) {
    rawSchema = JSON.parse(fs.readFileSync(`./out/${fileName}.json`, 'utf-8'));
  } else {
    rawSchema = createGenerator(config).createSchema(config.type);
    if (!rawSchema || !rawSchema.definitions) {
      logger.error('Failed to generate schema.');
      return;
    }
  }
  fs.writeFileSync(`./out/${fileName}.json`, JSON.stringify(rawSchema, null, 2));

  const typeName = Object.keys(rawSchema.definitions!)[0];
  const mainSchema = rawSchema.definitions![typeName] as any;
  delete rawSchema.definitions![typeName];
  const openAiSchema: OpenAI.ResponseFormatJSONSchema.JSONSchema = {
    name: typeName,
    strict: true,
    schema: {
      ...mainSchema,
      definitions: rawSchema.definitions
    }
  };
  if (!openAiSchema) {
    logger.error('Failed to get or generate schema.');
    return;
  }

  return openAiSchema;
}

let baseSystemPrompt = fs.readFileSync('./src/prompts/issue-triage-metadata.prompt', 'utf-8');

async function getIssueTriageMetadata(
  id: number,
  schema: OpenAI.ResponseFormatJSONSchema.JSONSchema,
  systemPrompt: string,
  userPrompt: string
) {
  const openAiApiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({
    apiKey: openAiApiKey
  });

  const config: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: schema
    }
  };

  const res = await openai.beta.chat.completions.parse<
    OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
    IssueTriageMetadata
  >(config);

  const resData = res.choices[0].message.parsed;

  fs.writeFileSync(
    `./out/llm-run-log_id${id}_${new Date().getTime()}.json`,
    JSON.stringify(
      {
        config,
        resData
      },
      null,
      2
    )
  );
  return resData;
}

const repoUrl = process.argv[2] ?? 'saoudrizwan/claude-dev';

main(repoUrl);

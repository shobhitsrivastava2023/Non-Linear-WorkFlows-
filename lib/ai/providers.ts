import { customProvider } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import {openai} from '@ai-sdk/openai';

import { isTestEnvironment } from '../constants';
import { chatModel, titleModel } from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'title-model': titleModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openai('gpt-4o-2024-08-06'),
        'title-model': openai('gpt-4.1-2025-04-14'),
      },
    });

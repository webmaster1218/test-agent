'use server';

export interface SentimentAnalysisInput {
  message: string;
}

export interface SentimentAnalysisOutput {
  sentiment: 'Positivo' | 'Negativo' | 'Neutro';
}

export async function analyzeSentiment(
  input: SentimentAnalysisInput
): Promise<SentimentAnalysisOutput> {
  // Simple sentiment analysis based on keywords
  const message = input.message.toLowerCase();

  const positiveWords = ['bueno', 'excelente', 'genial', 'feliz', 'contento', 'maravilloso', 'perfecto', 'increíble'];
  const negativeWords = ['malo', 'terrible', 'horrible', 'triste', 'enojado', 'frustrado', 'decepcionado', 'problema'];

  const positiveCount = positiveWords.filter(word => message.includes(word)).length;
  const negativeCount = negativeWords.filter(word => message.includes(word)).length;

  if (positiveCount > negativeCount) {
    return { sentiment: 'Positivo' };
  } else if (negativeCount > positiveCount) {
    return { sentiment: 'Negativo' };
  } else {
    return { sentiment: 'Neutro' };
  }
}
export type RoastLevel = 'gentle' | 'savage' | 'nuclear';

export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'php'
  | 'go'
  | 'rust'
  | 'html'
  | 'css'
  | 'sql'
  | 'other';

export interface RoastIssue {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RoastResponseData {
  roast: string;
  severity: number; // 1 to 10 scale
  summary: string;
  issues: RoastIssue[];
  improvements: string[];
  betterCode: string;
  developerVerdict: string;
}

export interface RoastApiPayload {
  code: string;
  language: SupportedLanguage;
  roastLevel: RoastLevel;
}

export interface ApiResponse {
  success: boolean;
  result?: RoastResponseData;
  error?: string;
  modelUsed?: string;
  isMocked?: boolean;
}

export interface CodeExample {
  id: string;
  label: string;
  icon: string;
  language: SupportedLanguage;
  code: string;
  description: string;
}

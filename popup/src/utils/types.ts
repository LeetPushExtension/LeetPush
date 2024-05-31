export interface QuestionDataI {
  data: QDataI;
}

export interface QDataI {
  date: string;
  link: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topicTags: {
    name: string;
    slug: string;
    translatedName: null | string;
  }[];
}

export interface LeetCodePropsI {
  leetCodeUsername: string;
  setLeetCodeUsername: (username: string) => void;
}

export interface UserStatsI {
  data: UStatsI
}

export interface UStatsI {
  acSubmissionNum: {
    difficulty: 'All' | 'Easy' | 'Medium' | 'Hard'
    count: number
  }[]
  allQuestionsCount: {
    difficulty: 'All' | 'Easy' | 'Medium' | 'Hard'
    count: number
  }[]
}

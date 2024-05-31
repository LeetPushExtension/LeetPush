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

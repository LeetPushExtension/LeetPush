export const DailyProblemQuery = `
  query {
    activeDailyCodingChallengeQuestion {
      date
      link
      question {
        questionId
        questionFrontendId
        title
        titleSlug
        difficulty
        topicTags {
          name
          slug
          translatedName
        }
        stats
      }
    }
  }
`

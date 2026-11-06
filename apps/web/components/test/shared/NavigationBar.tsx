"use client"

export interface QuestionItem {
  number: number
  questionId: string
  isAnswered: boolean
  isActive: boolean
}

export function isAnsweredValue(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === "string" && value.trim() === "") return false
  if (Array.isArray(value) && value.length === 0) return false
  return true
}

export function extractQuestionsFromGroups(
  questionGroups: any[],
  answers: Record<string, any>,
  activeQuestionId: string | null,
): QuestionItem[] {
  const result: QuestionItem[] = []

  for (const group of questionGroups) {
    if (!group) continue

    switch (group.type) {
      case "mcq_single":
      case "sentence_completion":
      case "completion":
      case "diagram_labeling":
      case "flowchart_completion":
      case "statement_judgement": {
        const questions = group.questions as any[] | undefined
        if (!questions) break
        for (const q of questions) {
          if (!q.questionId) continue
          result.push({
            number: q.number ?? 0,
            questionId: q.questionId,
            isAnswered: isAnsweredValue(answers[q.questionId]),
            isActive: activeQuestionId === q.questionId,
          })
        }
        break
      }

      case "mcq_multiple": {
        const num = parseInt(group.questionRange, 10)
        result.push({
          number: isNaN(num) ? 0 : num,
          questionId: group.questionId,
          isAnswered: isAnsweredValue(answers[group.questionId]),
          isActive: activeQuestionId === group.questionId,
        })
        break
      }

      case "notes_completion":
      case "completion_layout": {
        const blocks = group.layout?.blocks as any[] | undefined
        if (!blocks) break
        for (const block of blocks) {
          const content = block.content as any[] | undefined
          if (!content) continue
          for (const item of content) {
            if (item.type === "question" && item.questionId) {
              result.push({
                number: item.number ?? 0,
                questionId: item.questionId,
                isAnswered: isAnsweredValue(answers[item.questionId]),
                isActive: activeQuestionId === item.questionId,
              })
            }
          }
        }
        break
      }

      case "table_completion":
      case "form_completion": {
        const rows = group.layout?.rows as any[] | undefined
        if (!rows) break
        for (const row of rows) {
          const cells = row as any[]
          for (const cell of cells) {
            const items = cell as any[] | undefined
            if (!items) continue
            for (const item of items) {
              if (item.type === "question" && item.questionId) {
                result.push({
                  number: item.number ?? 0,
                  questionId: item.questionId,
                  isAnswered: isAnsweredValue(answers[item.questionId]),
                  isActive: activeQuestionId === item.questionId,
                })
              }
            }
          }
        }
        break
      }

      case "matching":
      case "matching_headings":
      case "matching_information":
      case "matching_features":
      case "matching_sentence_endings": {
        const questions = group.questions as any[] | undefined
        if (!questions) break
        for (const q of questions) {
          const qId = q.questionId ?? `q_${q.number}`
          result.push({
            number: q.number ?? 0,
            questionId: qId,
            isAnswered: isAnsweredValue(answers[qId]),
            isActive: activeQuestionId === qId,
          })
        }
        break
      }

      default: {
        const questions = group.questions as any[] | undefined
        if (!questions) break
        for (const q of questions) {
          const qId = q.questionId
          if (!qId) continue
          result.push({
            number: q.number ?? 0,
            questionId: qId,
            isAnswered: isAnsweredValue(answers[qId]),
            isActive: activeQuestionId === qId,
          })
        }
        break
      }
    }
  }

  return result
}


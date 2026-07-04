import { TestItem } from "@/app/admin/lib/mock-data";
import { z } from "zod"


export const getValidationIssues = (contentJson: string, answerJson: string, test: TestItem | null) => {
  const issues: { type: "error" | "warning"; message: string }[] = []
  let parsedContent: any = null
  let parsedAnswers: any = null

  try {
    parsedContent = JSON.parse(contentJson)
  } catch (e: any) {
    issues.push({ type: "error", message: `Content JSON syntax: ${e.message}` })
  }

  try {
    parsedAnswers = JSON.parse(answerJson)
  } catch (e: any) {
    issues.push({ type: "error", message: `Answers JSON syntax: ${e.message}` })
  }

  if (contentJson.trim() === "" || answerJson.trim() === "" || !test) {
    return issues
  }

  if (issues.length > 0) {
    return issues
  }

  // Define common types
  const QuestionBase = z.object({
    questionId: z.string().optional(),
    number: z.number().optional(),
  })

  // Define question group schemas
  const QuestionGroupBase = z.object({
    type: z.string("Missing 'type'"),
    instructions: z.string("Missing 'instructions'"),
    questionRange: z.string("Missing 'questionRange'"),
    questions: z.array(QuestionBase).optional(),
  })

  const ContentSchema = z.object({
    title: z.string("Test title ('title' key) is missing"),
    sections: z.array(
      z.object({
        id: z.string("Section is missing an 'id'"),
        title: z.string().optional(),
        audio_url: z.string().optional(),
        instructions: z.string().optional(),
        questions: z.array(z.any()).optional(),
        questionGroups: z.array(z.any()).optional(),
        // Speaking specifics
        topics: z.array(z.any()).optional(),
        cueCard: z.any().optional(),
      })
    ).min(1, "Test is missing sections list array ('sections')"),
  })

  const parsed = ContentSchema.safeParse(parsedContent)
  if (!parsed.success) {
    parsed.error.errors.forEach((err) => {
      issues.push({ type: "error", message: err.message || `${err.path.join(".")} is invalid` })
    })
  } else if (parsedContent.sections) {
    parsedContent.sections.forEach((sec: any, sIdx: number) => {
      if (test.skill === "listening" && !sec.audio_url) {
        issues.push({ type: "warning", message: `Section #${sIdx + 1} ('${sec.id || "?"}') is missing audio source URL ('audio_url')` })
      }
      if (test.skill === "reading" && !sec.instructions) {
        issues.push({ type: "warning", message: `Section #${sIdx + 1} is missing section 'instructions'` })
      }

      if (test.skill === "speaking") {
        if (sec.id === "part_1" && sec.topics) {
          sec.topics.forEach((topic: any, tIdx: number) => {
            if (!topic.title) issues.push({ type: "warning", message: `Topic #${tIdx + 1} in '${sec.id}' is missing a 'title'` })
            if (!topic.questions?.length) issues.push({ type: "warning", message: `Topic #${tIdx + 1} in '${sec.id}' has no 'questions'` })
          })
        } else if (sec.id === "part_2" && sec.cueCard) {
          if (!sec.cueCard.task) issues.push({ type: "error", message: `Cue card in '${sec.id}' is missing a 'task'` })
          if (!sec.cueCard.points?.length) issues.push({ type: "warning", message: `Cue card in '${sec.id}' has no 'points'` })
        } else if (sec.id === "part_3") {
          if (!sec.questions?.length) issues.push({ type: "warning", message: `Section '${sec.id}' has no 'questions'` })
        }
      } else {
        const sectionQuestions = sec.questionGroups ? sec.questionGroups.flatMap((g: any, gIdx: number) => {
          const res = QuestionGroupBase.safeParse(g)
          if (!res.success) {
            res.error.errors.forEach((err) => {
              if (err.path[0]) {
                issues.push({ type: "warning", message: `Question group #${gIdx + 1} in Section #${sIdx + 1} ('${sec.title || sIdx}') is missing '${err.path[0]}'` })
              }
            })
          }
          
          if (g.type === "table_completion") {
            if (!g.layout?.columns || !g.layout?.rows) {
              issues.push({ type: "error", message: `Table completion group #${gIdx + 1} is missing 'layout' with 'columns' and 'rows'` })
              return []
            }
            const ids: any[] = []
            g.layout.rows.forEach((row: any[], rIdx: number) => {
              if (row.length !== g.layout.columns.length) {
                issues.push({ type: "error", message: `Row #${rIdx + 1} in table completion group #${gIdx + 1} has ${row.length} cells, expected ${g.layout.columns.length}` })
              }
              row.forEach((cell: any[], cIdx: number) => {
                if (!Array.isArray(cell)) {
                  issues.push({ type: "error", message: `Cell #${cIdx + 1} in row #${rIdx + 1} must be an array of items` })
                  return
                }
                cell.forEach((item: any) => {
                  if (item.type === "question") {
                    if (!item.questionId) issues.push({ type: "error", message: `Question item in cell #${cIdx + 1} row #${rIdx + 1} is missing 'questionId'` })
                    else ids.push({ questionId: item.questionId, number: item.number || 0 })
                  }
                })
              })
            })
            return ids
          }

          if (g.type === "notes_completion") {
            if (!g.layout?.blocks) {
              issues.push({ type: "error", message: `Notes completion group #${gIdx + 1} is missing 'layout' with 'blocks'` })
              return []
            }
            const ids: any[] = []
            g.layout.blocks.forEach((block: any, bIdx: number) => {
              if (block.type === "paragraph" && block.content) {
                block.content.forEach((item: any, iIdx: number) => {
                  if (item.type === "question") {
                    if (!item.questionId) issues.push({ type: "error", message: `Question item #${iIdx + 1} in paragraph block #${bIdx + 1} of group #${gIdx + 1} is missing 'questionId'` })
                    else ids.push({ questionId: item.questionId, number: item.number || 0 })
                  }
                })
              }
            })
            return ids
          }

          if (g.type === "matching") {
            if (!g.options?.length) issues.push({ type: "error", message: `Matching group #${gIdx + 1} is missing 'options'` })
            if (!g.questions?.length) issues.push({ type: "warning", message: `Matching group #${gIdx + 1} has no questions` })
            return (g.questions || []).map((q: any) => ({ questionId: q.questionId ?? (q.number != null ? `q_${q.number}` : undefined), number: q.number || 0 }))
          }

          if (g.type === "diagram_labeling") {
            if (!g.image_src) issues.push({ type: "error", message: `Diagram labeling group #${gIdx + 1} is missing 'image_src'` })
            if (!g.options?.length) issues.push({ type: "error", message: `Diagram labeling group #${gIdx + 1} is missing 'options'` })
            if (!g.questions?.length) issues.push({ type: "warning", message: `Diagram labeling group #${gIdx + 1} has no questions` })
            return (g.questions || []).map((q: any) => ({ questionId: q.questionId ?? (q.number != null ? `q_${q.number}` : undefined), number: q.number || 0 }))
          }

          if (g.type === "mcq_multiple") {
            if (!g.select || typeof g.select !== "number" || g.select < 1) issues.push({ type: "error", message: `MCQ multiple group #${gIdx + 1} is missing valid 'select' (number of answers to pick)` })
            if (!g.questionNumbers?.length) issues.push({ type: "error", message: `MCQ multiple group #${gIdx + 1} is missing 'questionNumbers'` })
            if (!g.questionId) issues.push({ type: "error", message: `MCQ multiple group #${gIdx + 1} is missing 'questionId'` })
            if (!g.question) issues.push({ type: "error", message: `MCQ multiple group #${gIdx + 1} is missing 'question'` })
            if (!g.options || !Array.isArray(g.options) || g.options.length < (g.select || 1)) issues.push({ type: "error", message: `MCQ multiple group #${gIdx + 1} must have at least 'select' options` })
            return g.questionId ? [{ questionId: g.questionId, number: 0 }] : []
          }

          if (g.type === "statement_judgement") {
            if (!g.options || !Array.isArray(g.options) || g.options.length < 2) issues.push({ type: "error", message: `Statement judgement group #${gIdx + 1} is missing 'options' (e.g. True/False/Not Given)` })
            if (!g.questions?.length) issues.push({ type: "warning", message: `Statement judgement group #${gIdx + 1} has no questions` })
            return (g.questions || []).map((q: any) => ({ questionId: q.questionId ?? (q.number != null ? `q_${q.number}` : undefined), number: q.number || 0 }))
          }

          if (!g.questions?.length) {
            issues.push({ type: "warning", message: `Question group #${gIdx + 1} in Section #${sIdx + 1} has no questions` })
            return []
          }
          return (g.questions || []).map((q: any) => ({ questionId: q.questionId ?? (q.number != null ? `q_${q.number}` : undefined), number: q.number || 0 }))
        }) : sec.questions

        if (!sectionQuestions?.length) {
          issues.push({ type: "warning", message: `Section #${sIdx + 1} ('${sec.title || sIdx}') has no questions` })
        } else {
          sectionQuestions.forEach((q: any, qIdx: number) => {
            const id = q.questionId ?? (q.number != null ? `q_${q.number}` : undefined)
            if (!id) {
              issues.push({ type: "error", message: `Question #${qIdx + 1} in Section #${sIdx + 1} is missing both 'questionId' and 'number'` })
            } else if (parsedAnswers?.answers && !parsedAnswers.answers[id]) {
              issues.push({ type: "warning", message: `Question '${id}' is missing a corresponding answer key in Answers JSON` })
            }
          })
        }
      }
    })
  }

  return issues
}

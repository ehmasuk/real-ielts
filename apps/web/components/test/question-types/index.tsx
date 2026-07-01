"use client"

import { MCQSingle } from "./common/mcq_single"
import { MCQMultiple } from "./common/mcq_multiple"
import { GapFill } from "./common/gap_fill"
import { LayoutBlocks } from "./common/layout_blocks"
import { TableCompletion } from "./listening/table_completion"
import { DiagramLabeling } from "./listening/diagram_labeling"
import { StatementJudgement } from "./reading/statement_judgement"
import { MatchingHeadings } from "./reading/matching_headings"
import { MatchingInformation } from "./reading/matching_information"
import { MatchingFeatures } from "./reading/matching_features"
import { MatchingSentenceEndings } from "./reading/matching_sentence_endings"

export const questionTypeMap: Record<string, React.ComponentType<any>> = {
  mcq_single: MCQSingle,
  mcq_multiple: MCQMultiple,
  sentence_completion: GapFill,
  notes_completion: LayoutBlocks,
  table_completion: TableCompletion,
  diagram_labeling: DiagramLabeling,
  statement_judgement: StatementJudgement,
  matching_headings: MatchingHeadings,
  matching_information: MatchingInformation,
  matching_features: MatchingFeatures,
  matching_sentence_endings: MatchingSentenceEndings,
  completion: GapFill,
  completion_layout: LayoutBlocks,
}

export function QuestionGroup({
  group,
  answers,
  onAnswerChange,
}: {
  group: any
  answers: Record<string, any>
  onAnswerChange: (questionId: string, value: any) => void
}) {
  const Component = questionTypeMap[group.type]
  if (!Component) return null

  return <Component group={group} answers={answers} onAnswerChange={onAnswerChange} />
}

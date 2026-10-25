// Checks a proof against one of the tutorial lessons (frontend/src/data/tutorial.ts). The boards live in the shared data
// file, so this runs the very same level the page draws.
import { LESSONS } from "../frontend/src/data/tutorial";
import { usesHelper } from "./achievements";
import { evaluateProof, ProofResult } from "./proof";

export interface LessonResult extends ProofResult {
  /** solved AND used what the lesson teaches */
  passed: boolean;
}

const WANTS: Record<string, string> = {
  paint: "paint(...)",
  swap: "swap(...)",
  rotate: "rotate(...)",
  def: "a helper (a def line)",
};

export async function checkLesson(lessonId: string, code: string): Promise<LessonResult | null> {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return null;
  const result = await evaluateProof(lesson.level, code);
  const used = lesson.mustUse === "def" ? usesHelper(code) : result.steps.some((s) => s.op?.name === lesson.mustUse);
  const passed = result.solved && used;
  let message = result.message;
  if (result.solved && !used) message = `The board matches, but this lesson is about ${WANTS[lesson.mustUse]}. Try it with that.`;
  else if (passed) message = "Lesson complete!";
  else if (!result.error && !result.solved) message = lesson.nudge;
  return { ...result, passed, message };
}

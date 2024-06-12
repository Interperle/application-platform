"use server";

import fs from "fs";
import path from "path";

import { extractCurrentPhase, fetch_phases_status } from "@/actions/phase";

import { createCurrentTimestamp } from "./helpers";
import markdownToHtml from "./markdownToHtml";

export default async function getOverviewPageText() {
  const currentTime = new Date(createCurrentTimestamp());
  const currentPhase = await extractCurrentPhase(currentTime);
  const phases_status = await fetch_phases_status();
  phases_status.sort((a, b) => b.phase.phaseorder - a.phase.phaseorder);
  const last_phase_status = phases_status[0];
  let markdownFilePath: string;
  const base_branch = path.join(process.cwd(), "public", "texts")
  if (currentPhase.phaseorder == -1) {
    markdownFilePath = path.join(base_branch, "welcome.md");
  } else if (
    last_phase_status !== undefined &&
    last_phase_status.outcome == false &&
    last_phase_status.phase.finished_evaluation != null &&
    currentPhase.phaseid != last_phase_status.phase.phaseid
  ) {
    markdownFilePath = path.join(
      base_branch,
      last_phase_status.phase.phasename,
      "failed.md",
    );
  } else if (new Date(currentPhase.enddate) >= currentTime) {
    markdownFilePath = path.join(
      base_branch,
      currentPhase.phasename,
      "ongoing.md",
    );
  } else if (currentPhase.finished_evaluation == null) {
    markdownFilePath = path.join(
      base_branch,
      currentPhase.phasename,
      "evaluating.md",
    );
  } else if (last_phase_status.outcome == false) {
    markdownFilePath = path.join(
      base_branch,
      currentPhase.phasename,
      "failed.md",
    );
  } else if (last_phase_status.outcome == true) {
    markdownFilePath = path.join(
      base_branch,
      currentPhase.phasename,
      "passed.md",
    );
  } else {
    markdownFilePath = path.join(base_branch, "error.md");
  }
  const markdownContent = fs.readFileSync(markdownFilePath, "utf8");
  const contentHtml = await markdownToHtml(markdownContent);
  return contentHtml;
}

"use server";

import fs from "fs";
import path from "path";

import { extractCurrentPhase } from "@/actions/phase";

import markdownToHtml from "./markdownToHtml";
import { createCurrentTimestamp } from "./helpers";

export default async function getOverviewPageText() {
  const currentTime = new Date(createCurrentTimestamp());

  const currentPhase = await extractCurrentPhase(currentTime);

  var markdownFilePath: string;
  if (currentPhase.phaseorder == -1) {
    markdownFilePath = path.join("public", "texts", "welcome.md");
  } else if (new Date(currentPhase.enddate) < currentTime) {
    markdownFilePath = path.join(
      "public",
      "texts",
      currentPhase.phasename,
      "evaluating.md",
    );
  } else {
    markdownFilePath = path.join(
      "public",
      "texts",
      currentPhase.phasename,
      "ongoing.md",
    );
  }
  const markdownContent = fs.readFileSync(markdownFilePath, "utf8");
  const contentHtml = await markdownToHtml(markdownContent);
  return contentHtml;
}

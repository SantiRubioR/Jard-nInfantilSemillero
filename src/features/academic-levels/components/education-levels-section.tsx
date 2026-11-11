"use client";

import { EducationLevels } from "./education-levels";
import { useAcademicLevelsViewModel } from "../academic-levels.hooks";

export function EducationLevelsSection() {
  const { levels } = useAcademicLevelsViewModel();

  return <EducationLevels levels={levels} />;
}

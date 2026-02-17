import type { UnitsData, Unit, Lesson } from "@/types/units";
import unitsJson from "@/data/units.json";

const data = unitsJson as UnitsData;

export async function getUnitsData(): Promise<UnitsData> {
  return data;
}

export async function getUnit(unitId: string): Promise<Unit | null> {
  const data = await getUnitsData();
  return data.units.find((u) => u.id === unitId || String(u.unit) === unitId) ?? null;
}

export async function getLesson(unitId: string, lessonId: string): Promise<Lesson | null> {
  const unit = await getUnit(unitId);
  if (!unit) return null;
  return unit.lessons.find((l) => l.id === lessonId || String(l.lesson) === lessonId) ?? null;
}

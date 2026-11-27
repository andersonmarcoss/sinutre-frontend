import { LEVEL_ACTIVITY_OPTIONS, type LevelActivity, type SaveProfilePayload } from '@/types/profile';
import { parseNumericInput } from '@/utils/number';

interface ProfileFormValues {
  targetDietDaily: string;
  height: string;
  weight: string;
  levelActivity: string;
}

export function validateProfileForm(values: ProfileFormValues): {
  data?: SaveProfilePayload;
  fields: Record<string, string>;
} {
  const fields: Record<string, string> = {};

  const targetDietDaily = parseNumericInput(values.targetDietDaily);
  if (targetDietDaily === null) {
    fields.targetDietDaily = 'Meta calórica é obrigatória.';
  } else if (Number.isNaN(targetDietDaily) || !Number.isInteger(targetDietDaily)) {
    fields.targetDietDaily = 'Meta calórica deve ser um número inteiro.';
  } else if (targetDietDaily < 500 || targetDietDaily > 10000) {
    fields.targetDietDaily = 'Meta calórica deve estar entre 500 e 10.000 kcal.';
  }

  const height = parseNumericInput(values.height);
  if (height === null) {
    fields.height = 'Altura é obrigatória.';
  } else if (Number.isNaN(height)) {
    fields.height = 'Altura deve ser um número válido.';
  } else if (height < 50 || height > 272) {
    fields.height = 'Altura deve estar entre 50 e 272 cm.';
  }

  const weight = parseNumericInput(values.weight);
  if (weight === null) {
    fields.weight = 'Peso é obrigatório.';
  } else if (Number.isNaN(weight)) {
    fields.weight = 'Peso deve ser um número válido.';
  } else if (weight < 20 || weight > 500) {
    fields.weight = 'Peso deve estar entre 20 e 500 kg.';
  }

  const validLevels = LEVEL_ACTIVITY_OPTIONS.map((o) => o.value);
  if (!validLevels.includes(values.levelActivity as LevelActivity)) {
    fields.levelActivity = 'Nível de atividade inválido.';
  }

  if (Object.keys(fields).length > 0) {
    return { fields };
  }

  return {
    fields,
    data: {
      targetDietDaily: targetDietDaily!,
      height: height!,
      weight: weight!,
      levelActivity: values.levelActivity as LevelActivity,
    },
  };
}
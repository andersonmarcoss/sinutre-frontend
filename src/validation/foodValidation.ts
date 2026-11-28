import type { Food } from '@/types/food';
import { parseNumericInput } from '@/utils/number';

interface FoodFormValues {
  name: string;
  caloriesPer100g: string;
  carbsPer100g: string;
  proteinPer100g: string;
  fatPer100g: string;
}

function validateNumericRange(
  raw: string,
  key: string,
  label: string,
  max: number,
  fields: Record<string, string>,
): number | null {
  const parsed = parseNumericInput(raw);

  if (parsed === null) {
    fields[key] = `${label} é obrigatório.`;
    return null;
  }

  if (Number.isNaN(parsed)) {
    fields[key] = `${label} deve ser um número válido.`;
    return null;
  }

  if (parsed < 0 || parsed > max) {
    fields[key] = `${label} deve estar entre 0 e ${max}.`;
    return null;
  }

  return parsed;
}

export function validateFoodForm(values: FoodFormValues): {
  data?: Omit<Food, 'id'>;
  error?: string;
  fields: Record<string, string>;
} {
  const fields: Record<string, string> = {};

  const trimmedName = values.name.trim();
  if (!trimmedName) {
    fields.name = 'Nome do alimento é obrigatório.';
  } else if (trimmedName.length > 100) {
    fields.name = 'Nome deve ter no máximo 100 caracteres.';
  }

  const caloriesPer100g = validateNumericRange(
    values.caloriesPer100g,
    'caloriesPer100g',
    'Calorias por 100g',
    900,
    fields,
  );
  const carbsPer100g = validateNumericRange(
    values.carbsPer100g,
    'carbsPer100g',
    'Carboidratos por 100g',
    100,
    fields,
  );
  const proteinPer100g = validateNumericRange(
    values.proteinPer100g,
    'proteinPer100g',
    'Proteínas por 100g',
    100,
    fields,
  );
  const fatPer100g = validateNumericRange(
    values.fatPer100g,
    'fatPer100g',
    'Gorduras por 100g',
    100,
    fields,
  );

  if (Object.keys(fields).length > 0) {
    return {
      error: 'Corrija os campos destacados antes de salvar.',
      fields,
    };
  }

  if (carbsPer100g! + proteinPer100g! + fatPer100g! > 100) {
    return {
      error:
        'A soma de carboidratos, proteínas e gorduras não pode ultrapassar 100 g por 100 g.',
      fields,
    };
  }

  return {
    fields,
    data: {
      name: trimmedName,
      caloriesPer100g: caloriesPer100g!,
      carbsPer100g: carbsPer100g!,
      proteinPer100g: proteinPer100g!,
      fatPer100g: fatPer100g!,
    },
  };
}
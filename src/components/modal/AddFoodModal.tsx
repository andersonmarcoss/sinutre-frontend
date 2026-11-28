import { useEffect, useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { createFood, updateFood } from '@/services/foodService';
import { getApiError } from '@/lib/api';
import type { Food } from '@/types/food';
import { validateFoodForm } from '@/validation/foodValidation';

interface AddFoodModalProps {
  open: boolean;
  food?: Food | null;
  onClose: () => void;
  onSaved: (mode: 'create' | 'update') => Promise<void> | void;
}

export function AddFoodModal({
  open,
  food,
  onClose,
  onSaved,
}: AddFoodModalProps) {
  const [name, setName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [carbsPer100g, setCarbsPer100g] = useState('');
  const [proteinPer100g, setProteinPer100g] = useState('');
  const [fatPer100g, setFatPer100g] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;

    setError(null);
    setFieldErrors({});
    if (food) {
      setName(food.name);
      setCaloriesPer100g(String(food.caloriesPer100g));
      setCarbsPer100g(String(food.carbsPer100g));
      setProteinPer100g(String(food.proteinPer100g));
      setFatPer100g(String(food.fatPer100g));
    } else {
      setName('');
      setCaloriesPer100g('');
      setCarbsPer100g('');
      setProteinPer100g('');
      setFatPer100g('');
    }
  }, [open, food]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validation = validateFoodForm({
      name,
      caloriesPer100g,
      carbsPer100g,
      proteinPer100g,
      fatPer100g,
    });

    if (!validation.data) {
      setFieldErrors(validation.fields);
      setError(validation.error ?? 'Dados inválidos.');
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});

      if (food) {
        await updateFood(food.id, validation.data);
      } else {
        await createFood(validation.data);
      }

      await onSaved(food ? 'update' : 'create');
      onClose();
    } catch (err) {
      const apiError = getApiError(err);
      setError(apiError.message);
      setFieldErrors(apiError.fields);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <form noValidate onSubmit={handleSubmit} className="modal-box">
        <h3 className="font-bold text-lg">
          {food ? 'Alterar alimento' : 'Novo alimento'}
        </h3>

        <div className="space-y-3 mt-4">
          <FormField label="Nome" htmlFor="food-name" error={fieldErrors.name}>
            <input
              id="food-name"
              type="text"
              className={`input input-bordered w-full ${
                fieldErrors.name ? 'input-error' : ''
              }`}
              placeholder="Ex: Arroz branco"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>

          <FormField
            label="Calorias por 100g (kcal)"
            htmlFor="food-calories"
            error={fieldErrors.caloriesPer100g}
          >
            <input
              id="food-calories"
              type="number"
              step="any"
              inputMode="decimal"
              className={`input input-bordered w-full ${
                fieldErrors.caloriesPer100g ? 'input-error' : ''
              }`}
              placeholder="Ex: 130"
              value={caloriesPer100g}
              onChange={(e) => setCaloriesPer100g(e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField
              label="Carboidratos (g)"
              htmlFor="food-carbs"
              error={fieldErrors.carbsPer100g}
            >
              <input
                id="food-carbs"
                type="number"
                step="any"
                inputMode="decimal"
                className={`input input-bordered w-full ${
                  fieldErrors.carbsPer100g ? 'input-error' : ''
                }`}
                placeholder="Ex: 28"
                value={carbsPer100g}
                onChange={(e) => setCarbsPer100g(e.target.value)}
              />
            </FormField>

            <FormField
              label="Proteínas (g)"
              htmlFor="food-protein"
              error={fieldErrors.proteinPer100g}
            >
              <input
                id="food-protein"
                type="number"
                step="any"
                inputMode="decimal"
                className={`input input-bordered w-full ${
                  fieldErrors.proteinPer100g ? 'input-error' : ''
                }`}
                placeholder="Ex: 2.7"
                value={proteinPer100g}
                onChange={(e) => setProteinPer100g(e.target.value)}
              />
            </FormField>

            <FormField
              label="Gorduras (g)"
              htmlFor="food-fat"
              error={fieldErrors.fatPer100g}
            >
              <input
                id="food-fat"
                type="number"
                step="any"
                inputMode="decimal"
                className={`input input-bordered w-full ${
                  fieldErrors.fatPer100g ? 'input-error' : ''
                }`}
                placeholder="Ex: 0.3"
                value={fatPer100g}
                onChange={(e) => setFatPer100g(e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {error && <div className="alert alert-error mt-4 text-sm">{error}</div>}

        <div className="modal-action">
          <button
            type="button"
            className="btn"
            disabled={loading}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
      <div
        className="modal-backdrop"
        onClick={!loading ? onClose : undefined}
      />
    </div>
  );
}
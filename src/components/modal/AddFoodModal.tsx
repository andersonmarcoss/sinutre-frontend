import { useEffect, useState } from 'react';
import { createFood, updateFood } from '@/services/foodService';
import { getApiError } from '@/lib/api';
import type { Food } from '@/types/food';

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

  useEffect(() => {
    if (!open) return;

    setError(null);
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

  async function handleSave() {
    try {
      setError(null);
      setLoading(true);

      const payload = {
        name,
        caloriesPer100g: Number(caloriesPer100g),
        carbsPer100g: Number(carbsPer100g),
        proteinPer100g: Number(proteinPer100g),
        fatPer100g: Number(fatPer100g),
      };

      if (food) {
        await updateFood(food.id, payload);
      } else {
        await createFood(payload);
      }

      await onSaved(food ? 'update' : 'create');
      onClose();
    } catch (err) {
      setError(getApiError(err).message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box">
        <h3 className="font-bold text-lg">
          {food ? 'Alterar alimento' : 'Novo alimento'}
        </h3>

        <div className="space-y-3 mt-4">
          <input
            className="input input-bordered w-full"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Calorias por 100g"
            value={caloriesPer100g}
            onChange={(e) => setCaloriesPer100g(e.target.value)}
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Carboidratos por 100g"
            value={carbsPer100g}
            onChange={(e) => setCarbsPer100g(e.target.value)}
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Proteínas por 100g"
            value={proteinPer100g}
            onChange={(e) => setProteinPer100g(e.target.value)}
          />

          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="Gorduras por 100g"
            value={fatPer100g}
            onChange={(e) => setFatPer100g(e.target.value)}
          />
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
            type="button"
            className="btn btn-primary"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop"
        onClick={!loading ? onClose : undefined}
      />
    </div>
  );
}
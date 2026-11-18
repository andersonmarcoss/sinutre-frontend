import { useState, useMemo, useEffect } from 'react';
import type { FoodItem } from '@/types/meal';
import { MealItemForm } from './MealItemForm';
import { MealItemsTable } from './MealItemsTable';
import { MealMacrosSummary } from './MealMacrosSummary';
import { MealMetadataForm } from './MealMetadataForm';
import { MealCategory } from '@/types/meal';
import { createMeal } from '@/services/mealService';

import { MealState } from '@/types/meal';

interface AddMealModalProps {
  open: boolean;
  onClose: () => void;
  typeMeal: MealCategory | null;
  onMealCreated: () => Promise<void>;
}

export function AddMealModal({
  open,
  typeMeal,
  onClose,
  onMealCreated
}: AddMealModalProps) {

  const [meal, setMeal] = useState<MealState>({
    description: '',
    type: typeMeal ?? '',
    eatTime: '',
  });

  const [items, setItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    if (open && typeMeal) {
      setMeal({
        description: '',
        type: typeMeal,
        eatTime: '',
      });
      setItems([]);
    }
  }, [open, typeMeal]);

  const macros = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc.carbs += item.carbs;
          acc.proteins += item.protein;
          acc.fats += item.fat;
          acc.calories += item.calories;

          return acc;
        },
        {
          carbs: 0,
          proteins: 0,
          fats: 0,
          calories: 0,
          caloriesGoal: 0,
        },
      ),
    [items],
  );

  function handleAddItem(
    item: FoodItem,
  ) {
    setItems((current) => [
      ...current,
      item,
    ]);
  }

  function handleRemoveItem(
    item: FoodItem,
  ) {
    setItems((current) =>
      current.filter(
        (x) => x.id !== item.id,
      ),
    );
  }

  async function handleSaveMeal() {
    await createMeal({
      ...meal,
      items: items.map((item) => ({
        foodId: item.foodId,
        grams: item.grams,
      })),
    });

    await onMealCreated();

    onClose();
  }

  if (!open || !typeMeal) {
    return null;
  }

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`} role="dialog">
      <div className="modal-box max-w-6xl">
        <h2 className="text-3xl font-semibold mb-6">Adicionar Refeição</h2>
        
        <MealMacrosSummary macros={macros} />
        <MealMetadataForm meal={meal} setMeal={setMeal} />

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-4">Itens da Refeição</h3>
          <MealItemForm onAdd={handleAddItem} />
        </div>

        <MealItemsTable items={items} onRemove={handleRemoveItem} />

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSaveMeal}>
            Salvar refeição
          </button>
        </div>
      </div>
    </div>
  );
}

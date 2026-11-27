import { useEffect, useState } from 'react';
import { Plus, Trash } from '@phosphor-icons/react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { AddFoodModal } from '@/components/modal/AddFoodModal';
import { deleteFood, getFoods } from '@/services/foodService';
import type { Food } from '@/types/food';
import { getApiError } from '@/lib/api';
import { ConfirmModal } from '@/components/modal/ConfirmModal';

const MODAL_ID = 'create-food-modal';

export function DietFoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadFoods() {
    try {
      setError(null);
      const data = await getFoods();
      setFoods(data);
    } catch (err) {
      setError(getApiError(err).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!foodToDelete) return;

    try {
      setDeleting(true);
      setError(null);
      await deleteFood(foodToDelete.id);
      setFoodToDelete(null);
      await loadFoods();
    } catch (err) {
      setFoodToDelete(null);
      setError(getApiError(err).message);
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader
        title="Dieta"
        subtitle="Gerencie seus alimentos"
      />

      {error && (
        <div className="alert alert-error mt-4 flex justify-between text-sm">
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => setError(null)}
          >
            Fechar
          </button>
        </div>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid gap-4 mt-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="card bg-base-100 shadow-sm"
            >
              <div className="card-body">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="card-title">
                    {food.name || 'Alimento sem nome'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setFoodToDelete(food)}
                    className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                    aria-label={`Excluir ${food.name}`}
                    title="Excluir alimento"
                  >
                    <Trash size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <span>
                    🔥 {food.caloriesPer100g} kcal
                  </span>

                  <span>
                    🍞 {food.carbsPer100g} g
                  </span>

                  <span>
                    🍗 {food.proteinPer100g} g
                  </span>

                  <span>
                    🥑 {food.fatPer100g} g
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-6 shadow-lg z-50"
        onClick={() =>
          (
            document.getElementById(
              MODAL_ID,
            ) as HTMLDialogElement
          )?.showModal()
        }
      >
        <Plus size={24} weight="bold" />
      </button>

      <AddFoodModal
        modalId={MODAL_ID}
        onCreated={loadFoods}
      />
      <ConfirmModal
        open={foodToDelete !== null}
        title="Excluir alimento"
        message={`Tem certeza que deseja excluir "${foodToDelete?.name || 'este alimento'}"?`}
        confirmLabel="Excluir"
        confirmVariant="error"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setFoodToDelete(null)}
      />
    </div>
  );
}
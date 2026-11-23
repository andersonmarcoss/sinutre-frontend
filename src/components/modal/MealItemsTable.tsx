import type { FoodItem } from '@/types/meal';
import { formatNumber } from '@/utils/number';

interface MealItemsTableProps {
  items: FoodItem[];
  onRemove?: (item: FoodItem) => void;
}

export function MealItemsTable({ items, onRemove }: MealItemsTableProps) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Alimento</th>
            <th>Quantidade</th>
            <th>Calorias</th>
            <th>Carboidratos</th>
            <th>Proteínas</th>
            <th>Gordura</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{formatNumber(item.grams, 1)} g</td>
              <td>
                <span className="badge badge-outline badge-primary">
                  {formatNumber(item.calories, 0)} kcal
                </span>
              </td>
              <td>{formatNumber(item.carbs, 1)} g</td>
              <td>{formatNumber(item.protein, 1)} g</td>
              <td>{formatNumber(item.fat, 1)} g</td>
              <td>
                <button
                  type="button"
                  onClick={() => onRemove?.(item)}
                  className="btn btn-ghost btn-xs"
                >
                  remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
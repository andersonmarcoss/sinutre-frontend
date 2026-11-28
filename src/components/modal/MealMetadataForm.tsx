import { MEAL_CATEGORIES } from '@/constants/mealCategories';
import { FormField } from '../forms/FormField';
import { getTodayLocalDateInput } from '@/utils/date';
import { MealState } from '@/types/meal';

interface MealMetadataProp{
  meal: MealState;
  setMeal: React.Dispatch<React.SetStateAction<MealState>>;
}


export function MealMetadataForm( {meal, setMeal} : MealMetadataProp) {
  const [datePart = '', timePart = ''] = meal.eatTime.split('T');
  return (
    <section className="grid lg:grid-cols-3 gap-4 mb-8">
      <FormField label="Descrição" htmlFor="meal-description" className="lg:col-span-1">
        <input
          id="meal-description"
          type="text"
          value={meal.description}
          placeholder="Ex: almoço pós treino"
          className="input input-bordered w-full"
          onChange={(e) =>
                setMeal({
                  ...meal,
                  description: e.target.value,
                })
              }
        />
      </FormField>

      <FormField label="Categoria" htmlFor="meal-category">
        <select
          id="meal-category"
          className="select select-bordered w-full"
          value={meal.type}
          disabled={true}
          onChange={(e) =>
                setMeal({
                  ...meal,
                  type: e.target.value,
                })
              }
        >
          <option disabled value="">
            Selecione categoria
          </option>
          {MEAL_CATEGORIES.map(category => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Data e horário" htmlFor="meal-date">
        <div className="grid grid-cols-2 gap-2">
          <input
            id="meal-date"
            type="date"
            value={datePart}
            className="input input-bordered w-full"
            onChange={(e) => {
              const newDate = e.target.value;
              setMeal({
                ...meal,
                eatTime: newDate
                  ? timePart
                    ? `${newDate}T${timePart}`
                    : newDate
                  : '',
              });
            }}
          />
          <input
            id="meal-time"
            type="time"
            value={timePart}
            aria-label="Horário da refeição"
            className="input input-bordered w-full"
            onChange={(e) => {
              const newTime = e.target.value;
              const baseDate = datePart || getTodayLocalDateInput();
              setMeal({
                ...meal,
                eatTime: newTime ? `${baseDate}T${newTime}` : datePart,
              });
            }}
          />
        </div>
   </FormField>
    </section>
  );
}

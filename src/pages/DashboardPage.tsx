import { useState, useEffect, useMemo } from 'react';
import { AddMealCard } from '@/components/cards/AddMealCard';
import { TotalMealsCard } from '@/components/cards/TotalMealsCard';
import { Header } from '@/components/layout/Header';
import { MacroStatsBar } from '@/components/macros/MacroStatsBar';
import { MealFab } from '@/components/meals/MealFab';
import { MealsList } from '@/components/meals/MealsList';
import { MealsTable } from '@/components/meals/MealsTable';
import { AddMealModal } from '@/components/modal/AddMealModal';
import { useAuth } from '@/context/AuthContext';
import type { Meal } from '@/types/meal';
import { useMealModal } from '@/hooks/useMealModal';
import { getMeals } from '@/services/mealService';
import { isSameLocalDay, isSameLocalMonth } from '@/utils/date';
import { Link } from 'react-router-dom';
import { getProfile } from '@/services/profileService';
import type { Profile } from '@/types/profile';
import { getApiError } from '@/lib/api';

interface DashboardPageProps {
  drawerId: string;
}

export function DashboardPage({ drawerId }: DashboardPageProps) {
  const { user } = useAuth();
  const modal = useMealModal();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboardData() {
    try {
      setError(null);
      const [mealsData, profileData] = await Promise.all([
        getMeals(),
        getProfile(),
      ]);
      setMeals(mealsData);
      setProfile(profileData);
    } catch (err) {
      setError(getApiError(err).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const mealsSummary = useMemo(() => {
    const today = new Date();
    return {
      total: meals.length,
      thisMonth: meals.filter((m) => isSameLocalMonth(m.eatTime, today)).length,
      today: meals.filter((m) => isSameLocalDay(m.eatTime, today)).length,
    };
  }, [meals]);

  const macroSummary = useMemo(() => {
    const today = new Date();
    return meals
      .filter((meal) => isSameLocalDay(meal.eatTime, today))
      .reduce(
        (acc, meal) => {
          acc.carbs += meal.totals.carbs;
          acc.proteins += meal.totals.proteins;
          acc.fats += meal.totals.fats;
          acc.calories += meal.totals.calories;
          return acc;
        },
        {
          carbs: 0,
          proteins: 0,
          fats: 0,
          calories: 0,
          caloriesGoal: profile?.targetDietDaily ?? null,
        },
      );
  }, [meals, profile]);

  if (!user){
    return <></>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-base-content/60">Carregando...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto mb-8">
        <Header
          drawerId={drawerId}
          userName={user.name}
          avatarUrl={user.avatarUrl}
        />

        {error && (
          <div className="alert alert-error text-sm">{error}</div>
        )}

        {!error && profile === null && (
          <div className="alert alert-info shadow-sm flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm">
            Você ainda não cadastrou sua meta calórica diária, altura e peso.
          </span>
          <Link to="/profile" className="btn btn-sm btn-primary">
            Cadastrar perfil
          </Link>
        </div>
      )}

        <MacroStatsBar summary={macroSummary} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
          <TotalMealsCard summary={mealsSummary} />
          <AddMealCard onSelectCategory={modal.openWith} />
        </div>

        <MealsTable meals={meals} />
        <MealsList meals={meals} />
      </div>

      <MealFab onSelectCategory={modal.openWith} />

      <AddMealModal
        open={modal.open}
        typeMeal={modal.selectedCategory}
        onClose={modal.close}
        onMealCreated={loadDashboardData}
      />
    </>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { FormField } from '@/components/forms/FormField';
import { getApiError } from '@/lib/api';
import { createProfile, getProfile } from '@/services/profileService';
import {
  LEVEL_ACTIVITY_OPTIONS,
  type LevelActivity,
  type Profile,
} from '@/types/profile';
import { validateProfileForm } from '@/validation/profileValidation';

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [targetDietDaily, setTargetDietDaily] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [levelActivity, setLevelActivity] = useState<LevelActivity>('SEDENTARIO');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setError(null);
        const data = await getProfile();
        setProfile(data);
        if (data) {
          setTargetDietDaily(String(data.targetDietDaily));
          setHeight(String(data.height));
          setWeight(String(data.weight));
          setLevelActivity(data.levelActivity);
        }
      } catch (err) {
        setError(getApiError(err).message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = validateProfileForm({
      targetDietDaily,
      height,
      weight,
      levelActivity,
    });

    if (!validation.data) {
      setFieldErrors(validation.fields);
      setError('Corrija os campos destacados antes de continuar.');
      return;
    }

    try {
      setSaving(true);
      setFieldErrors({});
      const created = await createProfile(validation.data);
      setProfile(created);
      setSuccess('Perfil cadastrado com sucesso!');
    } catch (err) {
      const apiError = getApiError(err);
      setError(apiError.message);
      setFieldErrors(apiError.fields);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
      <SimpleHeader
        title="Perfil"
        subtitle="Configure sua meta calórica diária, altura e peso"
      />

      {loading ? (
        <p className="text-base-content/60">Carregando...</p>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit}
          className="card bg-base-100 shadow-sm max-w-2xl"
        >
          <div className="card-body gap-4">
            {error && (
              <div className="alert alert-error text-sm">{error}</div>
            )}

            {success && (
              <div className="alert alert-success text-sm flex justify-between items-center">
                <span>{success}</span>
                <Link to="/" className="btn btn-sm btn-ghost underline">
                  Voltar para o início
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Meta calórica diária (kcal)"
                htmlFor="profile-target-diet"
                error={fieldErrors.targetDietDaily}
              >
                <input
                  id="profile-target-diet"
                  type="number"
                  inputMode="numeric"
                  placeholder="Ex: 2000"
                  className={`input input-bordered w-full ${
                    fieldErrors.targetDietDaily ? 'input-error' : ''
                  }`}
                  value={targetDietDaily}
                  onChange={(e) => setTargetDietDaily(e.target.value)}
                  disabled={profile !== null}
                />
              </FormField>

              <FormField
                label="Nível de atividade"
                htmlFor="profile-activity"
                error={fieldErrors.levelActivity}
              >
                <select
                  id="profile-activity"
                  className={`select select-bordered w-full ${
                    fieldErrors.levelActivity ? 'select-error' : ''
                  }`}
                  value={levelActivity}
                  onChange={(e) => setLevelActivity(e.target.value as LevelActivity)}
                  disabled={profile !== null}
                >
                  {LEVEL_ACTIVITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Altura (cm)"
                htmlFor="profile-height"
                error={fieldErrors.height}
              >
                <input
                  id="profile-height"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="Ex: 175"
                  className={`input input-bordered w-full ${
                    fieldErrors.height ? 'input-error' : ''
                  }`}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  disabled={profile !== null}
                />
              </FormField>

              <FormField
                label="Peso (kg)"
                htmlFor="profile-weight"
                error={fieldErrors.weight}
              >
                <input
                  id="profile-weight"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="Ex: 70.5"
                  className={`input input-bordered w-full ${
                    fieldErrors.weight ? 'input-error' : ''
                  }`}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  disabled={profile !== null}
                />
              </FormField>
            </div>

            {profile === null ? (
              <div className="card-actions justify-end mt-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </div>
            ) : (
              <p className="text-xs text-base-content/60">
                Perfil cadastrado. A edição desses dados será habilitada no próximo requisito.
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
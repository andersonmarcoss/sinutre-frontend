export type LevelActivity =
  | 'SEDENTARIO'
  | 'LEVEMENTE_ATIVO'
  | 'MODERADAMENTE_ATIVO'
  | 'MUITO_ATIVO'
  | 'EXTREMAMENTE_ATIVO';

export const LEVEL_ACTIVITY_OPTIONS: { value: LevelActivity; label: string }[] = [
  { value: 'SEDENTARIO', label: 'Sedentário' },
  { value: 'LEVEMENTE_ATIVO', label: 'Levemente ativo' },
  { value: 'MODERADAMENTE_ATIVO', label: 'Moderadamente ativo' },
  { value: 'MUITO_ATIVO', label: 'Muito ativo' },
  { value: 'EXTREMAMENTE_ATIVO', label: 'Extremamente ativo' },
];

export interface Profile {
  targetDietDaily: number;
  levelActivity: LevelActivity;
  height: number;
  weight: number;
}

export type SaveProfilePayload = Profile;
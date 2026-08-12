import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const onboardingSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  age: z.coerce.number().min(13, 'Must be at least 13').max(120, 'Invalid age'),
  language: z.enum(['en', 'bn']),
  heightUnit: z.enum(['cm', 'ft']).default('ft'),
  weightUnit: z.enum(['kg', 'lbs']).default('kg'),
  
  // Height fields
  heightCm: z.coerce.number().optional(),
  heightFt: z.coerce.number().optional(),
  heightIn: z.coerce.number().optional(),
  
  // Weight fields
  weightKg: z.coerce.number().optional(),
  weightLbs: z.coerce.number().optional(),
  
  goals: z.enum(['lose_weight', 'build_muscle', 'stay_fit', 'gain_strength', 'improve_endurance', 'improve_flexibility']),
  workoutEnvironment: z.enum(['gym', 'home', 'outdoor']),
  workoutDaysPerWeek: z.coerce.number().min(2).max(7),
  
  dietaryPreferences: z.string().optional(),
  healthDisclaimerAccepted: z.boolean().default(true),
}).superRefine((data, ctx) => {
  if (data.heightUnit === 'cm') {
    if (!data.heightCm || data.heightCm <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Height is required',
        path: ['heightCm'],
      });
    }
  } else {
    if (!data.heightFt || data.heightFt <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Feet is required',
        path: ['heightFt'],
      });
    }
    if (data.heightIn === undefined || data.heightIn < 0 || data.heightIn >= 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Inches must be between 0 and 11',
        path: ['heightIn'],
      });
    }
  }

  if (data.weightUnit === 'kg') {
    if (!data.weightKg || data.weightKg <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weight is required',
        path: ['weightKg'],
      });
    }
  } else {
    if (!data.weightLbs || data.weightLbs <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weight is required',
        path: ['weightLbs'],
      });
    }
  }
});

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type OnboardingPayload = z.infer<typeof onboardingSchema>;

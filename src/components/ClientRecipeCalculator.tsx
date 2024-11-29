"use client";

import React from 'react';
import RecipeCalculator from './RecipeCalculator';

export default function ClientRecipeCalculator() {
  return (
    <div suppressHydrationWarning>
      <RecipeCalculator />
    </div>
  );
}
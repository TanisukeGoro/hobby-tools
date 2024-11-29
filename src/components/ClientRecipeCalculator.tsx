"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RecipeCalculator from './RecipeCalculator';

export default function ClientRecipeCalculator() {
  return (
    <div suppressHydrationWarning>
      <RecipeCalculator />
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const RecipeCalculator = () => {
  const [ingredients, setIngredients] = useState({
    'かぼちゃ': 0,
    'ミルク': 0,
    '小麦粉': 0,
    '卵': 0,
    'とうもろこし': 0,
    '水': 0,
    '秘伝調味料': 0,
    'バター': 0,
    'ターキー': 0,
    'サヤインゲン': 0,
    'ジャガイモ': 0,
    'クランベリー': 0
  });

  const recipes = {
    'ローストターキー': { '秘伝調味料': 1, 'バター': 1, 'ターキー': 2 },
    'とうもろこしパン': { '小麦粉': 1, '卵': 1, 'とうもろこし': 2 },
    'カボチャパイ': { 'かぼちゃ': 2, 'ミルク': 1, '小麦粉': 1 },
    'サヤインゲンの焼き物': { '水': 1, 'バター': 1, 'サヤインゲン': 2 },
    'マッシュポテト': { 'ミルク': 1, '卵': 1, 'ジャガイモ': 2 },
    'クランベリージャム': { '水': 1, '秘伝調味料': 1, 'クランベリー': 2 }
  };

  const [result, setResult] = useState(null);

  const calculateOptimalRecipes = () => {
    let maxDishes = {};
    let remainingIngredients = { ...ingredients };
    
    // 各料理の最大生産可能数を計算
    for (const [recipe, requirements] of Object.entries(recipes)) {
      let maxPossible = Infinity;
      let limitingIngredient = '';
      let requiredForNext = {};
      
      for (const [ingredient, amount] of Object.entries(requirements)) {
        const availableAmount = remainingIngredients[ingredient];
        const possibleDishes = Math.floor(availableAmount / amount);
        if (possibleDishes < maxPossible) {
          maxPossible = possibleDishes;
          limitingIngredient = ingredient;
        }
      }
      
      // 使用する材料を差し引く
      for (const [ingredient, amount] of Object.entries(requirements)) {
        remainingIngredients[ingredient] -= maxPossible * amount;
      }
      
      // 次の1品を作るために必要な追加材料を計算
      for (const [ing, amt] of Object.entries(requirements)) {
        if (remainingIngredients[ing] < amt) {
          requiredForNext[ing] = amt - remainingIngredients[ing];
        }
      }
      
      maxDishes[recipe] = {
        count: maxPossible,
        limitingIngredient,
        requiredForNext
      };
    }
    
    let ingredientUsage = {};
    for (const [recipe, data] of Object.entries(maxDishes)) {
      for (const [ingredient, amount] of Object.entries(recipes[recipe])) {
        if (!ingredientUsage[ingredient]) {
          ingredientUsage[ingredient] = 0;
        }
        ingredientUsage[ingredient] += amount * data.count;
      }
    }
    
    setResult({
      maxDishes,
      ingredientUsage,
      totalDishes: Object.values(maxDishes).reduce((sum, data) => sum + data.count, 0)
    });
  };

  const handleIngredientChange = (ingredient, value) => {
    setIngredients(prev => ({
      ...prev,
      [ingredient]: parseInt(value) || 0
    }));
  };

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardContent className="pt-4">
          <h2 className="text-xl font-bold mb-4">材料の数を入力</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(ingredients).map(([ingredient, amount]) => (
              <div key={ingredient}>
                <label className="block text-sm font-medium mb-1">{ingredient}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleIngredientChange(ingredient, e.target.value)}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <button
        onClick={calculateOptimalRecipes}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        計算する
      </button>

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-lg font-bold mb-3">最大生産可能数</h3>
              <div className="space-y-2">
                {Object.entries(result.maxDishes).map(([recipe, data]) => (
                  <div key={recipe} className="space-y-1">
                    <div className="flex justify-between">
                      <span>{recipe}:</span>
                      <span className="font-bold">{data.count}個</span>
                    </div>
                    {Object.entries(data.requiredForNext).length > 0 && (
                      <div className="text-sm text-gray-600 pl-4">
                        あと1品作るために必要な材料:
                        {Object.entries(data.requiredForNext).map(([ing, amt]) => (
                          <span key={ing} className="ml-1">
                            {ing} {amt}個
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-2 border-t mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold">合計料理数:</span>
                    <span className="font-bold">{result.totalDishes}個</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <h3 className="text-lg font-bold mb-3">材料の使用量と残数</h3>
              <div className="space-y-2">
                {Object.entries(ingredients).map(([ingredient, total]) => {
                  const usage = result.ingredientUsage[ingredient] || 0;
                  const remaining = total - usage;
                  return (
                    <div key={ingredient} className="flex justify-between">
                      <span>{ingredient}:</span>
                      <span>
                        使用: {usage}個 / 
                        所持: {total}個
                        <span className="ml-2 text-gray-500">
                          (残: {remaining}個)
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RecipeCalculator;
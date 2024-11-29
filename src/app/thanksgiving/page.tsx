import ClientRecipeCalculator from '@/components/ClientRecipeCalculator'

export default function ThanksgivingPage() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">感謝祭祝宴準備計算機</h1>
      <ClientRecipeCalculator />
    </main>
  )
}
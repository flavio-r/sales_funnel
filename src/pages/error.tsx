export function ErrorBoundary() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="font-semibold text-4xl">Erro inesperado!</p>
      <a href="/">Voltar para a home</a>
    </div>
  );
}

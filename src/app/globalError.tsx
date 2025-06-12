export default function GlobalError({error}: { error: string }) {
  return (
    <div className="flex flex-col items-center mt-[200px] h-screen">
      <h1 className="text-4xl">An error occurred</h1>
      <p className="text-lg">Please try again later</p>
      <details className="mt-4">
        <summary>Error Details</summary>
        <pre>{error}</pre>
      </details>
    </div>
  );
}

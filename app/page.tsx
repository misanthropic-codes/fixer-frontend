export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center sm:p-20">
      <main className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-25 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
          <h1 className="relative text-6xl font-bold tracking-tight text-white sm:text-8xl">
            fixxer
          </h1>
        </div>
        <p className="max-w-md text-xl font-light tracking-wide text-zinc-400 sm:text-2xl">
          Welcome to the future of development.
        </p>
      </main>
    </div>
  );
}

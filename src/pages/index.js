import Link from 'next/link'

export default function Home() {

  return <div className="flex gap-3 w-full">
    <Link href="/auth/login">
      <button>auth</button>
    </Link>
    <Link href="/secure">
      <button>secure</button>
    </Link>
    <div className="grow"></div>
    <h1>Эй все готово? гоу</h1>
  </div>
}

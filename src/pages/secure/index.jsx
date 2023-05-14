import { useMeQuery } from "../../services/auth/api"

export default function Secure() {

  const { data: session } = useMeQuery()
  return <pre className="prose lg:prose-xl">
    {JSON.stringify(session)}
    <h1 className="text-white">secure</h1>
  </pre>
}

Secure.auth = {
    roles: ["user"],
    verification: true,
    permissions: []
}

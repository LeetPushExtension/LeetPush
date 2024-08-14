export default function Welcome({ username }: { username: string }) {
  return (
    <div className="flex items-center justify-between px-6">
      <p className="text-lp-greyer text-lg font-semibold">
        Hi, <span className="text-lp-white">{username}</span>
      </p>

      <p className="text-lp-greyer">
        Total Solved: <span className="text-lp-white underline">189</span>
      </p>
    </div>
  )
}

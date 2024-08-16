interface WelcomeProps {
  username: string
  totalProblems: number | undefined
}

export default function Welcome({ username, totalProblems }: WelcomeProps) {
  return (
    <div className="flex items-center justify-between px-6">
      <p className="text-lp-greyer text-lg font-semibold">
        Hi, <span className="text-lp-white">{username}</span>
      </p>

      <p className="text-lp-greyer">
        Total
        Solved: <span className="text-lp-white underline">{totalProblems}</span>
      </p>
    </div>
  )
}

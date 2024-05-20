export default function Welcome({ leetCodeUsername }: { leetCodeUsername: string }) {
  return (
    <div className="mb-6 px-6 flex items-center justify-between">
      <p className="font-semibold text-xl text-lp-greyer">
        Hi, <span className="text-lp-white">{leetCodeUsername}</span>
      </p>
    </div>
  )
}

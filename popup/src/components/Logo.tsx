export default function Logo() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <img src="logo.png" alt="leetpush logo" width={30} height={30} />
      <h1 className="text-2xl font-bold">
        Leet<span className="text-lp-yellow">Push</span>
      </h1>
    </div>
  )
}

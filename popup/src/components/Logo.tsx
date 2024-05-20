export default function Logo() {
  return (
    <>
      <div className="text-center mb-4 select-none flex items-center justify-center gap-2">
        <img src="/icon.png"
             alt="logo"
             className="w-5"
        />
        <h1 className="font-bold text-2xl">
          Leet<span className="text-lp-yellow">Push</span>
        </h1>
      </div>
    </>
  );
}

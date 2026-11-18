const StatCard = ({ title, value, tone = "blue" }) => {
  const tones = {
    blue: "from-blue-500 to-cyan-500",
    emerald: "from-emerald-500 to-green-500",
    amber: "from-amber-500 to-orange-500",
    slate: "from-slate-600 to-slate-800",
  };

  return (
    <div
      className={`rounded-2xl p-4 text-white bg-gradient-to-br ${tones[tone] || tones.blue}`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default StatCard;

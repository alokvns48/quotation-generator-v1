const statusClasses = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status = "draft" }) => {
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || statusClasses.draft}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

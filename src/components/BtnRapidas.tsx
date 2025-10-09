interface btnProps {
  nome: string;
  bgColor?: string;
  onClick: () => void;
  icon: any;
}

export function BtnRapidas({
  nome,
  bgColor = "custom-green",
  onClick,
  icon,
}: btnProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between borderCustom bg-${bgColor} hover:scale-105 gap-2 px-6 py-3 rounded-md text-white font-semibold cursor-pointer hover:shadow-lg transition-all duration-300`}
    >
      <div className=" hidden bg-amber-500">a</div>
      <div className="flex items-center justify-center m-0 p-0">{icon}</div>
      <button className=" blindarScale border-none bg-transparent text-white text-xl font-semibold cursor-pointer hover:scale-105 transition-all duration-500">
        <span className="blindarScale">{nome}</span>
      </button>
    </div>
  );
}

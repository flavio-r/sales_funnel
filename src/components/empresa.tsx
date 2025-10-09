import { useState } from "react";
import { useEffect } from "react";
interface empresaProps {
  empresa: any;
  tipo: number;
  onClick?: () => void;
}

export function Empresa({ empresa, tipo }: empresaProps) {
  const [cor, setCor] = useState<string>("customGray");

  useEffect(() => {
    if (tipo % 2 === 0) {
      setCor("white");
    }
  }, [tipo]);
  return (
    <div
      className={`w-full flex justify-between gap-12 bg-${cor} box-border px-4 hover:bg-opacity-70 cursor-pointer`}
    >
      <p className="w-1/4">{empresa["Razao social"]}</p>
      <p className="w-1/4">{empresa["Endereco"]}</p>
      <p className="w-1/4">{empresa["Bairro"]}</p>
      <p className="w-1/4">{empresa["Capital social"]}</p>
    </div>
  );
}

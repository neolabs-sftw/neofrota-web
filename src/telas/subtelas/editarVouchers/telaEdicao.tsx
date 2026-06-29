import { useParams } from "react-router-dom";
import BaseTelas from "../../../componentes/baseTelas";
import EditPerfil from "../../../componentes/editPerfil";
import EditarVoucherFixo from "./fixo";
import EditarVoucherExtra from "./extra";
import EditarVoucherTurno from "./turno";

export default function EditarVoucher() {
  const { natureza } = useParams();

  return BaseTelas({
    conteudo: (
      <>
        <EditPerfil />
        {natureza === "Fixo" ? (
          <EditarVoucherFixo />
        ) : natureza === "Extra" ? (
          <EditarVoucherExtra />
        ) : (
          <EditarVoucherTurno />
        )}
      </>
    ),
  });
}

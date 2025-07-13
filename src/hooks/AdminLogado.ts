import { createContext, useContext } from "react";

interface admin_logado_type {
      id: string,
      nome: string,
      email: string,
      senha: string,
      foto_admin_operadora: string,
      funcao: string,
      status_admin_operadora: string,
      data_criacao : Date,
      operadora_id: {
        id: string,
        nome: string,
        slug: string, 
        logo_operadora: string,
        cnpj: string,
        r_social: string,
        end_rua: string,
        end_numero: string,
        end_bairro: string,
        end_cep: string,
        end_cidade: string,
        end_uf: string,
        status_operadora: string,
        data_criacao: string,
      }
    };

const AdminLogadoContext = createContext<admin_logado_type | null>(null);

export function useAdminLogado() {
  return useContext(AdminLogadoContext);
}

export default AdminLogadoContext.Provider;

import { createClient } from "@supabase/supabase-js";

// Real client initialization if keys exist in environment
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || "";
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || "";

const isRealSupabaseConfigured = supabaseUrl && supabaseUrl.startsWith("http") && supabaseKey;

export const supabaseRealInstance = isRealSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// ==========================================
// HIGH-FIDELITY OFFLINE EMULATOR FOR PREVIEW
// ==========================================

// Pre-seeded local list of professional profiles (perfis)
const DEFAULT_PERFIS = [
  { id: "1", nome: "Dra. Helenara Chaves", email: "helenara@institutoserclin.com", role: "admin", cor: "#1e3a8a" },
  { id: "2", nome: "Dra. Laura Mendes", email: "laura@institutoserclin.com", role: "profissional", cor: "#e11d48" },
  { id: "3", nome: "Dra. Maria Silva", email: "maria@institutoserclin.com", role: "secretaria", cor: "#10b981" },
  { id: "4", nome: "Dr. Fabio Santos", email: "fabio@institutoserclin.com", role: "profissional", cor: "#f59e0b" },
];

// Pre-seeded local list of patients (pacientes)
const DEFAULT_PACIENTES = [
  {
    id: "p1",
    nome: "Ana Carolina Souza",
    cpf: "123.456.789-00",
    responsavel_cpf: "",
    telefone: "(68) 99216-1717",
    convenio: "Bradesco Saúde",
    foto_url: "",
  },
  {
    id: "p2",
    nome: "Rodrigo Chaves",
    cpf: "987.654.321-11",
    responsavel_cpf: "123.456.789-00",
    telefone: "(11) 98888-7777",
    convenio: "Unimed",
    foto_url: "",
  }
];

// Pre-seeded local list of appointments (agendamentos)
const DEFAULT_AGENDAMENTOS = [
  {
    id: "ag-today-1",
    paciente_id: "p1",
    profissional_id: "1",
    profissional_nome: "Dra. Helenara Chaves",
    data_inicio: new Date().toISOString(), // Today!
    status: "Agendado",
    sala_id: 1,
    valor_atendimento: 150.00,
    forma_pagamento: "Pix"
  },
  {
    id: "ag-today-2",
    paciente_id: "p2",
    profissional_id: "2",
    profissional_nome: "Dra. Laura Mendes",
    data_inicio: new Date().toISOString(), // Today!
    status: "Agendado",
    sala_id: 2,
    valor_atendimento: 180.00,
    forma_pagamento: "Pix"
  }
];

// Pre-seeded despesas
const DEFAULT_DESPESAS = [
  { id: "d1", descricao: "Aluguel Clinica", recebedor: "Imobiliária Centenário", valor: 2500.00, data_vencimento: new Date().toISOString().split('T')[0], forma_pagamento: "Pix", status: "Pago", data_pagamento: new Date().toISOString().split('T')[0], categoria: "Aluguel" },
  { id: "d2", descricao: "Luz e Agua", recebedor: "Energisa", valor: 450.00, data_vencimento: new Date().toISOString().split('T')[0], forma_pagamento: "Pix", status: "Pendente", categoria: "Serviços" }
];

// Pre-seeded validacoes
const DEFAULT_VALIDACOES = [
  { id: "v1", paciente_nome: "Ana Carolina Souza", profissional_nome: "Dra. Helenara Chaves", created_at: new Date().toISOString() }
];

// Pre-seeded archives
const DEFAULT_ARQUIVOS = [
  {
    id: "doc-1",
    paciente_id: "p1",
    tipo_documento: "Avaliação Neuropsicológica",
    nome_arquivo: "Relatorio_Avaliacao_Ana_Carolina.pdf",
    url_arquivo: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 3).toISOString(),
  },
  {
    id: "doc-2",
    paciente_id: "p1",
    tipo_documento: "Laudo Fonoaudiológico",
    nome_arquivo: "Laudo_Linguagem_Voz_Ana.pdf",
    url_arquivo: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000 * 15).toISOString(),
  }
];

// Initialize local storage databases if they don't exist
const initLocalStorageDB = () => {
  if (!localStorage.getItem("serclin_db_perfis")) {
    localStorage.setItem("serclin_db_perfis", JSON.stringify(DEFAULT_PERFIS));
  }
  if (!localStorage.getItem("serclin_db_pacientes")) {
    localStorage.setItem("serclin_db_pacientes", JSON.stringify(DEFAULT_PACIENTES));
  }
  if (!localStorage.getItem("serclin_db_agendamentos")) {
    localStorage.setItem("serclin_db_agendamentos", JSON.stringify(DEFAULT_AGENDAMENTOS));
  }
  if (!localStorage.getItem("serclin_db_despesas")) {
    localStorage.setItem("serclin_db_despesas", JSON.stringify(DEFAULT_DESPESAS));
  }
  if (!localStorage.getItem("serclin_db_validacoes")) {
    localStorage.setItem("serclin_db_validacoes", JSON.stringify(DEFAULT_VALIDACOES));
  }
  if (!localStorage.getItem("serclin_db_arquivos")) {
    localStorage.setItem("serclin_db_arquivos", JSON.stringify(DEFAULT_ARQUIVOS));
  }
};

class MockQueryBuilder {
  private table: string;
  private filters: Array<(item: any) => boolean> = [];
  private currentOrder: { field: string; ascending: boolean } | null = null;
  private selectFields: string = "*";
  private updateValues: any = null;
  private isDelete: boolean = false;
  private isInsert: boolean = false;
  private insertValues: any = null;
  private maxLimit: number | null = null;
  private isSingle: boolean = false;

  constructor(table: string) {
    this.table = table;
    initLocalStorageDB();
  }

  select(fields: string = "*") {
    this.selectFields = fields;
    return this;
  }

  update(newValues: any) {
    this.updateValues = newValues;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  insert(values: any) {
    this.isInsert = true;
    this.insertValues = values;
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push((item) => {
      const dbVal = item[field];
      if (typeof dbVal === "string" && typeof value === "string") {
        return dbVal.trim().toLowerCase() === value.trim().toLowerCase();
      }
      return dbVal === value;
    });
    return this;
  }

  ilike(field: string, pattern: string) {
    const cleanPattern = pattern.replace(/%/g, "").toLowerCase().trim();
    this.filters.push((item) => {
      const dbVal = item[field];
      if (dbVal === null || dbVal === undefined) return false;
      return dbVal.toString().toLowerCase().includes(cleanPattern);
    });
    return this;
  }

  limit(num: number) {
    this.maxLimit = num;
    return this;
  }

  gte(field: string, value: any) {
    this.filters.push((item) => {
      const dbVal = item[field];
      if (dbVal === null || dbVal === undefined) return false;
      // Truncate to date comparison if they compare ISO strings with date strings
      const compA = typeof dbVal === "string" ? dbVal.substring(0, value.length) : dbVal;
      return compA >= value;
    });
    return this;
  }

  lte(field: string, value: any) {
    this.filters.push((item) => {
      const dbVal = item[field];
      if (dbVal === null || dbVal === undefined) return false;
      const compA = typeof dbVal === "string" ? dbVal.substring(0, value.length) : dbVal;
      return compA <= value;
    });
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    const asc = options?.ascending !== false;
    this.currentOrder = { field, ascending: asc };
    return this;
  }

  async upsert(values: any[], options?: any) {
    try {
      const rawData = localStorage.getItem(`serclin_db_${this.table}`) || "[]";
      let list = JSON.parse(rawData);

      const itemsToUpsert = Array.isArray(values) ? values : [values];

      for (const item of itemsToUpsert) {
        const existingIdx = list.findIndex((x: any) => x.id === item.id || (item.email && x.email === item.email));
        if (existingIdx > -1) {
          list[existingIdx] = { ...list[existingIdx], ...item };
        } else {
          list.push({ id: item.id || Math.random().toString(36).substr(2, 9), ...item });
        }
      }

      localStorage.setItem(`serclin_db_${this.table}`, JSON.stringify(list));
      return { data: list, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // Promise-like execution containing standard resolves
  async then(resolve: (value: { data: any[] | any | null; error: any | null }) => void) {
    try {
      const rawData = localStorage.getItem(`serclin_db_${this.table}`) || "[]";
      let list = JSON.parse(rawData);

      if (this.updateValues) {
        const updatedList = list.map((item: any) => {
          let matches = true;
          for (const filterFn of this.filters) {
            if (!filterFn(item)) matches = false;
          }
          if (matches) {
            return { ...item, ...this.updateValues };
          }
          return item;
        });

        localStorage.setItem(`serclin_db_${this.table}`, JSON.stringify(updatedList));
        resolve({ data: updatedList, error: null });
        return;
      }

      if (this.isDelete) {
        const remainingList = list.filter((item: any) => {
          let matches = true;
          for (const filterFn of this.filters) {
            if (!filterFn(item)) matches = false;
          }
          return !matches;
        });

        localStorage.setItem(`serclin_db_${this.table}`, JSON.stringify(remainingList));
        resolve({ data: remainingList, error: null });
        return;
      }

      if (this.isInsert && this.insertValues) {
        const itemsToInsert = Array.isArray(this.insertValues) ? this.insertValues : [this.insertValues];
        const newItems = itemsToInsert.map(x => ({
          id: x.id || Math.random().toString(36).substr(2, 9),
          ...x
        }));
        list = [...list, ...newItems];
        localStorage.setItem(`serclin_db_${this.table}`, JSON.stringify(list));
        resolve({ data: this.isSingle ? (newItems[0] || null) : newItems, error: null });
        return;
      }

      // Read / SELECT scenario
      let result = list;
      for (const filterFn of this.filters) {
        result = result.filter(filterFn);
      }

      if (this.currentOrder) {
        const { field, ascending } = this.currentOrder;
        result.sort((a: any, b: any) => {
          const valA = a[field] || "";
          const valB = b[field] || "";
          if (valA < valB) return ascending ? -1 : 1;
          if (valA > valB) return ascending ? 1 : -1;
          return 0;
        });
      }

      if (this.maxLimit !== null) {
        result = result.slice(0, this.maxLimit);
      }

      resolve({ data: this.isSingle ? (result[0] || null) : result, error: null });
    } catch (err) {
      resolve({ data: null, error: err });
    }
  }
}

// Stateful Mock Client
const mockSupabase = {
  from(table: string): any {
    return new MockQueryBuilder(table);
  },
  auth: {
    async signUp({ email, password, options }: any) {
      initLocalStorageDB();
      const rawData = localStorage.getItem("serclin_db_perfis") || "[]";
      const list = JSON.parse(rawData);

      const userExists = list.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return { data: { user: null }, error: { message: "User already registered" } };
      }

      const newUserId = Math.random().toString(36).substr(2, 10);
      const newUser = {
        id: newUserId,
        email: email.toLowerCase().trim(),
        nome: options?.data?.full_name || email.split("@")[0],
        role: "profissional",
        cor: "#3b82f6",
      };

      list.push(newUser);
      localStorage.setItem("serclin_db_perfis", JSON.stringify(list));

      const sessionUser = {
        id: newUserId,
        email,
        user_metadata: options?.data || {},
      };

      localStorage.setItem("serclin_session_user", JSON.stringify(sessionUser));

      return {
        data: {
          user: sessionUser,
        },
        error: null,
      };
    },
    async signInWithPassword({ email, password }: any) {
      initLocalStorageDB();
      const cleanEmail = email.toLowerCase().trim();
      const rawData = localStorage.getItem("serclin_db_perfis") || "[]";
      const list = JSON.parse(rawData);
      
      let userProfile = list.find((u: any) => u.email.toLowerCase().trim() === cleanEmail);
      
      if (!userProfile && (cleanEmail === "romulochaves77@gmail.com" || cleanEmail === "nahpsicologiachaves@gmail.com")) {
        userProfile = {
          id: Math.random().toString(36).substr(2, 10),
          email: cleanEmail,
          nome: cleanEmail === "romulochaves77@gmail.com" ? "Dr. Rômulo Chaves" : "Dra. Nahara Chaves",
          role: "admin",
          cor: "#0a2d54",
        };
        list.push(userProfile);
        localStorage.setItem("serclin_db_perfis", JSON.stringify(list));
      }

      if (!userProfile) {
        userProfile = {
          id: Math.random().toString(36).substr(2, 10),
          email: cleanEmail,
          nome: cleanEmail.split("@")[0].toUpperCase(),
          role: "profissional",
          cor: "#4f46e5"
        };
        list.push(userProfile);
        localStorage.setItem("serclin_db_perfis", JSON.stringify(list));
      }

      const sessionUser = {
        id: userProfile.id,
        email: userProfile.email,
        user_metadata: { full_name: userProfile.nome }
      };

      localStorage.setItem("serclin_session_user", JSON.stringify(sessionUser));
      return { data: { user: sessionUser }, error: null };
    },
    async getUser() {
      initLocalStorageDB();
      const stored = localStorage.getItem("serclin_session_user");
      if (stored) {
        return { data: { user: JSON.parse(stored) }, error: null };
      }
      return { data: { user: null }, error: null };
    },
    async signOut() {
      localStorage.removeItem("serclin_session_user");
      return { error: null };
    },
    async resetPasswordForEmail(email: string, options?: any) {
      console.log(`[Mock Auth] Reset password email scheduled for ${email}`);
      return { data: {}, error: null };
    },
  },
};

// Export typed client
export const supabase = isRealSupabaseConfigured && supabaseRealInstance
  ? (supabaseRealInstance as any)
  : (mockSupabase as any);

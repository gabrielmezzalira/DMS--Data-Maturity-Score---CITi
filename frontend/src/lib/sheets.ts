import type { SubmissionRecord } from "./supabase";
import type { IntakeData } from "../types/quiz";

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL as string;
const DMS_TOKEN = import.meta.env.VITE_DMS_TOKEN as string;

export async function submitToSheets(intake: IntakeData, retries = 2): Promise<boolean> {
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      // text/plain evita o preflight OPTIONS, que o Apps Script Web App não trata
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ ...intake, token: DMS_TOKEN }),
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 800));
      return submitToSheets(intake, retries - 1);
    }
    console.error("Falha ao enviar lead para Sheets:", err);
    return false;
  }
}

// Resultado completo do diagnóstico (respostas + score por pilar), gravado
// na aba DMS_Resultados. Enquanto o Supabase estiver fora do ar, essa é a
// única cópia persistida das respostas do cliente.
export async function submitResultToSheets(record: SubmissionRecord, retries = 2): Promise<boolean> {
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ ...record, tipo: "dms_resultado", token: DMS_TOKEN }),
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 800));
      return submitResultToSheets(record, retries - 1);
    }
    console.error("Falha ao gravar resultado do DMS no Sheets:", err);
    return false;
  }
}

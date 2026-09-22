import { z } from "zod";

export const intakeSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome"),
  email: z.string().trim().email("E-mail inválido"),
  telefone: z
    .string()
    .trim()
    .min(8, "Telefone inválido")
    .regex(/^[0-9()+\-\s]+$/, "Telefone inválido"),
  empresa: z.string().trim().min(2, "Informe o nome da empresa"),
  cargo: z.string().trim().min(2, "Informe seu cargo"),
  setor: z.string().min(1, "Selecione um setor"),
  porte: z.string().min(1, "Selecione o porte da empresa"),
});

export type IntakeFormErrors = Partial<Record<keyof z.infer<typeof intakeSchema>, string>>;

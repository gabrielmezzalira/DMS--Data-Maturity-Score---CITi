from statistics import mean

INFRAESTRUTURA = ["q1", "q2", "q3"]
GOVERNANCA = ["q4", "q5", "q6"]
CULTURA = ["q7", "q8"]
IA = [f"q{i}" for i in range(9, 21)]


def _map_to_level(avg: float) -> int:
    if avg < 1.50:
        return 1
    if avg < 2.25:
        return 2
    if avg < 3.00:
        return 3
    if avg < 3.60:
        return 4
    return 5


def calculate(responses: dict[str, int]) -> dict:
    avg_infra = mean(responses[q] for q in INFRAESTRUTURA)
    avg_gov = mean(responses[q] for q in GOVERNANCA)
    avg_cultura = mean(responses[q] for q in CULTURA)
    avg_ia = mean(responses[q] for q in IA)

    nivel_infraestrutura = _map_to_level(avg_infra)
    nivel_governanca = _map_to_level(avg_gov)
    nivel_cultura = _map_to_level(avg_cultura)
    nivel_ia = _map_to_level(avg_ia)

    nivel_fundacao = min(nivel_infraestrutura, nivel_governanca)

    # Pesos proporcionais ao número de perguntas: 2 de cultura, 12 de IA
    avg_prontidao = (2 * avg_cultura + 12 * avg_ia) / 14
    nivel_prontidao = _map_to_level(avg_prontidao)

    nivel_final = min(nivel_fundacao, nivel_prontidao)

    red_flags = _compute_red_flags(responses, nivel_fundacao)

    return {
        "nivel_infraestrutura": nivel_infraestrutura,
        "nivel_governanca": nivel_governanca,
        "nivel_cultura": nivel_cultura,
        "nivel_ia": nivel_ia,
        "nivel_fundacao": nivel_fundacao,
        "nivel_prontidao": nivel_prontidao,
        "nivel_final": nivel_final,
        "red_flags": red_flags,
    }


def _compute_red_flags(responses: dict[str, int], nivel_fundacao: int) -> list[str]:
    flags: list[str] = []
    if responses.get("q3") == 1:
        flags.append("RF_LGPD")
    if responses.get("q4") == 1:
        flags.append("RF_SEM_DONO")
    return flags

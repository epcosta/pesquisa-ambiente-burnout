export type Option = { value: number; label: string };
export type Question = { name: string; text: string; options?: Option[] };

export const profileQuestions: Question[] = [
  {
    "name": "inf_perfil",
    "text": "PERFIL - Eu sou:",
    "options": [
      {
        "value": 1,
        "label": "Enfermeiro"
      },
      {
        "value": 2,
        "label": "Técnico de enfermagem"
      },
      {
        "value": 3,
        "label": "Auxiliar de enfermagem"
      }
    ]
  },
  {
    "name": "inf_tempo_formacao_area_enfermagem",
    "text": "Tempo de formação na área de enfermagem:",
    "options": [
      {
        "value": 1,
        "label": "0 a 1 ano incompleto"
      },
      {
        "value": 2,
        "label": "1 a 3 anos incompletos"
      },
      {
        "value": 3,
        "label": "3 a 5 anos incompletos"
      },
      {
        "value": 4,
        "label": "5 a 10 anos incompletos"
      },
      {
        "value": 5,
        "label": "10 ou mais anos de formação"
      }
    ]
  },
  {
    "name": "inf_titulo_graduacao",
    "text": "Títulos após a graduação:",
    "options": [
      {
        "value": 1,
        "label": "Especialização em enfermagem"
      },
      {
        "value": 2,
        "label": "Mestrado"
      },
      {
        "value": 3,
        "label": "Doutorado e Pós Doutorado"
      },
      {
        "value": 4,
        "label": "Não fez cursos de especialização, mestrado ou doutorado após a graduação"
      }
    ]
  },
  {
    "name": "inf_cargo_enfermeiro",
    "text": "Cargo:",
    "options": [
      {
        "value": 1,
        "label": "Gestão (Gerência, Coordenação ou Supervisão de Enfermagem)"
      },
      {
        "value": 2,
        "label": "Administrativo"
      },
      {
        "value": 3,
        "label": "Assistencial"
      }
    ]
  },
  {
    "name": "inf_cargo_tecnico",
    "text": "Cargo:",
    "options": [
      {
        "value": 1,
        "label": "Administrativo"
      },
      {
        "value": 2,
        "label": "Assistencial"
      }
    ]
  },
  {
    "name": "inf_tempo_trabalho_instituicao",
    "text": "Tempo que trabalha nesta instituição:",
    "options": [
      {
        "value": 1,
        "label": "0 a 1 ano incompleto"
      },
      {
        "value": 2,
        "label": "1 a 3 anos incompletos"
      },
      {
        "value": 3,
        "label": "3 a 5 anos incompletos"
      },
      {
        "value": 4,
        "label": "5 ou mais anos"
      }
    ]
  },
  {
    "name": "inf_tempo_trabalho_cargo",
    "text": "Tempo que trabalha no CARGO ATUAL nesta instituição:",
    "options": [
      {
        "value": 1,
        "label": "0 a 1 ano incompleto"
      },
      {
        "value": 2,
        "label": "1 a 3 anos incompletos"
      },
      {
        "value": 3,
        "label": "3 a 5 anos incompletos"
      },
      {
        "value": 4,
        "label": "5 ou mais anos"
      }
    ]
  },
  {
    "name": "inf_area_trabalho",
    "text": "Área de trabalho:",
    "options": [
      {
        "value": 1,
        "label": "Bloco cirúrgico (Centro Cirúrgico e Obstétrico, Central de Materiais e Esterilização, Agendamento cirúrgico)"
      },
      {
        "value": 2,
        "label": "Unidades de Terapia Intensiva (Adulto, pediátrica, queimados, neonatal e unidade coronariana)"
      },
      {
        "value": 3,
        "label": "Unidade de Internação (adulto, pediátrica, hospital dia, queimados, oncológicos, maternidade e ou alojamento conjunto)"
      },
      {
        "value": 4,
        "label": "Administrativa (cuidados paleativos, educação continuada, TI, SAME, Faturamento, SCIH, SESMT, Qualidade, Auditoria, Educação, Gestão de leitos)"
      },
      {
        "value": 5,
        "label": "Atendimento ambulatorial (ambulatório, dermatoterapia, centro clínico, quimioterapia e SUS)"
      },
      {
        "value": 6,
        "label": "Apoio diagnóstico (Imagem, Hemodinâmica, Métodos Gráficos, Endoscopia e Colonoscopia, anatomia patológica e hemodiálise)"
      },
      {
        "value": 7,
        "label": "Urgência e Emergência (adulto, infantil, ginecológico e obstétrico)"
      }
    ]
  },
  {
    "name": "inf_escala_trabalho",
    "text": "Escala de Trabalho:",
    "options": [
      {
        "value": 1,
        "label": "12 X 36"
      },
      {
        "value": 2,
        "label": "6 X 1"
      },
      {
        "value": 3,
        "label": "12 x 60"
      },
      {
        "value": 4,
        "label": "8 horas/dia (44 hs semanais)"
      }
    ]
  },
  {
    "name": "inf_turno_trabalho",
    "text": "Turno de trabalho:",
    "options": [
      {
        "value": 1,
        "label": "Matutino"
      },
      {
        "value": 2,
        "label": "Vespertino"
      },
      {
        "value": 3,
        "label": "Noturno"
      },
      {
        "value": 4,
        "label": "Administrativo"
      }
    ]
  },
  {
    "name": "inf_outro_vinculo",
    "text": "Possui outro vínculo empregatício:",
    "options": [
      {
        "value": 1,
        "label": "Sim"
      },
      {
        "value": 2,
        "label": "Não"
      }
    ]
  }
];

export const pesnwiQuestions: Question[] = [
  {
    "name": "pesnwi_01",
    "text": "1. Os serviços de apoio são adequados e me permitem dedicar tempo aos pacientes."
  },
  {
    "name": "pesnwi_02",
    "text": "2. Equipe médica e de enfermagem possuem boas relações de trabalho"
  },
  {
    "name": "pesnwi_03",
    "text": "3. A equipe de supervisores ou coordenadores da unidade dá suporte à enfermagem."
  },
  {
    "name": "pesnwi_04",
    "text": "4. Existe um desenvolvimento ativo da equipe ou programas de educação continuada para a enfermagem."
  },
  {
    "name": "pesnwi_05",
    "text": "5. Nesta instituição existe oportunidade de desenvolvimento na carreira profissional."
  },
  {
    "name": "pesnwi_06",
    "text": "6. Nesta instituição há oportunidade para os enfermeiros participarem das decisões administrativas."
  },
  {
    "name": "pesnwi_07",
    "text": "7. Os supervisores ou coordenadores utilizam os erros como oportunidades de aprendizagem e não como críticas."
  },
  {
    "name": "pesnwi_08",
    "text": "8. Há tempo e oportunidade suficientes para discutir com outros enfermeiros os problemas relacionados aos cuidados do paciente."
  },
  {
    "name": "pesnwi_09",
    "text": "9. O número de profissionais na equipe de enfermagem é suficiente para proporcionar aos pacientes um cuidado de qualidade."
  },
  {
    "name": "pesnwi_10",
    "text": "10. O gerente de enfermagem é um bom administrador e líder."
  },
  {
    "name": "pesnwi_11",
    "text": "11. O gerente de enfermagem é acessível e sempre presente para a equipe"
  },
  {
    "name": "pesnwi_12",
    "text": "12. Há equipe de enfermagem suficiente para realizar o trabalho."
  },
  {
    "name": "pesnwi_13",
    "text": "13. Há reconhecimento e elogio por um trabalho bem feito."
  },
  {
    "name": "pesnwi_14",
    "text": "14. Altos padrões de cuidados são esperados pela administração da enfermagem."
  },
  {
    "name": "pesnwi_15",
    "text": "15. O gerente de enfermagem tem o mesmo poder e autoridade que outros gerentes/diretores da alta administração do hospital."
  },
  {
    "name": "pesnwi_16",
    "text": "16. A enfermagem e os médicos trabalham bem em equipe"
  },
  {
    "name": "pesnwi_17",
    "text": "17. Há oportunidades de aperfeiçoamento."
  },
  {
    "name": "pesnwi_18",
    "text": "18. Há uma filosofia de enfermagem clara que permeia o ambiente de cuidado ao paciente."
  },
  {
    "name": "pesnwi_19",
    "text": "19. Trabalho com enfermeiros clinicamente competentes."
  },
  {
    "name": "pesnwi_20",
    "text": "20. O supervisor ou coordenador de enfermagem da unidade dá suporte à sua equipe, em suas decisões, mesmo que conflitem com as do médico."
  },
  {
    "name": "pesnwi_21",
    "text": "21. A administração da instituição ouve e responde às preocupações dos trabalhadores."
  },
  {
    "name": "pesnwi_22",
    "text": "22. Existe um programa ativo de garantia da qualidade."
  },
  {
    "name": "pesnwi_23",
    "text": "23. Os enfermeiros são envolvidos na direção interna do hospital (como por exemplo, nos comitês de normas e de práticas clínicas)."
  },
  {
    "name": "pesnwi_24",
    "text": "24. Existe colaboração (prática conjunta) entre as equipes médica e enfermagem."
  },
  {
    "name": "pesnwi_25",
    "text": "25. Existe um programa de acompanhamento / tutoria dos profissionais de enfermagem recém-contratados."
  },
  {
    "name": "pesnwi_26",
    "text": "26. O cuidado de enfermagem é baseado mais em modelos de enfermagem do que em modelos médicos."
  },
  {
    "name": "pesnwi_27",
    "text": "27. Os enfermeiros têm oportunidade de participar de comissões do hospital e de enfermagem."
  },
  {
    "name": "pesnwi_28",
    "text": "28. O supervisor ou coordenador de enfermagem da unidade consulta a equipe sobre os procedimentos e problemas do dia a dia."
  },
  {
    "name": "pesnwi_29",
    "text": "29. Existem planos de cuidado de enfermagem escritos e atualizados para todos os pacientes."
  },
  {
    "name": "pesnwi_30",
    "text": "30. A designação de pacientes promove a continuidade do cuidado (isto é: um mesmo profissional de enfermagem cuida dos mesmos pacientes em dias consecutivos)."
  },
  {
    "name": "pesnwi_31",
    "text": "31. Utilizam diagnósticos de enfermagem"
  }
];

export const burnoutQuestions: Question[] = [
  {
    "name": "burnout_01",
    "text": "1. Eu me sinto emocionalmente exausto pelo meu trabalho."
  },
  {
    "name": "burnout_02",
    "text": "2. Eu me sinto esgotado ao final de um dia de trabalho."
  },
  {
    "name": "burnout_03",
    "text": "3. Eu me sinto cansado quando me levanto de manhã e tenho que encarar outro dia de trabalho."
  },
  {
    "name": "burnout_04",
    "text": "4. Eu posso entender facilmente o que sentem os meus pacientes acerca das coisas que acontecem no dia a dia."
  },
  {
    "name": "burnout_05",
    "text": "5. Eu sinto que eu trato alguns pacientes como se eles fossem objetos."
  },
  {
    "name": "burnout_06",
    "text": "6. Trabalhar com pessoas o dia inteiro é realmente um grande esforço para mim."
  },
  {
    "name": "burnout_07",
    "text": "7. Eu trato de forma adequada os problemas dos meus pacientes."
  },
  {
    "name": "burnout_08",
    "text": "8. Eu me sinto esgotado com meu trabalho."
  },
  {
    "name": "burnout_09",
    "text": "9. Eu sinto que estou influenciando positivamente a vida de outras pessoas através do meu trabalho."
  },
  {
    "name": "burnout_10",
    "text": "10. Eu sinto que me tornei mais insensível com as pessoas desde que comecei este trabalho."
  },
  {
    "name": "burnout_11",
    "text": "11. Eu sinto que este trabalho está me endurecendo emocionalmente."
  },
  {
    "name": "burnout_12",
    "text": "12. Eu me sinto muito cheio de energia."
  },
  {
    "name": "burnout_13",
    "text": "13. Eu me sinto muito frustrado com meu trabalho."
  },
  {
    "name": "burnout_14",
    "text": "14. Eu sinto que estou trabalhando demais no meu emprego."
  },
  {
    "name": "burnout_15",
    "text": "15. Eu não me importo realmente com o que acontece com alguns dos meus pacientes."
  },
  {
    "name": "burnout_16",
    "text": "16. Trabalhar diretamente com pessoas me muito deixa estressado."
  },
  {
    "name": "burnout_17",
    "text": "17. Eu posso criar facilmente um ambiente tranquilo com os meus pacientes."
  },
  {
    "name": "burnout_18",
    "text": "18. Eu me sinto estimulado depois de trabalhar lado a lado com os meus pacientes."
  },
  {
    "name": "burnout_19",
    "text": "19. Eu tenho realizado muitas coisas importantes neste trabalho."
  },
  {
    "name": "burnout_20",
    "text": "20. No meu trabalho, eu me sinto como se estivesse no final do meu limite."
  },
  {
    "name": "burnout_21",
    "text": "21. No meu trabalho, eu lido com os problemas emocionais com calma."
  },
  {
    "name": "burnout_22",
    "text": "22. Eu sinto que os pacientes me culpam por alguns dos seus problemas."
  }
];

export const pesnwiOptions: Option[] = [{value:1,label:"Discordo totalmente"},{value:2,label:"Discordo"},{value:3,label:"Concordo"},{value:4,label:"Concordo totalmente"}];
export const burnoutOptions: Option[] = [{value:1,label:"Nunca"},{value:2,label:"Raramente"},{value:3,label:"Algumas vezes"},{value:4,label:"Frequentemente"},{value:5,label:"Sempre"}];

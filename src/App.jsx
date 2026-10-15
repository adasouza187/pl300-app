import { useEffect, useState } from "react";

const STORAGE_KEY = "pl300-prep-progress";

const tracks = [
  {
    id: "data",
    icon: "◈",
    title: "Preparar os dados",
    subtitle: "Power Query e qualidade dos dados",
    color: "blue",
    lessons: [
      ["Conectar às fontes", "Importação, DirectQuery, arquivos, bancos de dados e serviços."],
      ["Transformar e limpar", "Tipos de dados, remoção de erros, preenchimento e divisão de colunas."],
      ["Combinar consultas", "Mesclar, acrescentar e entender quando usar cada operação."],
      ["Aplicar boas práticas", "Etapas claras, consultas reutilizáveis e redução de dados desnecessários."]
    ]
  },
  {
    id: "model",
    icon: "⌘",
    title: "Modelar os dados",
    subtitle: "Relacionamentos, medidas e DAX",
    color: "violet",
    lessons: [
      ["Projetar o modelo", "Esquema estrela, tabelas fato, dimensões e granularidade."],
      ["Criar relacionamentos", "Cardinalidade, direção de filtro e relacionamento ativo."],
      ["Usar cálculos", "Diferenças entre coluna calculada, medida e tabela calculada."],
      ["Escrever DAX", "Contexto de linha, contexto de filtro e funções comuns de análise."]
    ]
  },
  {
    id: "visuals",
    icon: "▥",
    title: "Visualizar e analisar",
    subtitle: "Relatórios, interação e insights",
    color: "amber",
    lessons: [
      ["Escolher visuais", "Selecionar gráficos que respondam à pergunta de negócio."],
      ["Criar interações", "Filtros, segmentações, drill-through e detalhamento."],
      ["Melhorar a experiência", "Acessibilidade, navegação, títulos e layout."],
      ["Analisar tendências", "Análises visuais, linhas de referência e explicações dos dados."]
    ]
  },
  {
    id: "deploy",
    icon: "⬆",
    title: "Implantar e manter",
    subtitle: "Publicação, segurança e atualização",
    color: "emerald",
    lessons: [
      ["Publicar conteúdo", "Workspaces, aplicativos e organização de artefatos."],
      ["Atualizar dados", "Atualização agendada, credenciais e gateway."],
      ["Controlar acesso", "Funções no workspace e segurança em nível de linha."],
      ["Monitorar e distribuir", "Permissões, compartilhamento e acompanhamento do uso."]
    ]
  }
];

const questions = [
  {
    q: "Você precisa combinar linhas de duas consultas com as mesmas colunas. Qual operação do Power Query é mais apropriada?",
    options: ["Mesclar consultas", "Acrescentar consultas", "Agrupar por", "Transpor"],
    answer: 1,
    explanation: "Acrescentar consultas empilha linhas de uma tabela abaixo das linhas de outra. Mesclar combina colunas usando uma chave."
  },
  {
    q: "Em um modelo estrela, qual é o papel mais comum de uma tabela dimensão?",
    options: [
      "Armazenar medidas agregadas do relatório",
      "Descrever entidades usadas para filtrar e agrupar fatos",
      "Substituir todas as relações do modelo",
      "Executar a atualização agendada"
    ],
    answer: 1,
    explanation: "Dimensões descrevem entidades, como produto, cliente e data, e ajudam a filtrar e agrupar os dados da tabela fato."
  },
  {
    q: "Qual recurso é adequado para restringir, por usuário, as linhas que podem ser consultadas em um modelo semântico?",
    options: ["Tema do relatório", "Indicador", "Segurança em nível de linha (RLS)", "Marcador"],
    answer: 2,
    explanation: "A RLS define regras que limitam as linhas visíveis para diferentes usuários ou funções."
  },
  {
    q: "Você quer que um valor seja calculado conforme os filtros aplicados ao relatório. Qual opção costuma ser mais apropriada?",
    options: ["Medida", "Coluna de índice", "Parâmetro de arquivo", "Etapa de renomeação"],
    answer: 0,
    explanation: "Uma medida é avaliada no contexto de filtro atual, por isso é geralmente indicada para cálculos dinâmicos em visuais."
  },
  {
    q: "Qual recurso permite que o leitor selecione um valor e filtre os visuais de uma página?",
    options: ["Segmentação de dados", "Gateway", "Consulta nativa", "Pasta de trabalho"],
    answer: 0,
    explanation: "A segmentação de dados é um visual interativo usado para filtrar os dados exibidos."
  },
  {
    q: "Qual é uma diferença importante entre uma coluna calculada e uma medida?",
    options: [
      "A coluna é avaliada por linha e armazenada no modelo; a medida é calculada conforme o contexto da consulta",
      "A medida só funciona no Power Query",
      "A coluna sempre atualiza em tempo real",
      "Não há diferença"
    ],
    answer: 0,
    explanation: "Colunas calculadas são avaliadas linha a linha durante o processamento; medidas são avaliadas quando consultadas, considerando filtros."
  },
  {
    q: "Ao combinar tabelas por uma chave correspondente, qual operação do Power Query você deve considerar?",
    options: ["Acrescentar", "Mesclar", "Transpor", "Despivotar"],
    answer: 1,
    explanation: "Mesclar consultas associa tabelas por uma ou mais colunas-chave e permite trazer colunas da tabela relacionada."
  },
  {
    q: "Qual recurso é normalmente necessário para atualizar no serviço dados de uma fonte local que não está acessível diretamente pela nuvem?",
    options: ["Gateway de dados", "Marcador pessoal", "Tema personalizado", "Rótulo de confidencialidade"],
    answer: 0,
    explanation: "Um gateway pode permitir que o serviço Power BI acesse fontes de dados locais para operações como atualização."
  },
    {
    q: "Qual é a principal diferença entre os modos Importação e DirectQuery?",
    options: [
      "Na Importação, os dados são carregados no modelo; no DirectQuery, as consultas acessam a fonte de dados",
      "DirectQuery só pode ser usado com arquivos CSV",
      "Importação exige um gateway em todos os casos",
      "Não há diferença entre os modos"
    ],
    answer: 0,
    explanation: "Na Importação, os dados são carregados no modelo do Power BI. No DirectQuery, o modelo consulta a fonte quando os dados são solicitados."
  },
  {
    q: "Em um relacionamento típico de esquema estrela, qual tabela costuma ficar no lado 'um' de uma relação um-para-muitos?",
    options: [
      "A tabela fato, com várias linhas por entidade",
      "A tabela dimensão, com uma linha por entidade",
      "A tabela de medidas",
      "A tabela de relatório"
    ],
    answer: 1,
    explanation: "Uma dimensão normalmente contém uma linha por entidade, como produto ou cliente, e se relaciona com várias linhas da tabela fato."
  },
  {
    q: "Em um modelo estrela, qual direção de filtro costuma ser preferível para relacionamentos entre dimensão e fato?",
    options: [
      "Da tabela fato para todas as dimensões, sempre",
      "Em ambas as direções para todos os relacionamentos",
      "Da dimensão para a tabela fato, quando adequada ao modelo",
      "Nenhuma direção de filtro"
    ],
    answer: 2,
    explanation: "Em modelos estrela, a filtragem da dimensão para a tabela fato costuma ser mais simples de entender e ajuda a evitar ambiguidades."
  },
  {
    q: "Qual função DAX é usada para avaliar uma expressão em um contexto de filtro modificado?",
    options: [
      "CALCULATE",
      "FORMAT",
      "RELATED",
      "COUNT"
    ],
    answer: 0,
    explanation: "CALCULATE avalia uma expressão após modificar o contexto de filtro, sendo uma das funções centrais do DAX."
  },
  {
    q: "Qual função DAX é uma boa opção para fazer uma divisão e definir um resultado alternativo quando o denominador é zero?",
    options: [
      "SUM",
      "COUNTROWS",
      "RELATED",
      "DIVIDE"
    ],
    answer: 3,
    explanation: "DIVIDE permite informar um resultado alternativo para casos em que o denominador é zero ou vazio."
  },
  {
    q: "No Power Query, você percebe que uma coluna numérica foi importada como texto. O que deve fazer?",
    options: [
      "Criar um marcador no relatório",
      "Alterar o tipo de dados da coluna",
      "Criar uma função RLS",
      "Publicar o relatório novamente sem alterações"
    ],
    answer: 1,
    explanation: "O tipo de dados deve corresponder ao conteúdo da coluna. Corrigi-lo no Power Query ajuda a evitar erros em cálculos e visualizações."
  },
  {
    q: "Você precisa remover registros repetidos com base em uma coluna identificadora durante a preparação dos dados. Onde pode fazer isso?",
    options: [
      "No painel de filtros do relatório",
      "Nas configurações do workspace",
      "No Power Query, usando a remoção de duplicatas",
      "No menu de publicação"
    ],
    answer: 2,
    explanation: "O Power Query oferece a operação de remoção de duplicatas. É importante escolher corretamente as colunas que definem um registro duplicado."
  },
  {
    q: "Qual recurso permite variar a cor de um visual de acordo com o valor apresentado?",
    options: [
      "Formatação condicional",
      "Gateway de dados",
      "Relação inativa",
      "Atualização incremental"
    ],
    answer: 0,
    explanation: "A formatação condicional pode alterar cores e outros elementos visuais com base em valores ou regras."
  },
  {
    q: "Você quer permitir que o usuário clique com o botão direito em um ponto de dados e abra uma página com detalhes daquele contexto. Qual recurso pode atender a esse objetivo?",
    options: [
      "Segmentação de dados",
      "Drill-through",
      "Gateway",
      "Coluna calculada"
    ],
    answer: 1,
    explanation: "O drill-through permite navegar para uma página de detalhes filtrada pelo contexto selecionado no relatório."
  },
  {
    q: "Qual função de workspace normalmente permite visualizar conteúdo, mas não editar itens?",
    options: [
      "Administrador",
      "Membro",
      "Colaborador",
      "Visualizador"
    ],
    answer: 3,
    explanation: "A função Visualizador é destinada a usuários que precisam consumir o conteúdo do workspace sem ter permissões de edição."
  },
  {
    q: "Qual recurso pode ajudar a reduzir o volume de dados atualizado em modelos grandes, atualizando apenas períodos ou partições necessários?",
    options: [
      "Marcadores",
      "Temas do relatório",
      "Atualização incremental",
      "Formatação condicional"
    ],
    answer: 2,
    explanation: "A atualização incremental pode atualizar partes selecionadas dos dados, conforme a configuração e os requisitos da fonte."
  },
  {
    q: "Em uma estratégia de RLS dinâmica, qual informação pode ser usada em uma expressão DAX para identificar o usuário conectado?",
    options: [
      "SELECTEDMEASURE()",
      "USERPRINCIPALNAME()",
      "RELATEDTABLE()",
      "FORMAT()"
    ],
    answer: 1,
    explanation: "USERPRINCIPALNAME() retorna o nome principal do usuário conectado e pode ser usado em regras de RLS dinâmica, quando o modelo está configurado adequadamente."
  },
    {
    q: "Você está criando um relatório com um conjunto de dados pequeno e precisa que os dados sejam carregados no modelo do Power BI. Qual modo de armazenamento costuma ser apropriado?",
    options: ["Importação", "DirectQuery obrigatório", "Conexão ao vivo obrigatória", "Pasta de trabalho"],
    answer: 0,
    explanation: "No modo Importação, os dados são carregados no modelo do Power BI. É uma opção comum quando o volume e os requisitos de atualização permitem."
  },
  {
    q: "O que significa query folding no Power Query?",
    options: ["Converter uma tabela em gráfico", "Enviar transformações compatíveis para serem executadas pela fonte de dados", "Criptografar as consultas", "Combinar automaticamente todas as tabelas"],
    answer: 1,
    explanation: "Quando há query folding, o Power Query traduz transformações para uma consulta executada pela fonte, o que pode melhorar o desempenho."
  },
  {
    q: "Uma coluna contém várias linhas repetidas, mas você precisa manter apenas uma ocorrência de cada valor. Qual ação pode ajudar?",
    options: ["Remover duplicatas", "Acrescentar consultas", "Transpor", "Agrupar por data"],
    answer: 0,
    explanation: "Remover duplicatas mantém uma ocorrência de cada valor ou combinação selecionada."
  },
  {
    q: "Uma tabela tem uma coluna para cada mês, mas você precisa que os meses apareçam em linhas. Qual transformação do Power Query é adequada?",
    options: ["Mesclar colunas", "Anular dinamização de colunas", "Acrescentar consultas", "Manter erros"],
    answer: 1,
    explanation: "Anular dinamização, também chamada de despivotar, transforma colunas em linhas e costuma ser útil para preparar dados tabulares."
  },
  {
    q: "Para que serve principalmente um parâmetro no Power Query?",
    options: ["Definir um valor reutilizável que pode influenciar consultas", "Criar uma medida DAX automaticamente", "Dar acesso a um workspace", "Criar uma página de relatório"],
    answer: 0,
    explanation: "Parâmetros armazenam valores que podem ser reutilizados em consultas, por exemplo, um caminho ou valor usado em uma transformação."
  },
  {
    q: "No Power Query, qual recurso ajuda a inspecionar valores válidos, vazios e com erro em uma coluna?",
    options: ["Perfil da coluna", "Marcadores", "Painel de seleção", "Modo de foco"],
    answer: 0,
    explanation: "As ferramentas de perfil de dados ajudam a avaliar a qualidade e a distribuição dos valores das colunas."
  },
  {
    q: "Em um esquema estrela típico, como uma tabela dimensão se relaciona com uma tabela fato?",
    options: ["A dimensão costuma ter uma linha por entidade e se relacionar com várias linhas de fatos", "A tabela fato deve sempre filtrar a dimensão nos dois sentidos", "As tabelas não devem ter relacionamentos", "A dimensão deve conter todas as medidas"],
    answer: 0,
    explanation: "Em um modelo estrela, uma dimensão normalmente contém valores únicos da entidade e se relaciona com várias linhas da tabela fato."
  },
  {
    q: "Por que é recomendável criar uma tabela de datas dedicada em muitos modelos analíticos?",
    options: ["Para organizar análises por períodos e habilitar cálculos de tempo", "Para substituir todas as tabelas fato", "Para armazenar as credenciais da fonte", "Para publicar relatórios automaticamente"],
    answer: 0,
    explanation: "Uma tabela de datas consistente facilita análises por ano, trimestre e mês, além de apoiar funções de inteligência de tempo."
  },
  {
    q: "Uma tabela tem duas datas relacionadas a uma tabela de calendário, mas apenas uma relação pode ficar ativa. Como uma medida pode usar a relação inativa?",
    options: ["Com USERELATIONSHIP em uma expressão DAX apropriada", "Com DISTINCT", "Com uma segmentação de dados", "Com uma consulta mesclada"],
    answer: 0,
    explanation: "USERELATIONSHIP pode ativar uma relação existente, normalmente inativa, durante o cálculo de uma expressão, como dentro de CALCULATE."
  },
  {
    q: "Qual é uma função comum de CALCULATE no DAX?",
    options: ["Avaliar uma expressão em um contexto de filtro modificado", "Renomear uma coluna no Power Query", "Criar uma conexão com um gateway", "Alterar o tema do relatório"],
    answer: 0,
    explanation: "CALCULATE avalia uma expressão em um contexto de filtro modificado pelos filtros ou modificadores fornecidos."
  },
  {
    q: "Você precisa contar clientes distintos em vez de contar todas as linhas de vendas. Qual função DAX é apropriada?",
    options: ["DISTINCTCOUNT", "SUMX", "RELATED", "FORMAT"],
    answer: 0,
    explanation: "DISTINCTCOUNT conta valores distintos de uma coluna, sendo útil para contar entidades únicas, como clientes."
  },
  {
    q: "Qual é a característica principal da função SUMX?",
    options: ["Avalia uma expressão para cada linha de uma tabela e soma os resultados", "Conta apenas valores vazios", "Cria uma relação entre tabelas", "Remove linhas duplicadas no Power Query"],
    answer: 0,
    explanation: "SUMX é uma função iteradora: avalia uma expressão linha a linha para uma tabela e soma os resultados."
  },
  {
    q: "Em um modelo com relacionamento apropriado, para que a função RELATED é frequentemente usada em uma coluna calculada?",
    options: ["Buscar um valor relacionado de uma tabela do lado um", "Somar todas as linhas de uma tabela", "Criar uma nova consulta no Power Query", "Aplicar segurança em nível de linha"],
    answer: 0,
    explanation: "RELATED pode retornar um valor de uma tabela relacionada, normalmente do lado um de um relacionamento muitos-para-um."
  },
  {
    q: "No Power BI Desktop, onde você configura como a seleção de um visual afeta os demais visuais da página?",
    options: ["Editar interações", "Gerenciar funções", "Configurações do gateway", "Transformar dados"],
    answer: 0,
    explanation: "Editar interações permite configurar se um visual filtra, realça ou não afeta outros visuais da página."
  },
  {
    q: "Qual recurso permite abrir uma página de relatório filtrada pelo contexto de um ponto selecionado em outra página?",
    options: ["Drill-through", "Query folding", "Anular dinamização", "RLS"],
    answer: 0,
    explanation: "Drill-through permite navegar para uma página de detalhes usando o contexto de filtro do item selecionado."
  },
  {
    q: "Para que servem os indicadores (bookmarks) em um relatório do Power BI?",
    options: ["Salvar e restaurar determinados estados da exibição do relatório", "Atualizar as credenciais da fonte", "Criar relacionamentos físicos", "Substituir medidas DAX"],
    answer: 0,
    explanation: "Indicadores podem guardar estados da página, como filtros e visibilidade de elementos, e ajudar a criar navegação ou apresentações interativas."
  },
  {
    q: "Qual recurso pode exibir informações adicionais quando o leitor passa o cursor sobre um ponto de dados?",
    options: ["Dica de ferramenta", "Gateway", "Função de workspace", "Parâmetro do Power Query"],
    answer: 0,
    explanation: "Dicas de ferramenta podem mostrar detalhes adicionais associados a um ponto de dados."
  },
  {
    q: "Depois de publicar um modelo com funções de segurança em nível de linha, o que normalmente ainda precisa ser feito para que usuários sejam afetados pelas regras?",
    options: ["Atribuir os usuários ou grupos às funções no serviço", "Converter o relatório em arquivo CSV", "Desativar todos os relacionamentos", "Criar um indicador para cada usuário"],
    answer: 0,
    explanation: "Além de definir as regras, é necessário atribuir usuários ou grupos às funções de RLS no serviço do Power BI."
  },
  {
    q: "Um usuário precisa consultar o conteúdo de um workspace, mas não deve editar seus itens. Qual função do workspace corresponde melhor a essa necessidade?",
    options: ["Visualizador", "Administrador", "Membro", "Colaborador"],
    answer: 0,
    explanation: "A função Visualizador é destinada a usuários que precisam consultar o conteúdo do workspace sem as permissões de edição das funções superiores."
  },
  {
    q: "Qual é uma finalidade comum de publicar um aplicativo do Power BI a partir de um workspace?",
    options: ["Distribuir conteúdo organizado para consumidores", "Criar automaticamente as tabelas de origem", "Substituir o Power Query", "Alterar o tipo de armazenamento do modelo"],
    answer: 0,
    explanation: "Um aplicativo do Power BI ajuda a distribuir conteúdo organizado do workspace para consumidores, conforme as permissões configuradas."
  },

    {
    q: "Em um modelo estrela, qual é uma boa prática para relacionar uma dimensão a uma tabela fato?",
    options: [
      "Usar uma chave única na dimensão e relacioná-la à chave correspondente na fato",
      "Criar vários relacionamentos bidirecionais sem necessidade",
      "Duplicar todas as colunas da dimensão na tabela fato",
      "Relacionar tabelas apenas por colunas de texto descritivas"
    ],
    answer: 0,
    explanation: "Em geral, a dimensão tem valores únicos na chave e se relaciona com a tabela fato, que pode conter várias linhas para cada chave."
  },
  {
    q: "Qual é uma consideração importante ao configurar a direção do filtro de um relacionamento?",
    options: [
      "A filtragem bidirecional deve ser usada em todos os relacionamentos",
      "A direção única costuma ser preferível; use bidirecional apenas quando houver necessidade",
      "A direção do filtro não influencia os resultados",
      "Relacionamentos só funcionam com filtro bidirecional"
    ],
    answer: 1,
    explanation: "A direção única costuma tornar o modelo mais simples e previsível. A filtragem bidirecional pode ser útil em casos específicos, mas deve ser avaliada com cuidado."
  },
  {
    q: "Você tem duas relações entre as mesmas tabelas, mas apenas uma pode estar ativa por vez. Qual função DAX pode usar a relação inativa em uma medida?",
    options: [
      "RELATED",
      "USERELATIONSHIP",
      "DISTINCTCOUNT",
      "LOOKUPVALUE"
    ],
    answer: 1,
    explanation: "USERELATIONSHIP permite ativar uma relação inativa durante a avaliação de uma expressão, normalmente dentro de CALCULATE."
  },
  {
    q: "Qual é o uso mais comum da função CALCULATE em DAX?",
    options: [
      "Alterar o contexto de filtro em que uma expressão é avaliada",
      "Renomear colunas no Power Query",
      "Criar automaticamente um relacionamento",
      "Publicar um relatório no serviço"
    ],
    answer: 0,
    explanation: "CALCULATE avalia uma expressão em um contexto de filtro modificado, permitindo criar medidas que respondem a condições específicas."
  },
  {
    q: "Em uma medida DAX, para que a função ALL é frequentemente usada?",
    options: [
      "Para remover filtros de uma tabela ou coluna especificada",
      "Para importar dados de um arquivo",
      "Para criar uma coluna de índice",
      "Para limitar o acesso de usuários ao workspace"
    ],
    answer: 0,
    explanation: "ALL pode remover filtros de tabelas ou colunas em uma expressão DAX. O resultado depende de como a função é usada."
  },
  {
    q: "Qual função DAX é útil para fazer uma divisão e definir um resultado alternativo quando o denominador é zero?",
    options: [
      "DIVIDE",
      "RELATED",
      "VALUES",
      "FORMAT"
    ],
    answer: 0,
    explanation: "DIVIDE permite fornecer um resultado alternativo para casos em que o denominador é zero ou vazio."
  },
  {
    q: "Em uma coluna calculada, qual função pode buscar um valor relacionado de outra tabela por meio de um relacionamento existente?",
    options: [
      "RELATED",
      "CALCULATE",
      "COUNTROWS",
      "ALL"
    ],
    answer: 0,
    explanation: "RELATED pode retornar um valor de uma tabela relacionada, normalmente do lado “um” de um relacionamento."
  },
  {
    q: "Qual tabela costuma armazenar eventos ou transações que serão analisados em um modelo estrela?",
    options: [
      "Tabela fato",
      "Tabela de parâmetros",
      "Tabela de temas",
      "Tabela de permissões do workspace"
    ],
    answer: 0,
    explanation: "A tabela fato normalmente registra eventos ou transações e contém chaves para dimensões, além de valores que podem ser analisados."
  },
  {
    q: "Por que é útil ter uma tabela calendário dedicada em um modelo de dados?",
    options: [
      "Para organizar atributos de data e apoiar análises temporais consistentes",
      "Para substituir todas as tabelas fato",
      "Para configurar as credenciais do gateway",
      "Para armazenar as imagens usadas nos relatórios"
    ],
    answer: 0,
    explanation: "Uma tabela calendário pode fornecer atributos como ano, mês e trimestre, além de apoiar cálculos e análises de períodos."
  },
  {
    q: "O que significa query folding no Power Query?",
    options: [
      "O Power Query transfere operações compatíveis para a fonte de dados executar",
      "O Power Query transforma automaticamente uma tabela em gráfico",
      "O relatório é compactado antes da publicação",
      "As consultas são agrupadas em um workspace"
    ],
    answer: 0,
    explanation: "Quando há query folding, operações compatíveis podem ser convertidas e executadas pela fonte de dados, o que pode melhorar a eficiência."
  },
  {
    q: "Em uma consulta intermediária usada apenas como etapa para outras consultas, o que pode ser apropriado fazer?",
    options: [
      "Desabilitar o carregamento dessa consulta no modelo, se ela não precisar ser carregada",
      "Transformá-la obrigatoriamente em uma medida DAX",
      "Publicá-la como um aplicativo separado",
      "Remover todas as etapas de transformação"
    ],
    answer: 0,
    explanation: "Desabilitar o carregamento pode evitar que consultas intermediárias sejam carregadas no modelo quando servem apenas para alimentar outras consultas."
  },
  {
    q: "Uma tabela contém colunas separadas para cada mês, mas você precisa de uma coluna “Mês” e outra “Valor”. Qual transformação do Power Query pode ajudar?",
    options: [
      "Anular dinamização de colunas",
      "Acrescentar consultas",
      "Promover cabeçalhos",
      "Remover duplicatas"
    ],
    answer: 0,
    explanation: "Anular dinamização transforma colunas em linhas, o que pode deixar os dados em um formato mais adequado para análise."
  },
  {
    q: "No Power Query, qual ação é mais apropriada quando você quer manter a linha, mas substituir um valor de erro por outro valor?",
    options: [
      "Substituir erros",
      "Remover linhas em branco",
      "Anular dinamização",
      "Acrescentar consultas"
    ],
    answer: 0,
    explanation: "Substituir erros permite trocar valores de erro por um valor definido, preservando a linha da tabela."
  },
  {
    q: "Qual é o objetivo principal da atualização incremental em modelos semânticos compatíveis?",
    options: [
      "Atualizar apenas partes dos dados conforme uma política configurada, em vez de processar tudo repetidamente",
      "Atualizar apenas as cores do relatório",
      "Criar automaticamente novas páginas no relatório",
      "Impedir que os usuários filtrem os dados"
    ],
    answer: 0,
    explanation: "A atualização incremental pode reduzir o volume processado em atualizações posteriores, usando uma política e os recursos compatíveis com a fonte e o modelo."
  },
  {
    q: "Qual é uma diferença comum entre um gateway de dados padrão e um gateway pessoal?",
    options: [
      "O padrão pode atender a cenários compartilhados; o pessoal é voltado ao uso individual",
      "O gateway pessoal serve apenas para criar medidas DAX",
      "O padrão só funciona com arquivos de imagem",
      "Não existe diferença de uso entre eles"
    ],
    answer: 0,
    explanation: "O gateway padrão é normalmente usado em cenários compartilhados e administrados; o pessoal é voltado a cenários individuais."
  },
  {
    q: "Qual função de workspace é normalmente mais apropriada para alguém que precisa visualizar conteúdo, mas não editá-lo?",
    options: [
      "Visualizador",
      "Administrador",
      "Membro",
      "Colaborador"
    ],
    answer: 0,
    explanation: "A função Visualizador é destinada principalmente a consumir conteúdo do workspace sem as permissões de edição das funções mais elevadas."
  },
  {
    q: "Qual é uma finalidade comum de publicar um aplicativo do Power BI a partir de um workspace?",
    options: [
      "Distribuir uma experiência organizada de conteúdo para consumidores",
      "Substituir as fontes de dados do modelo",
      "Criar automaticamente regras DAX",
      "Instalar o Power BI Desktop nos computadores dos usuários"
    ],
    answer: 0,
    explanation: "Um aplicativo do Power BI permite organizar e distribuir conteúdo do workspace para consumidores, conforme as permissões configuradas."
  },
  {
    q: "Em geral, a quem a segurança em nível de linha (RLS) é aplicada ao consumir conteúdo do Power BI?",
    options: [
      "A usuários com permissão de leitura, como consumidores do relatório",
      "A todos os administradores do workspace, sem exceção",
      "A qualquer pessoa que abra o arquivo PBIX localmente",
      "Somente a quem edita o tema do relatório"
    ],
    answer: 0,
    explanation: "A RLS é aplicada aos usuários que consomem os dados com permissões de leitura. Permissões de edição no workspace podem permitir acesso além das regras de RLS."
  },
  {
    q: "Qual recurso do Power BI Desktop ajuda a identificar quanto tempo os visuais levam para executar consultas e renderizar?",
    options: [
      "Analisador de desempenho",
      "Gateway de dados",
      "Editor de temas",
      "Gerenciador de credenciais"
    ],
    answer: 0,
    explanation: "O Analisador de desempenho ajuda a inspecionar o tempo gasto por visuais em consultas e renderização, auxiliando na investigação de lentidão."
  },
  {
    q: "Qual ação pode ajudar a melhorar o desempenho de um relatório com muitos dados desnecessários no modelo?",
    options: [
      "Remover colunas e linhas que não são necessárias para a análise",
      "Adicionar todos os campos disponíveis a cada visual",
      "Criar relacionamentos bidirecionais para todas as tabelas",
      "Usar imagens maiores em todas as páginas"
    ],
    answer: 0,
    explanation: "Reduzir dados desnecessários pode diminuir o tamanho do modelo e ajudar no desempenho e na manutenção."
  },
  {
    q: "Em um modelo estrela, qual é uma boa prática para relacionar uma dimensão a uma tabela fato?",
    options: [
      "Usar uma chave única na dimensão e relacioná-la à chave correspondente na fato",
      "Criar vários relacionamentos bidirecionais sem necessidade",
      "Duplicar todas as colunas da dimensão na tabela fato",
      "Relacionar tabelas apenas por colunas de texto descritivas"
    ],
    answer: 0,
    explanation: "Em geral, a dimensão tem valores únicos na chave e se relaciona com a tabela fato, que pode conter várias linhas para cada chave."
  },
  {
    q: "Qual é uma consideração importante ao configurar a direção do filtro de um relacionamento?",
    options: [
      "A filtragem bidirecional deve ser usada em todos os relacionamentos",
      "A direção única costuma ser preferível; use bidirecional apenas quando houver necessidade",
      "A direção do filtro não influencia os resultados",
      "Relacionamentos só funcionam com filtro bidirecional"
    ],
    answer: 1,
    explanation: "A direção única costuma tornar o modelo mais simples e previsível. A filtragem bidirecional pode ser útil em casos específicos, mas deve ser avaliada com cuidado."
  },
  {
    q: "Você tem duas relações entre as mesmas tabelas, mas apenas uma pode estar ativa por vez. Qual função DAX pode usar a relação inativa em uma medida?",
    options: [
      "RELATED",
      "USERELATIONSHIP",
      "DISTINCTCOUNT",
      "LOOKUPVALUE"
    ],
    answer: 1,
    explanation: "USERELATIONSHIP permite ativar uma relação inativa durante a avaliação de uma expressão, normalmente dentro de CALCULATE."
  },
  {
    q: "Qual é o uso mais comum da função CALCULATE em DAX?",
    options: [
      "Alterar o contexto de filtro em que uma expressão é avaliada",
      "Renomear colunas no Power Query",
      "Criar automaticamente um relacionamento",
      "Publicar um relatório no serviço"
    ],
    answer: 0,
    explanation: "CALCULATE avalia uma expressão em um contexto de filtro modificado, permitindo criar medidas que respondem a condições específicas."
  },
  {
    q: "Em uma medida DAX, para que a função ALL é frequentemente usada?",
    options: [
      "Para remover filtros de uma tabela ou coluna especificada",
      "Para importar dados de um arquivo",
      "Para criar uma coluna de índice",
      "Para limitar o acesso de usuários ao workspace"
    ],
    answer: 0,
    explanation: "ALL pode remover filtros de tabelas ou colunas em uma expressão DAX. O resultado depende de como a função é usada."
  },
  {
    q: "Qual função DAX é útil para fazer uma divisão e definir um resultado alternativo quando o denominador é zero?",
    options: [
      "DIVIDE",
      "RELATED",
      "VALUES",
      "FORMAT"
    ],
    answer: 0,
    explanation: "DIVIDE permite fornecer um resultado alternativo para casos em que o denominador é zero ou vazio."
  },
  {
    q: "Em uma coluna calculada, qual função pode buscar um valor relacionado de outra tabela por meio de um relacionamento existente?",
    options: [
      "RELATED",
      "CALCULATE",
      "COUNTROWS",
      "ALL"
    ],
    answer: 0,
    explanation: "RELATED pode retornar um valor de uma tabela relacionada, normalmente do lado “um” de um relacionamento."
  },
  {
    q: "Qual tabela costuma armazenar eventos ou transações que serão analisados em um modelo estrela?",
    options: [
      "Tabela fato",
      "Tabela de parâmetros",
      "Tabela de temas",
      "Tabela de permissões do workspace"
    ],
    answer: 0,
    explanation: "A tabela fato normalmente registra eventos ou transações e contém chaves para dimensões, além de valores que podem ser analisados."
  },
  {
    q: "Por que é útil ter uma tabela calendário dedicada em um modelo de dados?",
    options: [
      "Para organizar atributos de data e apoiar análises temporais consistentes",
      "Para substituir todas as tabelas fato",
      "Para configurar as credenciais do gateway",
      "Para armazenar as imagens usadas nos relatórios"
    ],
    answer: 0,
    explanation: "Uma tabela calendário pode fornecer atributos como ano, mês e trimestre, além de apoiar cálculos e análises de períodos."
  },
  {
    q: "O que significa query folding no Power Query?",
    options: [
      "O Power Query transfere operações compatíveis para a fonte de dados executar",
      "O Power Query transforma automaticamente uma tabela em gráfico",
      "O relatório é compactado antes da publicação",
      "As consultas são agrupadas em um workspace"
    ],
    answer: 0,
    explanation: "Quando há query folding, operações compatíveis podem ser convertidas e executadas pela fonte de dados, o que pode melhorar a eficiência."
  },
  {
    q: "Em uma consulta intermediária usada apenas como etapa para outras consultas, o que pode ser apropriado fazer?",
    options: [
      "Desabilitar o carregamento dessa consulta no modelo, se ela não precisar ser carregada",
      "Transformá-la obrigatoriamente em uma medida DAX",
      "Publicá-la como um aplicativo separado",
      "Remover todas as etapas de transformação"
    ],
    answer: 0,
    explanation: "Desabilitar o carregamento pode evitar que consultas intermediárias sejam carregadas no modelo quando servem apenas para alimentar outras consultas."
  },
  {
    q: "Uma tabela contém colunas separadas para cada mês, mas você precisa de uma coluna “Mês” e outra “Valor”. Qual transformação do Power Query pode ajudar?",
    options: [
      "Anular dinamização de colunas",
      "Acrescentar consultas",
      "Promover cabeçalhos",
      "Remover duplicatas"
    ],
    answer: 0,
    explanation: "Anular dinamização transforma colunas em linhas, o que pode deixar os dados em um formato mais adequado para análise."
  },
  {
    q: "No Power Query, qual ação é mais apropriada quando você quer manter a linha, mas substituir um valor de erro por outro valor?",
    options: [
      "Substituir erros",
      "Remover linhas em branco",
      "Anular dinamização",
      "Acrescentar consultas"
    ],
    answer: 0,
    explanation: "Substituir erros permite trocar valores de erro por um valor definido, preservando a linha da tabela."
  },
  {
    q: "Qual é o objetivo principal da atualização incremental em modelos semânticos compatíveis?",
    options: [
      "Atualizar apenas partes dos dados conforme uma política configurada, em vez de processar tudo repetidamente",
      "Atualizar apenas as cores do relatório",
      "Criar automaticamente novas páginas no relatório",
      "Impedir que os usuários filtrem os dados"
    ],
    answer: 0,
    explanation: "A atualização incremental pode reduzir o volume processado em atualizações posteriores, usando uma política e os recursos compatíveis com a fonte e o modelo."
  },
  {
    q: "Qual é uma diferença comum entre um gateway de dados padrão e um gateway pessoal?",
    options: [
      "O padrão pode atender a cenários compartilhados; o pessoal é voltado ao uso individual",
      "O gateway pessoal serve apenas para criar medidas DAX",
      "O padrão só funciona com arquivos de imagem",
      "Não existe diferença de uso entre eles"
    ],
    answer: 0,
    explanation: "O gateway padrão é normalmente usado em cenários compartilhados e administrados; o pessoal é voltado a cenários individuais."
  },
  {
    q: "Qual função de workspace é normalmente mais apropriada para alguém que precisa visualizar conteúdo, mas não editá-lo?",
    options: [
      "Visualizador",
      "Administrador",
      "Membro",
      "Colaborador"
    ],
    answer: 0,
    explanation: "A função Visualizador é destinada principalmente a consumir conteúdo do workspace sem as permissões de edição das funções mais elevadas."
  },
  {
    q: "Qual é uma finalidade comum de publicar um aplicativo do Power BI a partir de um workspace?",
    options: [
      "Distribuir uma experiência organizada de conteúdo para consumidores",
      "Substituir as fontes de dados do modelo",
      "Criar automaticamente regras DAX",
      "Instalar o Power BI Desktop nos computadores dos usuários"
    ],
    answer: 0,
    explanation: "Um aplicativo do Power BI permite organizar e distribuir conteúdo do workspace para consumidores, conforme as permissões configuradas."
  },
  {
    q: "Em geral, a quem a segurança em nível de linha (RLS) é aplicada ao consumir conteúdo do Power BI?",
    options: [
      "A usuários com permissão de leitura, como consumidores do relatório",
      "A todos os administradores do workspace, sem exceção",
      "A qualquer pessoa que abra o arquivo PBIX localmente",
      "Somente a quem edita o tema do relatório"
    ],
    answer: 0,
    explanation: "A RLS é aplicada aos usuários que consomem os dados com permissões de leitura. Permissões de edição no workspace podem permitir acesso além das regras de RLS."
  },
  {
    q: "Qual recurso do Power BI Desktop ajuda a identificar quanto tempo os visuais levam para executar consultas e renderizar?",
    options: [
      "Analisador de desempenho",
      "Gateway de dados",
      "Editor de temas",
      "Gerenciador de credenciais"
    ],
    answer: 0,
    explanation: "O Analisador de desempenho ajuda a inspecionar o tempo gasto por visuais em consultas e renderização, auxiliando na investigação de lentidão."
  },
  {
    q: "Qual ação pode ajudar a melhorar o desempenho de um relatório com muitos dados desnecessários no modelo?",
    options: [
      "Remover colunas e linhas que não são necessárias para a análise",
      "Adicionar todos os campos disponíveis a cada visual",
      "Criar relacionamentos bidirecionais para todas as tabelas",
      "Usar imagens maiores em todas as páginas"
    ],
    answer: 0,
    explanation: "Reduzir dados desnecessários pode diminuir o tamanho do modelo e ajudar no desempenho e na manutenção."
  },
  {
    q: "Ao preparar uma tabela grande no Power Query, qual ação geralmente ajuda a reduzir o volume de dados carregado no modelo?",
    options: [
      "Manter todas as colunas e ocultar as desnecessárias no relatório",
      "Remover colunas e linhas que não serão usadas",
      "Criar uma medida para cada coluna",
      "Duplicar a consulta antes de carregá-la"
    ],
    answer: 1,
    explanation: "Remover dados desnecessários antes de carregar pode reduzir o tamanho do modelo e melhorar o desempenho."
  },
  {
    q: "O que significa query folding no Power Query?",
    options: [
      "A conversão de medidas DAX em colunas calculadas",
      "A execução de etapas de transformação na fonte de dados, quando possível",
      "A criação automática de relacionamentos entre todas as tabelas",
      "A compactação de imagens usadas no relatório"
    ],
    answer: 1,
    explanation: "Quando há suporte da fonte e das etapas usadas, o Power Query pode enviar as transformações para a fonte executar, em vez de processar tudo localmente."
  },
  {
    q: "Uma tabela contém uma coluna para cada mês, mas você precisa analisá-la por mês em uma única coluna. Qual transformação do Power Query é apropriada?",
    options: [
      "Mesclar colunas",
      "Despivotar colunas",
      "Acrescentar consultas",
      "Agrupar por"
    ],
    answer: 1,
    explanation: "Despivotar transforma várias colunas em linhas, facilitando análises por categorias como mês."
  },
  {
    q: "Duas tabelas de dimensão precisam se relacionar com uma tabela fato, mas ambas têm valores repetidos na chave. Qual solução costuma ser mais adequada do que criar uma relação muitos-para-muitos diretamente?",
    options: [
      "Criar uma tabela ponte com valores únicos da chave",
      "Apagar a tabela fato",
      "Transformar todas as colunas em medidas",
      "Desativar todos os filtros do relatório"
    ],
    answer: 0,
    explanation: "Uma tabela ponte com valores únicos pode ajudar a estruturar relacionamentos e controlar melhor a propagação de filtros."
  },
  {
    q: "Para usar funções de inteligência de tempo de forma confiável, qual prática é recomendada para a tabela de datas?",
    options: [
      "Usar uma tabela com datas únicas, sem lacunas, e configurá-la como tabela de datas",
      "Criar uma linha para cada produto em cada data",
      "Armazenar as datas como texto em formatos diferentes",
      "Usar apenas os meses em que houve vendas"
    ],
    answer: 0,
    explanation: "Uma tabela de datas consistente, com datas únicas e contínuas, dá suporte a análises de período e funções de inteligência de tempo."
  },
  {
    q: "Uma tabela possui duas relações possíveis com a tabela Calendário, mas apenas uma pode estar ativa. Qual função DAX pode ativar temporariamente a relação inativa em uma medida?",
    options: [
      "RELATED",
      "USERELATIONSHIP",
      "FORMAT",
      "COUNTROWS"
    ],
    answer: 1,
    explanation: "USERELATIONSHIP pode ser usada em uma expressão DAX, normalmente com CALCULATE, para usar uma relação inativa durante aquele cálculo."
  },
  {
    q: "Qual é uma função comum da função CALCULATE em DAX?",
    options: [
      "Alterar o contexto de filtro usado para avaliar uma expressão",
      "Criar uma nova fonte de dados no Power Query",
      "Formatar automaticamente todas as páginas do relatório",
      "Publicar um relatório em um workspace"
    ],
    answer: 0,
    explanation: "CALCULATE avalia uma expressão em um contexto de filtro modificado, permitindo controlar quais dados participam do cálculo."
  },
  {
    q: "Você precisa calcular o total de cada linha multiplicando quantidade por preço e, depois, somar os resultados. Qual função DAX é apropriada para iterar pelas linhas?",
    options: [
      "SUMX",
      "DISTINCTCOUNT",
      "RELATEDTABLE",
      "FORMAT"
    ],
    answer: 0,
    explanation: "SUMX avalia uma expressão para cada linha de uma tabela e soma os resultados."
  },
  {
    q: "Qual função DAX é normalmente usada para contar valores distintos em uma coluna, como o número de clientes únicos?",
    options: [
      "SUM",
      "DISTINCTCOUNT",
      "AVERAGE",
      "SELECTEDVALUE"
    ],
    answer: 1,
    explanation: "DISTINCTCOUNT conta quantos valores distintos existem na coluna no contexto atual."
  },
  {
    q: "Por que geralmente é melhor evitar usar FORMAT em uma medida que será usada em cálculos ou eixos numéricos?",
    options: [
      "Porque FORMAT transforma o resultado em texto",
      "Porque FORMAT apaga os filtros do relatório",
      "Porque FORMAT só funciona no Power Query",
      "Porque FORMAT cria um relacionamento muitos-para-muitos"
    ],
    answer: 0,
    explanation: "FORMAT retorna texto. Para preservar o resultado numérico, prefira configurar o formato da medida nas propriedades do modelo."
  },
  {
    q: "Você quer permitir que o usuário clique com o botão direito em um ponto de dados e abra outra página filtrada para aquele contexto. Qual recurso atende a esse cenário?",
    options: [
      "Drill-through",
      "Gateway",
      "Query folding",
      "Rótulo de confidencialidade"
    ],
    answer: 0,
    explanation: "Drill-through navega para uma página de detalhes mantendo o contexto do ponto ou categoria selecionada."
  },
  {
    q: "Você quer exibir uma página pequena de detalhes quando o leitor passa o cursor sobre um ponto de um gráfico. Qual recurso pode ser usado?",
    options: [
      "Página de tooltip",
      "Atualização incremental",
      "Tabela ponte",
      "Função de data"
    ],
    answer: 0,
    explanation: "Uma página de tooltip pode mostrar informações adicionais associadas ao ponto sobre o qual o leitor posiciona o cursor."
  },
  {
    q: "Em um relatório, você quer salvar uma combinação específica de filtros e a visibilidade de alguns objetos para criar uma navegação guiada. Qual recurso pode ajudar?",
    options: [
      "Indicadores (bookmarks)",
      "Gateway pessoal",
      "Mesclar consultas",
      "Coluna de índice"
    ],
    answer: 0,
    explanation: "Indicadores podem capturar o estado da página, incluindo filtros e visibilidade de objetos, conforme as opções configuradas."
  },
  {
    q: "Você quer que uma segmentação de data mantenha a mesma seleção em várias páginas do relatório. O que deve configurar?",
    options: [
      "Sincronização de segmentações",
      "Relacionamento inativo",
      "Acrescentar consultas",
      "Atualização incremental"
    ],
    answer: 0,
    explanation: "A sincronização de segmentações permite compartilhar a seleção de uma segmentação entre páginas configuradas para isso."
  },
  {
    q: "Qual recurso permite mudar a cor de uma célula ou barra com base no valor de uma medida ou regra?",
    options: [
      "Formatação condicional",
      "Drill-through",
      "RLS",
      "Gateway de dados"
    ],
    answer: 0,
    explanation: "A formatação condicional aplica estilos, como cores, com base em valores, regras ou medidas."
  },
  {
    q: "Qual é uma finalidade dos rótulos de confidencialidade em conteúdo do Power BI?",
    options: [
      "Classificar conteúdo conforme sua sensibilidade e apoiar sua proteção",
      "Substituir todas as permissões do workspace",
      "Atualizar automaticamente fontes locais",
      "Criar medidas DAX"
    ],
    answer: 0,
    explanation: "Rótulos de confidencialidade ajudam a classificar o conteúdo e podem apoiar políticas de proteção e governança da organização."
  },
  {
    q: "Uma equipe quer distribuir um conjunto organizado de relatórios para consumidores, sem pedir que cada pessoa navegue diretamente pelo workspace. Qual opção é adequada?",
    options: [
      "Publicar um aplicativo do Power BI a partir do workspace",
      "Criar uma coluna calculada para cada usuário",
      "Converter o relatório em uma consulta do Power Query",
      "Desativar as relações do modelo"
    ],
    answer: 0,
    explanation: "Um aplicativo do Power BI pode organizar e distribuir conteúdo do workspace para consumidores, conforme as permissões configuradas."
  },
  {
    q: "Uma organização precisa atualizar dados de várias fontes locais no serviço Power BI. Qual tipo de gateway costuma ser indicado para uso compartilhado e centralizado?",
    options: [
      "Gateway de dados local em modo padrão",
      "Gateway pessoal instalado em cada navegador",
      "Indicador de relatório",
      "Segmentação sincronizada"
    ],
    answer: 0,
    explanation: "O gateway local em modo padrão é geralmente usado em cenários organizacionais compartilhados, sujeito à configuração e às permissões adequadas."
  },
  {
    q: "Antes de configurar uma atualização agendada no serviço, qual item é importante verificar para uma fonte de dados que exige autenticação?",
    options: [
      "Se as credenciais da fonte foram configuradas corretamente",
      "Se todos os visuais usam a mesma cor",
      "Se cada coluna tem uma medida associada",
      "Se o relatório contém pelo menos uma página de tooltip"
    ],
    answer: 0,
    explanation: "As credenciais precisam estar configuradas corretamente para que o serviço consiga acessar a fonte durante a atualização."
  },
  {
    q: "Qual é uma finalidade da atualização incremental em um modelo semântico com grande volume de dados históricos?",
    options: [
      "Atualizar principalmente os períodos recentes, evitando processar novamente todo o histórico em cada atualização",
      "Transformar medidas em colunas calculadas",
      "Substituir a necessidade de credenciais",
      "Criar automaticamente páginas de drill-through"
    ],
    answer: 0,
    explanation: "A atualização incremental pode particionar os dados e limitar o processamento às partições que precisam ser atualizadas, conforme a política definida."
  },


];

const cards = [
  ["Power Query", "Ferramenta de preparação e transformação de dados usada para conectar, limpar e reorganizar dados antes de carregá-los."],
  ["Importação", "Modo de armazenamento que carrega os dados para o modelo semântico do Power BI, permitindo consultas rápidas sobre os dados importados."],
  ["DirectQuery", "Modo em que os dados permanecem na fonte e as consultas do relatório são encaminhadas a ela; desempenho e recursos dependem da fonte e do modelo."],
  ["Conexão dinâmica", "Conexão a um modelo semântico ou cubo existente, usando a camada de modelagem já publicada em vez de importar os dados para um novo modelo."],
  ["Query folding", "Processo pelo qual etapas compatíveis do Power Query são traduzidas e executadas pela fonte de dados, quando possível."],
  ["Perfil de dados", "Ferramentas do Power Query que ajudam a examinar distribuição, qualidade e estatísticas das colunas."],
  ["Alterar tipo de dados", "Ajuste do tipo de uma coluna — como texto, data ou número — para representar corretamente os valores e permitir operações adequadas."],
  ["Remover duplicatas", "Transformação que mantém uma ocorrência de cada valor ou combinação de colunas selecionada."],
  ["Mesclar consultas", "Combina colunas de tabelas relacionadas por uma ou mais colunas-chave; é semelhante a uma junção."],
  ["Acrescentar consultas", "Empilha as linhas de uma consulta abaixo das linhas de outra, alinhando as colunas pelos nomes."],
  ["Anular dinamização", "Transforma colunas em linhas, criando pares de atributo e valor; é útil para reorganizar dados apresentados em formato amplo."],
  ["Parâmetro do Power Query", "Valor reutilizável que pode controlar partes de uma consulta, como caminho de arquivo, servidor ou período."],
  ["Consulta de preparação", "Consulta intermediária que pode ser usada por outras consultas; se não precisar ser carregada no modelo, o carregamento pode ser desabilitado."],
  ["Esquema estrela", "Organização do modelo com tabelas dimensão relacionadas a uma ou mais tabelas fato, favorecendo filtros e análises."],
  ["Tabela fato", "Tabela que registra eventos ou transações em uma granularidade definida e normalmente contém chaves e valores analisáveis."],
  ["Tabela dimensão", "Tabela que descreve entidades, como produto, cliente ou data, e fornece atributos para filtrar e agrupar fatos."],
  ["Granularidade", "Nível de detalhe representado por cada linha de uma tabela fato, como uma linha por item vendido em cada pedido."],
  ["Chave substituta", "Identificador técnico usado para distinguir registros de uma dimensão, especialmente quando a chave de origem não é adequada ou única."],
  ["Relacionamento um-para-muitos", "Relação em que cada valor único do lado um pode corresponder a várias linhas do lado muitos, como uma dimensão ligada a uma tabela fato."],
  ["Direção de filtro", "Define como os filtros se propagam entre tabelas relacionadas; a direção única costuma ser preferível, salvo necessidade específica."],
  ["Relacionamento inativo", "Relacionamento existente que não propaga filtros por padrão; uma medida pode ativá-lo durante um cálculo com USERELATIONSHIP."],
  ["Tabela de datas", "Tabela contínua e sem datas duplicadas, com atributos de calendário, usada para análises temporais consistentes."],
  ["Medida DAX", "Cálculo avaliado quando solicitado por um visual, considerando o contexto de filtro atual."],
  ["Coluna calculada", "Coluna calculada linha a linha e armazenada no modelo; seus valores são atualizados durante o processamento dos dados."],
  ["Contexto de filtro", "Conjunto de filtros que determina quais linhas participam da avaliação de uma medida ou expressão DAX."],
  ["Contexto de linha", "Contexto que representa a linha atual durante a avaliação de uma expressão, comum em colunas calculadas e funções iteradoras."],
  ["CALCULATE", "Função DAX que avalia uma expressão em um contexto de filtro modificado."],
  ["DIVIDE", "Função DAX para divisão que aceita um resultado alternativo quando o denominador é zero ou vazio."],
  ["SUMX", "Função iteradora que avalia uma expressão para cada linha de uma tabela e soma os resultados."],
  ["DISTINCTCOUNT", "Conta os valores distintos de uma coluna no contexto atual."],
  ["RELATED", "Retorna um valor de uma tabela relacionada, normalmente do lado um de um relacionamento muitos-para-um."],
  ["USERELATIONSHIP", "Função usada em uma expressão DAX, geralmente com CALCULATE, para utilizar temporariamente um relacionamento inativo existente."],
  ["ALL", "Função que pode remover filtros de uma tabela ou coluna em uma expressão DAX; o efeito depende de como é aplicada."],
  ["FORMAT", "Converte o resultado em texto para exibição; evite quando o resultado precisar continuar numérico para cálculos ou eixos."],
  ["Segmentação de dados", "Visual interativo que permite ao leitor selecionar valores para filtrar os dados do relatório."],
  ["Editar interações", "Configuração que determina se a seleção em um visual filtra, realça ou não afeta outros visuais da página."],
  ["Drill-through", "Navegação para uma página de detalhes que recebe o contexto do ponto ou categoria selecionada."],
  ["Indicadores (bookmarks)", "Recurso que pode salvar estados de exibição, como filtros e visibilidade de objetos, para criar navegação ou apresentações."],
  ["Página de tooltip", "Página configurada para exibir informações adicionais quando o leitor passa o cursor sobre um ponto de dados."],
  ["Formatação condicional", "Aplica estilos, como cores, com base em valores, regras ou medidas."],
  ["Analisador de desempenho", "Ferramenta do Power BI Desktop que ajuda a inspecionar o tempo gasto por visuais em consultas e renderização."],
  ["RLS", "Segurança em nível de linha que limita as linhas de dados visíveis conforme regras e funções atribuídas."],
  ["RLS dinâmica", "Abordagem em que regras de segurança usam informações do usuário conectado, por exemplo, USERPRINCIPALNAME(), com um modelo configurado para isso."],
  ["Função Visualizador", "Função de workspace voltada a usuários que precisam consumir conteúdo sem as permissões de edição das funções superiores."],
  ["Workspace", "Área colaborativa do serviço Power BI usada para organizar e gerenciar conteúdo, permissões e publicação."],
  ["Aplicativo do Power BI", "Pacote organizado de conteúdo publicado a partir de um workspace para distribuição a consumidores."],
  ["Gateway de dados", "Componente que permite ao serviço Power BI acessar determinadas fontes locais, conforme a configuração e as permissões."],
  ["Atualização agendada", "Configuração que define quando o serviço tenta atualizar os dados de um modelo semântico, dependendo das credenciais e da conectividade."],
  ["Atualização incremental", "Política que pode atualizar partições ou períodos necessários, reduzindo o processamento repetido de todo o histórico."],
  ["Rótulo de confidencialidade", "Classifica o conteúdo conforme sua sensibilidade e pode apoiar políticas de governança e proteção da organização."],
  ["Modelo semântico", "Conjunto publicado de tabelas, relacionamentos, medidas e regras que pode servir de base para relatórios e análises."]
];

const plan = [
  ["Semana 1", "Preparar os dados", "Conexões, limpeza, transformações e combinação de consultas."],
  ["Semana 2", "Modelar os dados", "Relacionamentos, esquema estrela, medidas e fundamentos de DAX."],
  ["Semana 3", "Visualizar e analisar", "Relatórios, filtros, interações, experiência e análise."],
  ["Semana 4", "Implantar e revisar", "Workspaces, atualização, segurança, simulados e revisão dos erros."]
];

const navItems = [
  ["Início", "⌂"],
  ["Trilhas", "▤"],
  ["Quiz", "✳"],
  ["Flashcards", "▱"],
  ["Plano de estudo", "◷"]
];

const colorMap = {
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700"
};

function loadCompletedLessons() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};

    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function App() {
  const [page, setPage] = useState("Início");
  const [selectedTrack, setSelectedTrack] = useState(tracks[0]);
  const [completed, setCompleted] = useState(loadCompletedLessons);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // O aplicativo continua funcionando mesmo se o navegador bloquear o armazenamento.
    }
  }, [completed]);

  const totalLessons = tracks.reduce((sum, track) => sum + track.lessons.length, 0);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = Math.round((completedCount / totalLessons) * 100);
  const currentQuestion = questions[questionIndex];

  const toggleLesson = (trackId, lessonIndex) => {
    const key = `${trackId}-${lessonIndex}`;
    setCompleted((previous) => ({
      ...previous,
      [key]: !previous[key]
    }));
  };

  const chooseAnswer = (index) => {
    if (showExplanation || quizFinished) return;

    setSelectedAnswer(index);
    setShowExplanation(true);
    setAnswered((count) => count + 1);

    if (index === currentQuestion.answer) {
      setScore((count) => count + 1);
    }
  };

  const nextQuestion = () => {
    if (!showExplanation) return;

    if (questionIndex === questions.length - 1) {
      setQuizFinished(true);
      return;
    }

    setQuestionIndex((index) => index + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizFinished(false);
    setScore(0);
    setAnswered(0);
  };

  const nextCard = () => {
    setCardIndex((index) => (index + 1) % cards.length);
    setCardFlipped(false);
  };

  const previousCard = () => {
    setCardIndex((index) => (index - 1 + cards.length) % cards.length);
    setCardFlipped(false);
  };

  const pageTitle = page === "Início" ? "Seu espaço de estudos" : page;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              P
            </div>
            <div>
              <div className="font-bold tracking-tight">PL-300 Prep</div>
              <div className="text-xs text-slate-500">Seu plano para a certificação</div>
            </div>
          </div>

          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </div>

          <nav className="space-y-1" aria-label="Menu principal">
            {navItems.map(([name, icon]) => (
              <button
                key={name}
                type="button"
                onClick={() => setPage(name)}
                aria-current={page === name ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  page === name
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="w-5 text-center text-base" aria-hidden="true">
                  {icon}
                </span>
                {name}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white">
            <div className="mb-2 text-sm font-semibold">Dica de estudo</div>
            <p className="text-xs leading-5 text-slate-300">
              Pratique no Power BI Desktop e explique em voz alta por que escolheu cada solução.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
            <div>
              <div className="text-xs font-medium text-slate-400">
                PREPARAÇÃO PARA CERTIFICAÇÃO
              </div>
              <h1 className="mt-1 text-xl font-bold tracking-tight">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 sm:inline">
                Microsoft Power BI
              </span>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800"
                aria-label="Perfil"
              >
                A
              </div>
            </div>
          </header>

          <div className="border-b border-slate-200 bg-white px-4 py-2 md:hidden">
            <nav className="flex gap-2 overflow-x-auto" aria-label="Navegação móvel">
              {navItems.map(([name]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setPage(name)}
                  aria-current={page === name ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${
                    page === name
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {name}
                </button>
              ))}
            </nav>
          </div>

          <div className="mx-auto max-w-6xl space-y-6 p-5 md:p-8">
            {page === "Início" && (
              <>
                <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-700 to-violet-800 p-6 text-white md:p-8">
                  <div className="grid gap-7 md:grid-cols-[1.4fr_0.6fr] md:items-center">
                    <div>
                      <div className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                        Sua jornada começa aqui
                      </div>
                      <h2 className="max-w-xl text-3xl font-bold leading-tight md:text-4xl">
                        Aprenda. Pratique. Chegue confiante à PL-300.
                      </h2>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">
                        Organize seus estudos de Power BI em trilhas objetivas, revise conceitos
                        com flashcards e teste seus conhecimentos.
                      </p>
                      <button
                        type="button"
                        onClick={() => setPage("Trilhas")}
                        className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
                      >
                        Continuar estudando <span aria-hidden="true">→</span>
                      </button>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-indigo-100">Progresso geral</span>
                        <span className="text-sm font-bold">{progress}%</span>
                      </div>
                      <div
                        className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"
                        role="progressbar"
                        aria-label="Progresso das lições"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full rounded-full bg-amber-300 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-3 text-xs text-indigo-100">
                        {completedCount} de {totalLessons} lições concluídas
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-3" aria-label="Resumo dos estudos">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="text-sm text-slate-500">Lições concluídas</div>
                    <div className="mt-2 text-3xl font-bold">
                      {completedCount}
                      <span className="ml-1 text-base font-medium text-slate-400">
                        / {totalLessons}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Avance no seu próprio ritmo</div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="text-sm text-slate-500">Questões respondidas</div>
                    <div className="mt-2 text-3xl font-bold">{answered}</div>
                    <div className="mt-2 text-xs text-slate-500">
                      {answered ? `${score} acertos nesta rodada` : "Faça um quiz para começar"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="text-sm text-slate-500">Flashcards disponíveis</div>
                    <div className="mt-2 text-3xl font-bold">{cards.length}</div>
                    <div className="mt-2 text-xs text-slate-500">
                      Conceitos essenciais para revisar
                    </div>
                  </div>
                </section>

                <section>
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold">Suas trilhas de estudo</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Quatro áreas para organizar sua preparação.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPage("Trilhas")}
                      className="shrink-0 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                    >
                      Ver trilhas →
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {tracks.map((track) => {
                      const done = track.lessons.filter(
                        (_, index) => completed[`${track.id}-${index}`]
                      ).length;
                      const trackProgress = Math.round((done / track.lessons.length) * 100);

                      return (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => {
                            setSelectedTrack(track);
                            setPage("Trilhas");
                          }}
                          className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${colorMap[track.color]}`}
                              aria-hidden="true"
                            >
                              {track.icon}
                            </div>
                            <span className="text-xs font-medium text-slate-400">
                              {done}/{track.lessons.length} lições
                            </span>
                          </div>
                          <h3 className="mt-4 font-bold">{track.title}</h3>
                          <p className="mt-1 text-sm text-slate-500">{track.subtitle}</p>
                          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full bg-indigo-500 transition-all"
                              style={{ width: `${trackProgress}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </>
            )}

            {page === "Trilhas" && (
              <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
                <section className="h-fit rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="px-3 pb-3 pt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Trilhas
                  </div>

                  {tracks.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setSelectedTrack(track)}
                      aria-current={selectedTrack.id === track.id ? "true" : undefined}
                      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                        selectedTrack.id === track.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorMap[track.color]}`}
                        aria-hidden="true"
                      >
                        {track.icon}
                      </span>
                      {track.title}
                    </button>
                  ))}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${colorMap[selectedTrack.color]}`}
                      aria-hidden="true"
                    >
                      {selectedTrack.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedTrack.title}</h2>
                      <p className="mt-1 text-sm text-slate-500">{selectedTrack.subtitle}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {selectedTrack.lessons.map(([title, description], index) => {
                      const done = Boolean(completed[`${selectedTrack.id}-${index}`]);

                      return (
                        <button
                          key={title}
                          type="button"
                          onClick={() => toggleLesson(selectedTrack.id, index)}
                          aria-pressed={done}
                          className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                            done
                              ? "border-emerald-200 bg-emerald-50/50"
                              : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                              done
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-slate-300 text-slate-400"
                            }`}
                            aria-hidden="true"
                          >
                            {done ? "✓" : index + 1}
                          </span>
                          <span className="flex-1">
                            <span className="block font-semibold">{title}</span>
                            <span className="mt-1 block text-sm leading-5 text-slate-500">
                              {description}
                            </span>
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {done ? "Concluída" : "Marcar"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-5 text-xs leading-5 text-slate-400">
                    As descrições são pontos de partida para revisão. Aprofunde cada assunto com
                    exercícios práticos no Power BI.
                  </p>
                </section>
              </div>
            )}

            {page === "Quiz" && (
              <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
                {quizFinished ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
                      ✓
                    </div>
                    <h2 className="mt-4 text-2xl font-bold">Quiz concluído!</h2>
                    <p className="mt-2 text-slate-600">
                      Você acertou <strong>{score}</strong> de <strong>{questions.length}</strong>{" "}
                      questões.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Revise as explicações e tente novamente para praticar.
                    </p>
                    <button
                      type="button"
                      onClick={restartQuiz}
                      className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                    >
                      Refazer quiz
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                          Treino rápido
                        </div>
                        <h2 className="mt-1 text-xl font-bold">
                          Questão {questionIndex + 1} de {questions.length}
                        </h2>
                      </div>
                      <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold">
                        {score}/{answered} acertos
                      </div>
                    </div>

                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{
                          width: `${((questionIndex + 1) / questions.length) * 100}%`
                        }}
                      />
                    </div>

                    <p className="mt-7 text-lg font-semibold leading-7">{currentQuestion.q}</p>

                    <div className="mt-5 space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        let optionStyle =
                          "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50";

                        if (showExplanation && index === currentQuestion.answer) {
                          optionStyle = "border-emerald-400 bg-emerald-50 text-emerald-900";
                        } else if (showExplanation && index === selectedAnswer) {
                          optionStyle = "border-rose-300 bg-rose-50 text-rose-900";
                        }

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => chooseAnswer(index)}
                            disabled={showExplanation}
                            aria-pressed={selectedAnswer === index}
                            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition disabled:cursor-default ${optionStyle}`}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <div className="mt-5 rounded-xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-950">
                        <span className="font-bold">Por quê? </span>
                        {currentQuestion.explanation}
                      </div>
                    )}

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={nextQuestion}
                        disabled={!showExplanation}
                        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {questionIndex === questions.length - 1
                          ? "Ver resultado"
                          : "Próxima questão →"}
                      </button>
                    </div>

                    <p className="mt-5 text-xs text-slate-400">
                      Questões originais para prática; não são questões oficiais do exame.
                    </p>
                  </>
                )}
              </section>
            )}

            {page === "Flashcards" && (
              <section className="mx-auto max-w-2xl">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Revisão com flashcards</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Clique no cartão para revelar a explicação.
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                    {cardIndex + 1} / {cards.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setCardFlipped((flipped) => !flipped)}
                  aria-label={cardFlipped ? "Mostrar o termo" : "Mostrar a explicação"}
                  className="flex min-h-72 w-full flex-col items-center justify-center rounded-3xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-8 text-center shadow-sm transition hover:shadow-md"
                >
                  <span className="mb-5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-700">
                    {cardFlipped ? "Conceito" : "Termo"}
                  </span>
                  <span className="max-w-lg text-2xl font-bold leading-snug">
                    {cardFlipped ? cards[cardIndex][1] : cards[cardIndex][0]}
                  </span>
                  <span className="mt-6 text-xs text-slate-400">
                    Clique para {cardFlipped ? "voltar" : "virar"}
                  </span>
                </button>

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={previousCard}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    onClick={nextCard}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Próximo →
                  </button>
                </div>
              </section>
            )}

            {page === "Plano de estudo" && (
              <section>
                <div className="mb-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                  <h2 className="font-bold text-indigo-950">
                    Plano sugerido de quatro semanas
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-indigo-800">
                    Adapte a duração ao seu tempo disponível e à sua experiência. Reserve sessões
                    para prática e revisão, não apenas leitura.
                  </p>
                </div>

                <div className="space-y-4">
                  {plan.map(([week, title, detail], index) => (
                    <div
                      key={week}
                      className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                          {week}
                        </div>
                        <h3 className="mt-1 font-bold">{title}</h3>
                        <p className="mt-1 text-sm leading-5 text-slate-500">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="font-bold">Rotina de uma sessão</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Revisar", "Retome anotações e conceitos anteriores."],
                      ["Praticar", "Construa ou ajuste algo no Power BI Desktop."],
                      ["Verificar", "Faça questões e registre dúvidas para revisar."]
                    ].map(([title, text], index) => (
                      <div key={title} className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs font-bold text-indigo-600">
                          ETAPA {index + 1}
                        </div>
                        <div className="mt-1 text-sm font-bold">{title}</div>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <footer className="border-t border-slate-200 pt-4 text-xs leading-5 text-slate-400">
              Protótipo de estudos independente. PL-300 é uma certificação da Microsoft; consulte
              o guia oficial vigente para confirmar os objetivos e requisitos atuais do exame.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

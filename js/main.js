document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todos os tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Adiciona evento para recriar tooltips após o clique
    document.querySelectorAll('.carousel-control-prev, .carousel-control-next, .carousel-indicators button').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('title') || this.getAttribute('data-bs-original-title');
            const tooltip = bootstrap.Tooltip.getInstance(this);
            if (tooltip) {
                tooltip.dispose();
                this.setAttribute('title', title);
                new bootstrap.Tooltip(this).show();
            }
        });
    });

    // Verifica se estamos na página principal (index.html)
    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';

    // Função para atualizar o menu ativo (apenas na página principal)
    function updateActiveMenu() {
        if (!isMainPage) return;
        
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Encontra a seção atual
        const currentSection = getCurrentSection();
        
        // Remove a classe ativa de todos os links
        navLinks.forEach(link => {
            link.style.color = '';
            link.style.fontWeight = '';
        });
        
        // Adiciona a classe ativa ao link correspondente
        if (currentSection) {
            const currentId = currentSection.getAttribute('id');
            const activeLink = document.querySelector(`.nav-link[href="#${currentId}"]`);
            if (activeLink) {
                activeLink.style.color = '#47B2FF';
                activeLink.style.fontWeight = 'bold';
            }
        }
    }

    // Função para encontrar a próxima seção
    function getNextSection(currentSection) {
        const sections = document.querySelectorAll('section');
        const currentIndex = Array.from(sections).indexOf(currentSection);
        return sections[currentIndex + 1];
    }

    // Função para encontrar a seção anterior
    function getPreviousSection(currentSection) {
        const sections = document.querySelectorAll('section');
        const currentIndex = Array.from(sections).indexOf(currentSection);
        return sections[currentIndex - 1];
    }

    // Função para encontrar a seção atual baseada na posição do scroll
    function getCurrentSection() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + (window.innerHeight / 2);
        
        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                return section;
            }
        }
        return sections[0];
    }

    // Função para navegar entre seções
    function navigateSection(direction) {
        if (!isScrolling) {
            isScrolling = true;
            
            const currentSection = getCurrentSection();
            let targetSection;

            if (direction === 'next') {
                targetSection = getNextSection(currentSection);
            } else {
                targetSection = getPreviousSection(currentSection);
            }

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                // Atualiza o menu após a navegação
                setTimeout(updateActiveMenu, 500);
            }

            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }

    // Variável para controlar o debounce do scroll
    let isScrolling = false;

    // Função para verificar se é dispositivo móvel
    function isMobileDevice() {
        return window.innerWidth <= 768;
    }

    // Adiciona evento de scroll do mouse apenas para desktop E apenas na página principal
    if (isMainPage) {
        window.addEventListener('wheel', function(e) {
            if (!isMobileDevice()) {
                if (e.deltaY > 0) { // Scroll para baixo
                    navigateSection('next');
                } else { // Scroll para cima
                    navigateSection('prev');
                }
                e.preventDefault();
            }
        }, { passive: false });

        // Adiciona evento de teclado para as setas apenas para desktop E apenas na página principal
        document.addEventListener('keydown', function(e) {
            if (!isMobileDevice()) {
                if (e.key === 'ArrowDown') {
                    navigateSection('next');
                    e.preventDefault();
                } else if (e.key === 'ArrowUp') {
                    navigateSection('prev');
                    e.preventDefault();
                }
            }
        });

        // Adiciona evento de clique para cada indicador de scroll apenas para desktop E apenas na página principal
        document.querySelectorAll('.scroll-indicator').forEach(indicator => {
            indicator.addEventListener('click', function(e) {
                if (!isMobileDevice()) {
                    e.preventDefault();
                    const currentSection = this.closest('section');
                    const nextSection = getNextSection(currentSection);
                    
                    if (nextSection) {
                        nextSection.scrollIntoView({ behavior: 'smooth' });
                        // Atualiza o menu após o clique
                        setTimeout(updateActiveMenu, 500);
                    }
                }
            });
        });

        // Adiciona evento de scroll para atualizar o menu (apenas na página principal)
        window.addEventListener('scroll', function() {
            if (!isScrolling && !isMobileDevice()) {
                updateActiveMenu();
            }
        });

        // Inicializa o menu ativo apenas para desktop E apenas na página principal
        if (!isMobileDevice()) {
            updateActiveMenu();
        }
    }

    // Internacionalização
    const translations = {
        pt: {
            inicio: "Início",
            sobre_trabalho: "Sobre meu trabalho",
            sobre_mim: "Sobre mim",
            experiencia: "Experiência profissional",
            entregas: "Projetos profissionais",
            bem_vindo: "Olá, bem-vindo(a) ao meu portfólio",
            localizacao: "Londrina, Paraná, Brasil",
            ajudando_empresas: "Ajudando empresas a tomarem decisões mais inteligentes e baseadas em evidências há 5 anos e 3 meses.",
            work_desc_1: "Com mais de 4 anos de experiência em Tableau (e 2 em Power BI), crio relatórios aplicando princípios de UI/UX design.",
            work_desc_2: "Entretanto, minhas entregas vão além da criação de dashboards — realizo uma verdadeira análise de dados.",
            work_desc_3: "Utilizando Python, desenvolvo análises estatísticas descritivas que auxiliam stakeholders a compreender profundamente seus produtos. Além disso, incluo recomendações para melhorias e as valido por meio de testes de hipótese, geralmente testes A/B.",
            work_desc_4: "Em uma de minhas entregas, consegui um ROI superior a 4000%, representando 20% do faturamento total dos produtos analisados — presente na sessão \"Minhas entregas\".",
            work_desc_5: "Também gero valor por meio de machine learning, criando modelos de previsão de faturamento e clusterização de grupos.",
            basico: "Básico",
            intermediario: "Intermediário",
            avancado: "Avançado",
            especialista: "Especialista",
            ferramentas: "Ferramentas",
            sobre_mim_texto: "Transformo dados em decisões estratégicas, enxergando números como histórias que impulsionam negócios. Em ambientes dinâmicos, não apenas analiso dados, mas busco soluções além do óbvio, antecipando necessidades e propondo melhorias. Se sua empresa valoriza profissionais curiosos, estratégicos e que vão além do esperado, podemos ter um ótimo fit!",
            formacao_academica: "Formação acadêmica",
            pos_graduacao: "Pós-graduação em Análise de dados",
            tecnologo_bd: "Técnologo em Banco de Dados",
            data_science_bd: "(data science, big data & B.I)",
            profissionais_recomendam: "Esses profissionais recomendam meu trabalho",
            experiencias_profissionais: "Experiências profissionais",
            nova_empresa_descricao: "Principal cliente: Brightdome (uma consultoria nos EUA).",
            nova_empresa_detalhes: "Sou responsável por analisar dados de performance e comportamento dos usuários por meio do Google Analytics 4, integrando essas informações ao Google BigQuery para gerar insights e análises aprofundadas. Atuo na implementação e manutenção do tagueamento dos e-commerces dos clientes, garantindo a precisão da coleta de dados por meio do Google Tag Manager. Além disso, elaboro recomendações estratégicas de SEO com base em dados do Google Search Console, identificando oportunidades de otimização que impulsionam o tráfego orgânico e aumentam as taxas de conversão. Também desenvolvo propostas de melhoria em UI/UX design, fundamentadas em princípios de CRO (Conversion Rate Optimization), com foco em aprimorar a experiência do usuário e maximizar os resultados de conversão.",
            hurb_descricao: "O Hurb foi uma empresa de turismo, seus principais produtos eram diárias em hotéis e pacote de viagem.",
            hurb_detalhes: "Dentro da empresa, eu atuava principalmente em Growth, analisando dados usando python em conjunto com bigquery. Em uma de minhas análises no google analytics (GA4) notei uma demanda no mercado que não oferecíamos, portanto criei um teste A/B (usando kameleeon) para entender como os clientes iriam reagir. Eu consegui um ROI de 4000% com este projeto, representando 20% do faturamento total dos produtos em que fiz o teste A/B. Além disso fiz outras entregas de alto valor para a empresa, como uma análise profunda nos dados de hotéis, onde eu criei uma apresentação altamente intuitiva que alcançou todas as áreas da empresa e foi base de grandes tomadas de decisão.",
            hurb_fim: "Infelizmente a empresa veio à falência.",
            frete_descricao: "A frete.com é uma logtech unicórnio, ela é conhecida popularmente por ser \"o uber do caminhoneiro\", pois seu aplicativo Fretebras trabalha conectando motoristas de caminhão à empresas com demanda de frete.",
            frete_detalhes: "Dentro da empresa, trabalhava no setor comercial, com foco nos clientes estratégicos da empresa (key accounts). Usava snowflake para criar consultas SQL que alimentavam os relatórios que eu criava no Tableau (e também no Power BI). Tínhamos um foco grande na qualidade de dados, eu criei uma forma dos usuários verem em tempo real a qualidade dos dados no relatório em que ele estava analisando. Padronizei visualmente todos os relatórios do Tableau, usando táticas de UI/UX design. Fui o responsável pelo projeto de Self-service analytics da empresa, onde o foco era com que os colaboradores conseguissem criar seus próprios relatórios, ensinei 30+ pessoas a usar Tableau. Para esse projeto tive também que padronizar o consumo de dados, criando diversas tabelas One Big Table, para centralizar os dados.",
            whirlpool_descricao: "A Whirlpool é uma gigante global, no Brasil ela é conhecida pelas marcas Brastemp, Consul e Kitchen Aid.",
            whirlpool_detalhes: "Atuei no setor de Trade Marketing, focado na criação de relatórios no Tableau. Utilizava BigQuery para desenvolver consultas SQL que alimentavam essas análises. Minha principal entrega foi um relatório de análise de preços, que comparava os valores dos produtos da empresa com os dos concorrentes, permitindo identificar o preço ideal para cada item e seu principal rival no mercado. Esse relatório embasou decisões estratégicas. Além disso, desenvolvi um script em Python que enviava automaticamente e-mails diários com imagens de relatórios para a diretoria.",
            anterior: "Anterior",
            proximo: "Próximo",
            meus_projetos: "Meus projetos profissionais",
            disclaimer_projetos: "Todos os números apresentados foram alterados para preservar os dados originais das empresas. Elas autorizaram a inclusão dessas entregas neste portfólio, desde que os números fossem modificados.",
            projeto_decoy: "Decoy effect nos preços de pacotes de viagem",
            descricao_decoy: "Esta análise resultou em um ROI de 4000% e 20% do faturamento dos produtos testados. Aqui explico em linguagem natural como eu fiz este projeto, com seus desafios e resultados.",
            projeto_hoteis: "Análise de conversão de hotéis",
            descricao_hoteis: "Estudo detalhado sobre a performance de conversão de vendas de hotéis, identificando padrões de comportamento e oportunidades de melhoria.",
            projeto_erros: "Erros de qualidade de dados em tempo real no dashboard",
            descricao_erros: "O que você faz quando um dashboard amplamente utilizado está com alguma incosistência nos dados? Até você avisar para todas as pessoas sobre o problema pode ser tarde demais e alguém tomar decisões baseadas em dados inconsistentes. A não ser que esta inconsistência seja mostrada no próprio relatório, em tempo real.",
            projeto_desenvolvimento: "Em desenvolvimento",
            descricao_desenvolvimento: "Em desenvolvimento, disponível em breve.",
            nav_inicio: "Início",
            nav_sobre_trabalho: "Sobre meu trabalho",
            nav_sobre_mim: "Sobre mim",
            nav_experiencia: "Experiência profissional",
            nav_entregas: "Projetos profissionais",
            sql_ferramentas: "(Bigquery, snowflake, dremio e t-sql)",
            python_foco: "(focado em análise de dados)",
            periodo_pos: "jan de 2024 - dez de 2024",
            periodo_graduacao: "jun de 2021 - jun de 2023",
            recomendacao_guilherme: "Foi meu gestor direto na frete.com e no Hurb",
            recomendacao_renato: "Foi meu gestor direto na Whirlpool",
            cargo_nova_empresa: "Data & Web analyst pleno · Mar de 2025 - Presente (8 meses)",
            cargo_hurb: "Analista de dados sênior · Mai de 2024 - Fev de 2025 (10 meses)",
            cargo_frete: "Analista de dados & BI · Abr de 2023 - Mai de 2024 (1 ano e 2 meses)",
            cargo_whirlpool: "Consultor analista de business intelligence PL · Dez de 2021 - Abr de 2023 (1 meses e 5 meses)",
            experiencia_anterior: "Experiência anterior",
            proxima_experiencia: "Próxima experiência",
            projetos_anteriores: "Projetos anteriores",
            proximos_projetos: "Próximos projetos",
            // Traduções para páginas de projeto
            projeto_decoy_title: "Decoy effect nos preços de pacotes de viagem",
            projeto_decoy_descricao: "Este projeto foi criado por mim enquanto eu trabalhava no Hurb.",
            projeto_hoteis_title: "Análise de conversão de hotéis",
            projeto_hoteis_descricao: "Este projeto foi criado por mim enquanto eu trabalhava no Hurb.",
            projeto_erros_title: "Erros de qualidade de dados em tempo real no dashboard",
            projeto_erros_descricao: "Este projeto foi criado por mim enquanto eu trabalhava na Frete.com.",
            // Traduções gerais para páginas de projeto
            analise_dados: "Análise de dados",
            disclaimer_projeto: "Todos os números apresentados aqui foram alterados para preservar os dados originais da empresa, tenho autorização para a publicação desta entrega neste portfólio.",
            tempo_leitura: "Tempo estimado de leitura: 5 minutos",
            entendendo_projeto: "Entendendo o projeto",
            primeiros_passos: "Primeiros passos",
            convencer_diretoria: "Convencer a diretoria",
            resultados: "Resultados",
            proximos_passos: "Próximos passos",
            buscando_solucoes: "Buscando soluções",
            funcionamento_pratica: "Funcionamento na prática",
            conclusao: "Conclusão",
            // Traduções específicas do projeto decoy effect
            hurb_descricao_projeto: "O Hurb é uma empresa de turismo, seus principais produtos são diárias em hotéis e pacotes de viagem. Eu estava trabalhando em um projeto para identificar a quantidade ideal de diárias nos pacotes de viagem, com base no destino escolhido pelo cliente.",
            analise_descritiva: "Durante a análise descritiva, utilizando Python, observei que oferecemos praticamente a mesma quantidade de diárias para quase todos os pacotes disponíveis no site: quatro diárias. No entanto, essa abordagem é insustentável, considerando a diversidade de destinos disponíveis. Em muitos deles, quatro diárias não são suficientes para que o viajante conheça sequer 50% das atrações turísticas, enquanto, em outros, esse período é mais do que adequado. Além disso, há uma grande variedade de perfis de clientes—alguns preferem viagens curtas, enquanto outros optam por estadias mais longas.",
            demanda_sete_dias: "Diante disso, busquei entender quais eram as quantidades de diárias mais procuradas para cada destino e constatei que sete diárias possuem uma demanda significativamente maior do que as quatro atualmente oferecidas. No entanto, como o Hurb é reconhecido por seus preços acessíveis, não seria viável simplesmente aumentar a quantidade de diárias, pois isso resultaria em um custo mais elevado para os clientes. Foi então que me lembrei do decoy effect e decidi aplicá-lo fazendo um experimento.",
            resultados_excelentes: "Os resultados foram excelentes, consegui um ROI de 4000% e 20% do faturamento total dos produtos analisados foram por conta deste experimento.",
            // Traduções da seção "Primeiros passos"
            identificacao_oportunidade: "Eu identifiquei essa oportunidade de inserir o decoy effect nos preços do Hurb, mas para que isso acontecesse, eu precisava de ajuda. Imediatamente acionei meu então líder, e mostrei para ele um esboço da ideia, e com prontidão ele me apoiou e começamos ali a criar um plano de ação.",
            convencer_diretoria_growth: "Nós precisávamos convencer a diretoria e coordenação do time de growth (que era responsável pelo portfólio de produtos do Hurb), de que a ideia de adicionar decoy effect no preço dos destinos era muito boa.",
            estrategia_time: "No entanto, nosso time funcionava da seguinte forma: não gostávamos de mostrar o problema, para depois tentar buscar a solução e fazer a solução. Nesta reunião com a diretoria de growth eu deveria mostrar o problema (apenas quatro diárias não é a ideal), dizer qual é a solução (adicionar mais quantidade de diárias) e ainda já mostrar a solução funcionando (o experimento já deveria estar rodando). Acreditávamos que isso é visto com bons olhos pela diretoria, e conseguíriamos grandes aliados de peso em apenas uma reunião.",
            criacao_experimento: "Então antes de qualquer coisa, eu já deveria criar o experimento, e foi o que fiz, usando kameleeon, eu criei um código javascript para alterar alguns pontos no site. Com o auxílio de duas pessoas (uma de pricing e outra de portfólio), eu pedi para que elas criassem um produto no destino Salvador (vou explicar o por que) com a quantidade de diárias que eu solicitei e tentando trazer o menor preço possível, e essas duas pessoas fizeram isso para mim.",
            // Traduções da seção "Convencer a diretoria"
            apresentacao_3_dias: "Agora, com o experimento já rodando, eu tinha apenas 3 dias para montar uma apresentação que tinha o objetivo de convencer a diretoria e coordenação de growth a apoiar o projeto decoy effect. Como toda a apresentação que eu faço, dei todo um overview do problema, mostrei qual seria a solução, e a cereja do bolo é que a solução já estaria rodando no momento em que eu apresentava para eles.",
            apresentacao_ingles: "Esta foi a apresentação que eu fiz (obs.: o então diretor de growth só falava inglês, por isso os slides estão em inglês, eu também apresentei falando em inglês):",
            apoio_diretoria: "Como já era de se esperar, conseguimos o apoio da diretoria e coordenação de growth apenas nesta reunião.",
            meta_projeto: "Como fica claro na apresentação, a meta deste projeto agora não era mais analisar qual era a quantidade de diárias ideal para cada pacote, mas sim aumentar o ticket médio da empresa usando o decoy effect - deixamos para analisar a quantidade ideal após os resultados desse experimento.",
            apoio_necessario: "Nós precisávamos de apoio da diretoria e coordenação de growth pois eles facilitariam (e muito) com que o experimento tivesse resultados mais rápidos. O que eu pedi para eles foi para criar 3 pacotes, em todos os clientes poderiam escolher entre 4, 7 ou 10 diárias, e além disso deixar os 3 pacotes na homepage do Hurb, que é onde temos uma alta visibilidade e consequentemente os resultados do experimento se mostrariam bem mais rapidamente. E claro, prontamente fizeram isso por nós.",
            // Traduções da seção "Resultados"
            mensuracao_resultados: "Então com o experimento já rodando, e os pacotes já publicados na homepage do Hurb, o que me faltava é entender como eu iria mensurar os resultados deste experimento. Embora o kameleeon seja uma ótima ferramenta, encontrei uma limitação nele para este caso específico, então eu tive que recorrer ao bom e velho Google Analytics 4 para extrair os dados que me permitiriam mensurar o projeto.",
            dias_significancia: "Após exatos 49 dias, já tínhamos uma alta significância estatística e alto poder estatístico, de modo geral, os resultados já estavam mais do que prontos para serem divulgados.",
            apresentacao_resultados: "Foi então que com muito orgulho eu criei a apresentação que mostra os resultados do experimento, nela eu mostro específicamente como esse experimento foi um sucesso, não só entregando 4000% de ROI e 20% de faturamento, mas mostrando que 21,2% dos clientes optam por 7 diárias justamente por conta das modificações que eu fiz.",
            // Traduções da seção "Próximos passos"
            decoy_funcionou: "O decoy effect funcionou, mostramos estatísticamente que conseguímos aumentar o ticket médio da empresa com este experimento.",
            proximo_passo_analise: "Deste modo agora o próximo passo seria analisar destino por destino e identificar qual seria o decoy para cada um deles, o que seria mais vantajoso financeiramente para a empresa. Automatizando esse processo através do python, usando dados da empresa em conjunto com dados do Skyscanner.",
            nao_cheguei_nivel: "Infelizmente não consegui chegar neste nível por que fui desligado da empresa por conta de um layoff (pois eu tinha pouco tempo de casa), mas como você pode ver, este projeto foi um sucesso, assim que aplicado.",
            acredito_sucesso: "Acredito fortemente que a empresa irá lucrar muito com este experimento, e que ele será um sucesso assim que aplicado.",
            voltar_portfolio: "Voltar ao portfólio",
            // Traduções da seção "Entendendo o projeto" do projeto de conversão de hotéis
            hoteis_intro: "O Hurb é uma empresa de turismo, seus principais produtos são diárias em hotéis e pacotes de viagem.",
            hoteis_info_perdida: "Durante meu período na empresa, comecei a perceber que informações essenciais para a empresa estavam sendo perdidas, não existiam.<br>As informações de hotéis era uma delas, a empresa tinha as principais métricas calculadas, mas nenhum estudo aprofundado sobre essas métricas nunca tinha sido criado.",
            hoteis_novo_diretor: "Pouco tempo depois, um novo diretor de growth foi contratado, e com ele uma nova visão para a empresa.<br>Ele chegou pedindo várias análises separadamente para entender o funcionamento do nosso produto hotel, foi então que numa conversa com meu gerente, decidimos que eu poderia criar uma grande análise que iria ajuntar tudo que foi pedido e, se eu quisesse, adicionar mais informações que eu considerasse importantes.",
            hoteis_ponto_partida: "Este foi o ponto de partida para este projeto, prontamente fui conversar com o diretor de growth para entender detalhadamente o que ele gostaria de ver, entendi que ele gostaria mesmo é entender como estava a taxa de conversão de hotéis na nossa plataforma.",
            hoteis_metodologia: "Para esta análise, utilizei python para fazer uma análise exploratória profunda nos dados, consumindo dados majoritariamente do Google Analytics 4 (GA4) e dados de vendas no bigquery.",
            hoteis_overview: "Como toda apresentação que faço, costumo primeiro dar um overview do todo, e depois vou detalhando cada informação de forma clara e objetiva, e o que me diferencia é que além de trazer os números, eu sempre levo também pontos de ação, ou seja, eu sempre coloco recomendações do que fazer a partir desses dados, e também já crio experimentos com base nas recomendações.",
            hoteis_ingles: "O então diretor de growth só falava em inglês, então além de me comunicar com ele exclusivamente em inglês, tive também que criar a apresentação em inglês.",
            hoteis_reconhecimento: "Essa apresentação ficou tão bem detalhada e profunda, que me gerou muito reconhecimento na empresa, muitas pessoas a viram e tomaram grandes decisões a partir dela.",
            hoteis_apresentacao: "Aqui a apresentação em si, espero que goste!",
            disclaimer_slide: "Todos os números apresentados no slide foram alterados para preservar os dados originais da empresa, tenho autorização para a publicação desta entrega neste portfólio.",
        },
        en: {
            inicio: "Home",
            sobre_trabalho: "About my work",
            sobre_mim: "About me",
            experiencia: "Professional experience",
            entregas: "Professional projects",
            bem_vindo: "Hello, welcome to my portfolio",
            localizacao: "Londrina, Parana, Brazil",
            ajudando_empresas: "Helping companies make smarter, evidence-based decisions for 5 years and 3 months.",
            work_desc_1: "With over 4 years of experience in Tableau (and 2 in Power BI), I create reports applying UI/UX design principles.",
            work_desc_2: "However, my deliveries go beyond dashboard creation — I perform true data analysis.",
            work_desc_3: "Using Python, I develop descriptive statistical analyses that help stakeholders deeply understand their products. I also include recommendations for improvements and validate them through hypothesis testing, usually A/B tests.",
            work_desc_4: "In one of my projects, I achieved an ROI above 4000%, representing 20% of the total revenue of the analyzed products — see the \"Professional projects\" section.",
            work_desc_5: "I also generate value through machine learning, creating revenue forecasting models and group clustering.",
            basico: "Basic",
            intermediario: "Intermediate",
            avancado: "Advanced",
            especialista: "Expert",
            ferramentas: "Tools",
            sobre_mim_texto: "I transform data into strategic decisions, seeing numbers as stories that drive business. In dynamic environments, I don't just analyze data, but seek solutions beyond the obvious, anticipating needs and proposing improvements. If your company values curious, strategic professionals who go beyond expectations, we could be a great fit!",
            formacao_academica: "Academic background",
            pos_graduacao: "Graduate degree in Data Analysis",
            tecnologo_bd: "Database Technology degree",
            data_science_bd: "(data science, big data & B.I)",
            profissionais_recomendam: "These professionals recommend my work",
            experiencias_profissionais: "Professional Experience",
            nova_empresa_descricao: "Main client: Brightdome (a consulting firm in the U.S.).",
            nova_empresa_detalhes: "I’m responsible for analyzing user performance and behavior data through Google Analytics 4, integrating this information with Google BigQuery to generate insights and in-depth analyses. I work on the implementation and maintenance of clients’ e-commerce tagging, ensuring data collection accuracy through Google Tag Manager. In addition, I provide strategic SEO recommendations based on data from Google Search Console, identifying optimization opportunities that drive organic traffic and increase conversion rates. I also develop UI/UX design improvement proposals grounded in CRO (Conversion Rate Optimization) principles, focusing on enhancing user experience and maximizing conversion results.",
            hurb_descricao: "Hurb was a tourism company, its main products were hotel daily rates and travel packages.",
            hurb_detalhes: "Within the company, I worked primarily in Growth, analyzing data using Python in conjunction with BigQuery. In one of my Google Analytics (GA4) analyses, I noticed a market demand that we didn't offer, so I created an A/B test (using Kameleoon) to understand how customers would react. I achieved a 4000% ROI with this project, representing 20% of the total revenue of the products I tested. I also made other high-value deliveries for the company, such as a deep analysis of hotel data, where I created a highly intuitive presentation that reached all areas of the company and was the basis for major decision-making.",
            hurb_fim: "Unfortunately, the company bankrupt, and I was laid off.",
            frete_descricao: "Frete.com is a unicorn logtech company, popularly known as \"the Uber for truck drivers\", as its Fretebras app works by connecting truck drivers to companies with freight demand.",
            frete_detalhes: "Within the company, I worked in the commercial sector, focusing on the company's strategic clients (key accounts). I used Snowflake to create SQL queries that fed the reports I created in Tableau (and also in Power BI). We had a strong focus on data quality, I created a way for users to see in real-time the quality of data in the report they were analyzing. I standardized all Tableau reports visually, using UI/UX design tactics. I was responsible for the company's Self-service analytics project, where the focus was on enabling collaborators to create their own reports, I taught 30+ people to use Tableau. For this project, I also had to standardize data consumption, creating several One Big Table tables to centralize data.",
            whirlpool_descricao: "Whirlpool is a global giant, in Brazil it is known for the Brastemp, Consul and Kitchen Aid brands.",
            whirlpool_detalhes: "I worked in the trade marketing department, with my main responsibility being the creation of Tableau reports.\nI used BigQuery to write SQL queries that powered these reports.\n\nMy most impactful delivery for the company was a pricing analysis report, which analyzed the market by comparing competitors' product prices with the company's own. This report allowed us to determine the optimal price point for each product and identify its main competitor. Major business decisions were made based on this analysis.\n\nAdditionally, I developed a Python script that automatically sent daily emails with report images to the company's executive board.",
            anterior: "Previous",
            proximo: "Next",
            meus_projetos: "My Professional Projects",
            disclaimer_projetos: "All numbers presented have been altered to preserve the original company data.They authorized the inclusion of these deliveries in this portfolio, provided the numbers were modified.",
            projeto_decoy: "Decoy effect in travel package pricing",
            descricao_decoy: "This analysis resulted in a 4000% ROI and 20% of the revenue of tested products. Here I explain in natural language how I did this project, with its challenges and results.",
            projeto_hoteis: "Hotel conversion analysis",
            descricao_hoteis: "Detailed study on hotel sales conversion performance, identifying behavior patterns and improvement opportunities.",
            projeto_erros: "Real-time data quality errors in dashboard",
            descricao_erros: "What do you do when a widely used dashboard has some data inconsistency? By the time you notify everyone about the problem, it might be too late and someone makes decisions based on inconsistent data. Unless this inconsistency is shown in the report itself, in real-time.",
            projeto_desenvolvimento: "In development",
            descricao_desenvolvimento: "In development, available soon.",
            nav_inicio: "Home",
            nav_sobre_trabalho: "About my work",
            nav_sobre_mim: "About me",
            nav_experiencia: "Professional experience",
            nav_entregas: "Professional projects",
            sql_ferramentas: "(BigQuery, Snowflake, Dremio and T-SQL)",
            python_foco: "(focused on data analysis)",
            periodo_pos: "Jan 2024 - Dec 2024",
            periodo_graduacao: "Jun 2021 - Jun 2023",
            recomendacao_guilherme: "Was my direct manager at frete.com and Hurb",
            recomendacao_renato: "Was my direct manager at Whirlpool",
            cargo_nova_empresa: "Mid-level Data & Web Analyst · Mar 2025 – Present (8 months)",
            cargo_hurb: "Senior Data Analyst · May 2024 - Feb 2025 (10 months)",
            cargo_frete: "Data Analyst & BI · Apr 2023 - May 2024 (1 year and 2 months)",
            cargo_whirlpool: "Junior Data Analyst · Dec 2020 - Jan 2022 (1 year and 2 months)",
            experiencia_anterior: "Previous experience",
            proxima_experiencia: "Next experience",
            projetos_anteriores: "Previous projects",
            proximos_projetos: "Next projects",
            // Traduções para páginas de projeto
            projeto_decoy_title: "Decoy effect in travel package pricing",
            projeto_decoy_descricao: "This project was created by me while I was working at Hurb.",
            projeto_hoteis_title: "Hotel conversion analysis",
            projeto_hoteis_descricao: "This project was created by me while I was working at Hurb.",
            projeto_erros_title: "Real-time data quality errors in dashboard",
            projeto_erros_descricao: "This project was created by me while I was working at Frete.com.",
            // Traduções gerais para páginas de projeto
            analise_dados: "Data Analysis",
            disclaimer_projeto: "All numbers presented here have been altered to preserve the original company data, I have authorization to publish this delivery in this portfolio.",
            tempo_leitura: "Estimated reading time: 5 minutes",
            entendendo_projeto: "Understanding the project",
            primeiros_passos: "First steps",
            convencer_diretoria: "Convincing the board",
            resultados: "Results",
            proximos_passos: "Next steps",
            buscando_solucoes: "Looking for solutions",
            funcionamento_pratica: "Functioning in practice",
            conclusao: "Conclusion",
            // Traduções específicas do projeto decoy effect
            hurb_descricao_projeto: "Hurb is a tourism company, its main products are hotel daily rates and travel packages. I was working on a project to identify the ideal quantity of daily rates in travel packages, based on the destination chosen by the client.",
            analise_descritiva: "During the descriptive analysis, using Python, I noticed that we were offering almost the same quantity of daily rates for almost all available packages on the site: four daily rates. However, this approach is unsustainable, considering the diversity of available destinations. In many of them, four daily rates are not enough for the traveler to know even 50% of the tourist attractions, while, in others, this period is more than enough. In addition, there is a great variety of client profiles—some prefer short trips, while others opt for longer stays.",
            demanda_sete_dias: "Given this, I wanted to understand which were the quantities of daily rates most sought after for each destination and I noticed that seven daily rates have a significantly greater demand than the four currently offered. However, as Hurb is recognized for its affordable prices, it would not be feasible simply to increase the quantity of daily rates, as this would result in a higher cost for the clients. It was then that I remembered the decoy effect and decided to apply it by making an experiment.",
            resultados_excelentes: "The results were excellent, I achieved a 4000% ROI and 20% of the total revenue of the analyzed products were due to this experiment.",
            // Traduções da seção "Primeiros passos"
            identificacao_oportunidade: "I identified this opportunity to insert the decoy effect in Hurb's prices, but for this to happen, I needed help. I immediately contacted my then leader, showed him a sketch of the idea, and he promptly supported me and we started creating an action plan right there.",
            convencer_diretoria_growth: "We needed to convince the board and growth team coordination (which was responsible for Hurb's product portfolio) that the idea of adding decoy effect to destination prices was very good.",
            estrategia_time: "However, our team worked as follows: we didn't like to show the problem, then try to find the solution and implement the solution. In this meeting with the growth board, I should show the problem (only four daily rates is not ideal), say what the solution is (add more quantity of daily rates) and also already show the solution working (the experiment should already be running). We believed that this is seen favorably by the board, and we would get great heavyweight allies in just one meeting.",
            criacao_experimento: "So before anything else, I should already create the experiment, and that's what I did, using Kameleoon, I created a JavaScript code to change some points on the site. With the help of two people (one from pricing and another from portfolio), I asked them to create a product in the Salvador destination (I'll explain why) with the quantity of daily rates I requested and trying to bring the lowest possible price, and these two people did that for me.",
            // Traduções da seção "Convencer a diretoria"
            apresentacao_3_dias: "Now, with the experiment already running, I had only 3 days to put together a presentation that aimed to convince the board and growth coordination to support the decoy effect project. As with every presentation I make, I gave a complete overview of the problem, showed what the solution would be, and the cherry on top is that the solution would already be running at the moment I presented to them.",
            apresentacao_ingles: "This was the presentation I made (note: the then growth director only spoke English, which is why the slides are in English, I also presented speaking in English):",
            apoio_diretoria: "As expected, we got the support of the board and growth coordination in just this meeting.",
            meta_projeto: "As is clear in the presentation, the goal of this project now was no longer to analyze what the ideal quantity of daily rates was for each package, but rather to increase the company's average ticket using the decoy effect - we left the analysis of the ideal quantity after the results of this experiment.",
            apoio_necessario: "We needed the support of the board and growth coordination because they would facilitate (and a lot) that the experiment had faster results. What I asked them was to create 3 packages, in all of them clients could choose between 4, 7 or 10 daily rates, and also leave the 3 packages on Hurb's homepage, which is where we have high visibility and consequently the experiment results would show much faster. And of course, they promptly did that for us.",
            // Traduções da seção "Resultados"
            mensuracao_resultados: "So with the experiment already running, and the packages already published on Hurb's homepage, what I was missing was understanding how I would measure the results of this experiment. Although Kameleoon is an excellent tool, I found a limitation in it for this specific case, so I had to resort to good old Google Analytics 4 to extract the data that would allow me to measure the project.",
            dias_significancia: "After exactly 49 days, we already had high statistical significance and high statistical power, in general, the results were more than ready to be disclosed.",
            apresentacao_resultados: "It was then that with great pride I created the presentation that shows the results of the experiment, in it I specifically show how this experiment was a success, not only delivering 4000% ROI and 20% revenue, but showing that 21.2% of clients choose 7 daily rates precisely because of the modifications I made.",
            // Traduções da seção "Próximos passos"
            decoy_funcionou: "The decoy effect worked, we statistically showed that we increased the company's average ticket with this experiment.",
            proximo_passo_analise: "From this point, the next step would be to analyze destination by destination and identify what would be the decoy for each one, which would be more financially advantageous for the company. Automating this process through Python, using company data in conjunction with Skyscanner data.",
            nao_cheguei_nivel: "Unfortunately, I couldn't reach this level because I was laid off from the company due to a layoff (since I had little time at home), but as you can see, this project was a success as soon as it was applied.",
            acredito_sucesso: "I strongly believe that the company will make a lot of money with this experiment, and that it will be a success as soon as it is applied.",
            voltar_portfolio: "Back to portfolio",
            // Traduções da seção "Entendendo o projeto" do projeto de conversão de hotéis
            hoteis_intro: "Hurb is a tourism company, its main products are hotel daily rates and travel packages.",
            hoteis_info_perdida: "During my time at the company, I began to notice that essential information for the company was being lost, it didn't exist.<br>Hotel information was one of them, the company had the main metrics calculated, but no in-depth study of these metrics had ever been created.",
            hoteis_novo_diretor: "Shortly after, a new growth director was hired, bringing a new vision to the company.<br>He started by requesting several separate analyses to understand how our hotel product worked, so in a conversation with my manager, we decided that I could create a big analysis that would bring together everything that was requested and, if I wanted, add more information that I considered important.",
            hoteis_ponto_partida: "This was the starting point for this project, I promptly went to talk to the growth director to understand in detail what he would like to see, I understood that he really wanted to know how the hotel conversion rate was on our platform.",
            hoteis_metodologia: "For this analysis, I used Python to do a deep exploratory analysis of the data, consuming data mainly from Google Analytics 4 (GA4) and sales data from BigQuery.",
            hoteis_overview: "As with every presentation I make, I usually first give an overview of everything, and then I detail each piece of information clearly and objectively, and what sets me apart is that in addition to bringing the numbers, I always also bring action points, that is, I always make recommendations on what to do based on this data, and I also create experiments based on the recommendations.",
            hoteis_ingles: "The then growth director only spoke English, so in addition to communicating with him exclusively in English, I also had to create the presentation in English.",
            hoteis_reconhecimento: "This presentation was so detailed and deep that it brought me a lot of recognition in the company, many people saw it and made big decisions based on it.",
            hoteis_apresentacao: "Here is the presentation itself, I hope you like it!",
            disclaimer_slide: "All numbers presented in the slide have been changed to preserve the company's original data, and I have authorization to publish this delivery in this portfolio.",
        }
    };

    function setLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        
        // Traduzir títulos dos tooltips
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (translations[lang][key]) {
                el.setAttribute('title', translations[lang][key]);
            }
        });
        
        // Salva preferência
        localStorage.setItem('site-lang', lang);
    }

    document.getElementById('lang-pt').addEventListener('click', () => setLanguage('pt'));
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

    // Carrega idioma salvo ou padrão pt
    window.addEventListener('DOMContentLoaded', () => {
        const lang = localStorage.getItem('site-lang') || 'pt';
        setLanguage(lang);
    });
});

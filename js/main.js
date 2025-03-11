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

    // Função para atualizar o menu ativo
    function updateActiveMenu() {
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

    // Adiciona evento de scroll do mouse apenas para desktop
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

    // Adiciona evento de teclado para as setas apenas para desktop
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

    // Adiciona evento de clique para cada indicador de scroll apenas para desktop
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

    // Adiciona evento de scroll para atualizar o menu
    window.addEventListener('scroll', function() {
        if (!isScrolling && !isMobileDevice()) {
            updateActiveMenu();
        }
    });

    // Inicializa o menu ativo apenas para desktop
    if (!isMobileDevice()) {
        updateActiveMenu();
    }
});

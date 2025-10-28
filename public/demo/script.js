// 初始化页面数据
function initializePageData() {
    if (typeof siteData === 'undefined') {
        console.error('数据文件未加载，请确保已引入 data.js');
        return;
    }

    // 更新页面标题
    document.title = siteData.site.title;
    const logoElement = document.querySelector('.logo h1');
    if (logoElement) {
        logoElement.textContent = siteData.site.logoText;
    }

    // 渲染导航栏
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        navLinksContainer.innerHTML = siteData.navigation.map(item => 
            `<li><a href="${item.href}">${item.text}</a></li>`
        ).join('');
    }

    // 渲染 Hero Section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const badge = heroSection.querySelector('.badge');
        if (badge) {
            badge.innerHTML = `${siteData.hero.badge.text} <i class="${siteData.hero.badge.icon} ml-2"></i>`;
        }

        const heroTitle = heroSection.querySelector('.hero-content h1');
        if (heroTitle) {
            heroTitle.textContent = siteData.hero.title;
        }

        const heroSubtitle = heroSection.querySelector('.hero-content > p');
        if (heroSubtitle) {
            heroSubtitle.textContent = siteData.hero.subtitle;
        }

        const codeSnippet = heroSection.querySelector('.data-snippet');
        if (codeSnippet) {
            codeSnippet.textContent = siteData.hero.codeSnippet;
        }

        const ctaButtons = heroSection.querySelector('.cta-buttons');
        if (ctaButtons) {
            ctaButtons.innerHTML = siteData.hero.buttons.map(btn =>
                `<a href="${btn.href}" class="btn ${btn.class}">${btn.text} <i class="${btn.icon}"></i></a>`
            ).join('');
        }

        const heroImage = heroSection.querySelector('.hero-image img');
        if (heroImage) {
            heroImage.src = siteData.hero.image.src;
            heroImage.alt = siteData.hero.image.alt;
        }

        const imageBadge = heroSection.querySelector('.image-badge');
        if (imageBadge) {
            imageBadge.textContent = siteData.hero.image.badge;
        }
    }

    // 渲染 About Section
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const aboutTitle = aboutSection.querySelector('.section-header h2');
        if (aboutTitle) {
            aboutTitle.textContent = siteData.about.title;
        }

        const aboutText = aboutSection.querySelector('.about-text');
        if (aboutText) {
            aboutText.innerHTML = siteData.about.paragraphs.map(p =>
                `<p>${p}</p>`
            ).join('');
        }

        const aboutStats = aboutSection.querySelector('.about-stats');
        if (aboutStats) {
            aboutStats.innerHTML = siteData.about.stats.map(stat =>
                `<div class="stat-item">
                    <span class="stat-number">${stat.number}</span>
                    <span class="stat-text">${stat.text}</span>
                </div>`
            ).join('');
        }
    }

    // 渲染 Features Section
    const featuresSection = document.querySelector('.features');
    if (featuresSection) {
        const featuresTitle = featuresSection.querySelector('.section-header h2');
        if (featuresTitle) {
            featuresTitle.textContent = siteData.features.title;
        }

        const featuresSubtitle = featuresSection.querySelector('.section-subtitle');
        if (featuresSubtitle) {
            featuresSubtitle.textContent = siteData.features.subtitle;
        }

        const featuresGrid = featuresSection.querySelector('.features-grid');
        if (featuresGrid) {
            featuresGrid.innerHTML = siteData.features.items.map((feature, index) =>
                `<div class="feature-card">
                    <div class="feature-icon">
                        <i class="${feature.icon}"></i>
                    </div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                    <div class="table-pattern-${index + 1}"></div>
                    <div class="feature-decoration">
                        <i class="${feature.icon} feature-bg-icon"></i>
                    </div>
                </div>`
            ).join('');
        }
    }

    // 渲染 Demo Section
    const demoSection = document.querySelector('.demo');
    if (demoSection) {
        const demoTitle = demoSection.querySelector('.section-header h2');
        if (demoTitle) {
            demoTitle.textContent = siteData.demo.title;
        }

        const demoSubtitle = demoSection.querySelector('.section-subtitle');
        if (demoSubtitle) {
            demoSubtitle.textContent = siteData.demo.subtitle;
        }

        const demoVideo = demoSection.querySelector('#demo-video source');
        if (demoVideo) {
            demoVideo.src = siteData.demo.video.src;
            demoVideo.type = siteData.demo.video.type;
            // 重新加载视频
            const videoElement = document.getElementById('demo-video');
            if (videoElement) {
                videoElement.load();
            }
        }

        const demoText = demoSection.querySelector('.demo-text p');
        if (demoText) {
            demoText.textContent = siteData.demo.description;
        }
    }

    // 渲染 Solution Section
    const solutionSection = document.querySelector('.solution');
    if (solutionSection) {
        const solutionTitle = solutionSection.querySelector('.section-header h2');
        if (solutionTitle) {
            solutionTitle.textContent = siteData.solution.title;
        }

        const solutionSubtitle = solutionSection.querySelector('.section-subtitle');
        if (solutionSubtitle) {
            solutionSubtitle.textContent = siteData.solution.subtitle;
        }

        const solutionImage = solutionSection.querySelector('.solution-diagram img');
        if (solutionImage) {
            solutionImage.src = siteData.solution.image.src;
            solutionImage.alt = siteData.solution.image.alt;
        }

        const solutionText = solutionSection.querySelector('.solution-text');
        if (solutionText) {
            solutionText.innerHTML = `
                <p>${siteData.solution.intro}</p>
                <ul class="solution-list">
                    ${siteData.solution.points.map(point =>
                        `<li><span class="highlight">${point.highlight}</span> ${point.text}</li>`
                    ).join('')}
                </ul>
            `;
        }
    }

    // 渲染 Contact Section
    const contactSection = document.querySelector('.contact');
    if (contactSection) {
        const contactTitle = contactSection.querySelector('.section-header h2');
        if (contactTitle) {
            contactTitle.textContent = siteData.contact.title;
        }

        const contactSubtitle = contactSection.querySelector('.section-subtitle');
        if (contactSubtitle) {
            contactSubtitle.textContent = siteData.contact.subtitle;
        }

        const contactInfo = contactSection.querySelector('.contact-info-centered');
        if (contactInfo) {
            contactInfo.innerHTML = `
                ${siteData.contact.items.map(item =>
                    `<div class="contact-item">
                        <i class="${item.icon}"></i>
                        <div class="contact-text">
                            <p>${item.text}</p>
                        </div>
                    </div>`
                ).join('')}
                <div class="social-links">
                    <a href="${siteData.contact.social.github.url}" target="_blank" title="GitHub">
                        <i class="${siteData.contact.social.github.icon}"></i>
                        <span>${siteData.contact.social.github.text}</span>
                    </a>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面数据
    initializePageData();

    // 导航栏响应式菜单
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 点击导航链接时关闭菜单
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // 代码片段动画效果
    const dataSnippet = document.querySelector('.data-snippet');
    if (dataSnippet) {
        // 光标闪烁效果
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.innerHTML = '|';
        cursor.style.marginLeft = '2px';
        cursor.style.animation = 'blink 1s infinite';
        dataSnippet.appendChild(cursor);
        
        // 添加打字效果样式
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            .typing-effect {
                overflow: hidden;
                white-space: nowrap;
                border-right: 2px solid transparent;
                animation: typing 3s steps(40, end), blink-caret .75s step-end infinite;
            }
            @keyframes typing {
                from { width: 0 }
                to { width: 100% }
            }
            @keyframes blink-caret {
                from, to { border-color: transparent }
                50% { border-color: #1a73e8; }
            }
        `;
        document.head.appendChild(style);
        
        // 在页面滚动到可见区域时启动打字效果
        const handleScroll = function() {
            const snippetContainer = document.querySelector('.data-snippet-container');
            if (snippetContainer) {
                const elementPosition = snippetContainer.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementPosition < windowHeight - 100) {
                    dataSnippet.classList.add('typing-effect');
                    window.removeEventListener('scroll', handleScroll);
                }
            }
        };
        
        // 页面加载时检查
        handleScroll();
        
        // 滚动时检查
        window.addEventListener('scroll', handleScroll);
    }

    // 滚动动画 - 带有递增效果
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .stat-item, .solution-content > div, .floating-table');
        
        elements.forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                // 添加一个小延迟，使元素按顺序出现
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = element.style.transform.replace('translateY(30px)', 'translateY(0)');
                }, index * 100);
            }
        });
    };

    // 初始化滚动元素样式
    const scrollElements = document.querySelectorAll('.feature-card, .stat-item, .solution-content > div');
    scrollElements.forEach(element => {
        element.style.opacity = '0';
        if (!element.style.transform) {
            element.style.transform = 'translateY(30px)';
        } else {
            element.style.transform += ' translateY(30px)';
        }
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    // 页面加载时立即检查
    animateOnScroll();
    
    // 滚动时检查
    window.addEventListener('scroll', animateOnScroll);

    // 视频播放控制
    const videoContainer = document.querySelector('.video-container');
    const videoOverlay = document.querySelector('.video-overlay');
    const demoVideo = document.getElementById('demo-video');
    
    if (videoOverlay && demoVideo) {
        videoOverlay.addEventListener('click', function() {
            videoOverlay.style.opacity = '0';
            setTimeout(() => {
                videoOverlay.style.display = 'none';
            }, 300);
            demoVideo.play();
        });
        
        demoVideo.addEventListener('pause', function() {
            videoOverlay.style.display = 'flex';
            setTimeout(() => {
                videoOverlay.style.opacity = '1';
            }, 10);
        });
        
        demoVideo.addEventListener('ended', function() {
            videoOverlay.style.display = 'flex';
            setTimeout(() => {
                videoOverlay.style.opacity = '1';
            }, 10);
        });
    }

    // 浮动表格动画
    const floatingTables = document.querySelectorAll('.floating-table');
    
    floatingTables.forEach((table, index) => {
        table.style.opacity = '0';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        table.style.opacity = '0.7';
                    }, index * 200);
                    observer.unobserve(table);
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(table);
    });
    
    // 表格图案动画
    const tablePatterns = document.querySelectorAll('.table-pattern-1, .table-pattern-2, .table-pattern-3, .table-pattern-4');
    
    tablePatterns.forEach(pattern => {
        const featureCard = pattern.closest('.feature-card');
        
        if (featureCard) {
            featureCard.addEventListener('mouseenter', function() {
                pattern.style.opacity = '0.2';
                pattern.style.transform = pattern.style.transform + ' scale(1.1)';
            });
            
            featureCard.addEventListener('mouseleave', function() {
                pattern.style.opacity = '0.1';
                pattern.style.transform = pattern.style.transform.replace(' scale(1.1)', '');
            });
        }
    });

    // 特性卡片交互
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            
            const bgIcon = this.querySelector('.feature-bg-icon');
            if (bgIcon) {
                bgIcon.style.opacity = '0.06';
                bgIcon.style.transform = 'rotate(-5deg) scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
            
            const bgIcon = this.querySelector('.feature-bg-icon');
            if (bgIcon) {
                bgIcon.style.opacity = '0.03';
                bgIcon.style.transform = 'rotate(-10deg) scale(1)';
            }
        });
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 表单提交处理
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const messageInput = contactForm.querySelector('textarea');
            
            // 简单验证
            if (nameInput.value && emailInput.value && messageInput.value) {
                // 在这里可以添加AJAX请求发送表单数据的代码
                // 显示成功信息
                alert('感谢您的留言！我们会尽快回复您。');
                contactForm.reset();
            } else {
                alert('请填写所有必填字段。');
            }
        });
    }

    // 简单的视频加载优化
    const video = document.querySelector('video');
    if (video) {
        // 添加加载中提示
        const videoContainer = document.querySelector('.video-container');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'video-loading';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>视频加载中...</p>';
        loadingDiv.style.position = 'absolute';
        loadingDiv.style.top = '0';
        loadingDiv.style.left = '0';
        loadingDiv.style.width = '100%';
        loadingDiv.style.height = '100%';
        loadingDiv.style.display = 'flex';
        loadingDiv.style.flexDirection = 'column';
        loadingDiv.style.justifyContent = 'center';
        loadingDiv.style.alignItems = 'center';
        loadingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        loadingDiv.style.color = 'white';
        loadingDiv.style.fontSize = '1.5rem';
        loadingDiv.style.zIndex = '10';
        
        if (videoContainer) {
            videoContainer.style.position = 'relative';
            videoContainer.appendChild(loadingDiv);
        }
        
        video.addEventListener('canplay', function() {
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }
        });
    }
}); 
// CACOBI 网站数据配置文件

const siteData = {
    // 网站基本信息
    site: {
        title: "Demonstration CACOBI: Accelerating BI Pipeline through Caching and Cost Planner",
        logoText: "CACOBI"
    },

    // 导航栏
    navigation: [
        { href: "#home", text: "Home" },
        { href: "#about", text: "About" },
        { href: "#features", text: "Features" },
        { href: "#demo", text: "Demo" },
        { href: "#contact", text: "Contact" }
    ],

    // Hero Section
    hero: {
        badge: {
            text: "Research Project",
            icon: "fas fa-flask"
        },
        title: "CACOBI",
        subtitle: " Accelerating BI Pipeline through Caching and Cost Planner",
        codeSnippet: '包含洗衣液成分关键词的笔记作者ip属地分布，近30天',
        buttons: [
            {
                href: "#demo",
                text: "Watch Demo",
                icon: "fas fa-play-circle",
                class: "primary-btn"
            },
            {
                href: "#features",
                text: "Learn More",
                icon: "fas fa-arrow-right",
                class: "secondary-btn"
            }
        ],
        image: {
            // 可以切换图片
            src: "assets/demo_teaser.png",
            alt: "CACOBI Interface",
            badge: "CACOBI"
        }
    },

    // About Section
    about: {
        title: "About CACOBI",
        paragraphs: ["To address these issues, we present CACOBI, \
            an efficiency-oriented BI system equipped with a cost planner and a semantic cache.",
            "The cost planner, trained via reinforcement learning, \
            can dynamically determine execution plans that skip redundant steps without compromising accuracy.",
            "Meanwhile, we propose a cache-based shortcut that retrieves semantically similar queries and their DSLs from a carefully designed cache during inference, \
            thereby enabling the LLM to directly synthesize the target DSL rather than generating it from scratch."],
        stats: [
            {
                number: "Cost Planner",
                text: "Dynamically determine execution plans"
            },
            {
                number: "Caching",
                text: "Retrieves semantically similar queries to synthesize the target DSL"
            },
            {
                number: "RL",
                text: "Leveraging RL for Enhanced Decision Making"
            }
        ]
    },

    // Features Section
    features: {
        title: "Key Features",
        subtitle: "Discover what makes CACOBI powerful and intuitive",
        items: [
            {
                icon: "fas fa-search",
                title: "Natural Language Conditional Table Search",
                description: "Search for tables using natural language queries with specific conditions (e.g., \"CS grade above 90\") without needing complex query syntax."
            },
            {
                icon: "fas fa-code-branch",
                title: "Advanced Table Fusion",
                description: "Novel fusion-based solutions for handling both natural language conditions and query tables as input."
            },
            {
                icon: "fas fa-brain",
                title: "Intelligent LLM Integration",
                description: "Carefully designed prompts enable LLMs to recognize table discovery tasks and invoke appropriate methods."
            },
            {
                icon: "fas fa-project-diagram",
                title: "Multi-Interface System",
                description: "Access table repository, table search, and table processing through intuitive interfaces."
            }
        ]
    },

    // Demo Section
    demo: {
        title: "Research Demonstration",
        subtitle: "See CACOBI in action",
        video: {
            src: "video.mp4",
            type: "video/mp4"
        },
        description: "This demonstration showcases CACOBI's three main interfaces: \
        the table repository, table search, and table processing. \
        We illustrate how users can leverage natural language queries to discover relevant tables, \
        apply conditions to refine results, and perform complex table manipulations."
    },

    // Solution Section
    solution: {
        title: "Our Solution",
        subtitle: "How we address the challenge of BI",
        image: {
            src: "assets/demo_page.png",
            alt: "CACOBI Architecture"
        },
        intro: "We propose CACOBI, an LLM-based table assistant capable of advanced table discovery. Our approach includes:",
        points: [
            {
                highlight: "NLCTD Definition:",
                text: "We define a new table discovery scenario named Natural Language Conditional Table Discovery (NLCTD) that accepts both natural language conditions and query tables as input."
            },
            {
                highlight: "LLM Integration:",
                text: "We prompt LLMs with carefully designed instructions to recognize table discovery tasks and invoke appropriate discovery methods."
            },
            {
                highlight: "Fusion-Based Solution:",
                text: "Our novel fusion method makes table discovery more intuitive and user-friendly."
            },
            {
                highlight: "Three-Interface System:",
                text: "Table repository for data management, table search for discovery, and table processing for operations."
            }
        ]
    },

    // Contact Section
    contact: {
        title: "Contact Us",
        subtitle: "Get in touch with our research team",
        items: [
            {
                icon: "fas fa-envelope",
                text: "cuilingxi.cs@zju.edu.cn"
            },
            {
                icon: "fas fa-map-marker-alt",
                text: "College of Computer Science and Technology, Zhejiang University"
            },
            {
                icon: "fas fa-map-marker-alt",
                text: "XiaoHongShu"
            }
        ],
        social: {
            github: {
                url: "https://github.com/SuDIS-ZJU",
                text: "SuDIS-ZJU",
                icon: "fab fa-github"
            }
        }
    }
};

// 导出数据供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteData;
}

// CACOBI 网站数据配置文件
const siteData = {
  // 网站基本信息
  site: {
    title: 'Demonstration CACOBI: Accelerating BI Pipeline through Caching and Cost Planner',
    logoText: 'CACOBI',
  },

  // 导航栏
  navigation: [
    { href: '#home', text: 'Home' },
    { href: '#about', text: 'About' },
    { href: '#features', text: 'Features' },
    { href: '#demo', text: 'Demo' },
    { href: '#contact', text: 'Contact' },
  ],

  // Hero Section
  hero: {
    badge: {
      text: 'Research Project',
      icon: 'fas fa-flask',
    },
    title: 'CACOBI',
    subtitle: ' Accelerating BI Pipeline through Caching and Cost Planner',
    codeSnippet: '包含洗衣液成分关键词的笔记作者ip属地分布，近30天',
    buttons: [
      {
        href: '#demo',
        text: 'Watch Demo',
        icon: 'fas fa-play-circle',
        class: 'primary-btn',
      },
      {
        href: '#features',
        text: 'Learn More',
        icon: 'fas fa-arrow-right',
        class: 'secondary-btn',
      },
    ],
    image: {
      // 可以切换图片
      src: 'assets/demo_teaser.png',
      alt: 'CACOBI Interface',
      badge: 'CACOBI',
    },
  },

  // About Section
  about: {
    title: 'About CACOBI',
    paragraphs: [
      'To address these issues, we present CACOBI, \
            an efficiency-oriented BI system equipped with a cost planner and a semantic cache.',
      'The cost planner, trained via reinforcement learning, \
            can dynamically determine execution plans that skip redundant steps without compromising accuracy.',
      'Meanwhile, we propose a cache-based shortcut that retrieves semantically similar queries and their DSLs from a carefully designed cache during inference, \
            thereby enabling the LLM to directly synthesize the target DSL rather than generating it from scratch.',
    ],
    stats: [
      {
        number: 'Cost Planner',
        text: 'Dynamically determine execution plans',
      },
      {
        number: 'Caching',
        text: 'Retrieves semantically similar queries to synthesize the target DSL',
      },
      {
        number: 'RL',
        text: 'Leveraging RL for Enhanced Decision Making',
      },
    ],
  },

  // Features Section
  features: {
    title: 'Key Features',
    subtitle: 'Discover what makes CACOBI powerful and intuitive',
    items: [
      {
        icon: 'fas fa-bolt',
        title: 'Cache-based Shortcut Inference',
        description:
          'Leverages a skeleton-based cache to find semantically similar historical queries, enabling direct, few-shot DSL generation. This significantly reduces latency and token consumption for recurring query patterns.',
      },
      {
        icon: 'fas fa-route',
        title: 'Reinforcement Learning-based Cost Planner',
        description:
          'For complex queries, an RL-trained agent dynamically prunes redundant steps from the long-chain pipeline, creating an optimal execution path that balances processing cost and accuracy.',
      },
      {
        icon: 'fas fa-brain',
        title: 'Hybrid Execution Engine',
        description:
          'Intelligently determines whether to use the fast cache-based shortcut or the optimized long-chain pipeline, automatically selecting the most resource-efficient path for any given user query.',
      },
      {
        icon: 'fas fa-comments',
        title: 'Intuitive Natural Language Interaction',
        description:
          'Offers a highly user-friendly interface that allows users to ask complex data questions in plain language. Our system seamlessly translates queries into efficient execution plans, enhancing user engagement.',
      },
    ],
  },

  // Demo Section
  demo: {
    title: 'Research Demonstration',
    subtitle: 'See CACOBI in action',
    video: {
      src: 'video.mp4',
      type: 'video/mp4',
    },
    description:
      'The demo highlights our hybrid execution engine, which intelligently routes queries between \
      the cache-based shortcut for recurring patterns and the RL-optimized long-chain pipeline for complex queries, \
      demonstrating significant improvements in processing efficiency and resource utilization.',
  },

  // Solution Section
  solution: {
    title: 'Our Solution',
    subtitle: 'How we address the challenge of BI',
    image: {
      src: 'assets/demo_page.png',
      alt: 'CACOBI Architecture',
    },
    intro:
      'We propose CACOBI, a system that optimizes long-chain BI workflows by introducing a hybrid execution engine. Our approach intelligently routes queries to the most resource-efficient path:',
    points: [
      {
        highlight: 'Cache-based Shortcut:',
        text: 'For recurring query patterns, we use a skeleton-based cache to retrieve similar historical examples, enabling direct, few-shot DSL generation. This significantly reduces latency and token usage.',
      },
      {
        highlight: 'RL-based Cost Planner:',
        text: 'For novel or complex queries, an RL-trained agent dynamically prunes redundant steps from the long-chain pipeline, creating an optimal execution path that balances cost and accuracy.',
      },
      {
        highlight: 'Hybrid Execution Engine:',
        text: 'Our system automatically determines whether to use the fast cache-based shortcut or the optimized long-chain pipeline, ensuring the most efficient processing for any given user query.',
      },
      {
        highlight: 'End-to-End Prototype:',
        text: 'We built a fully functional prototype that integrates our caching and cost-planning mechanisms, demonstrating their effectiveness in creating a practical, efficient, and scalable NL-driven BI solution.',
      },
    ],
  },

  // Contact Section
  contact: {
    title: 'Contact Us',
    subtitle: 'Get in touch with our research team',
    items: [
      {
        icon: 'fas fa-envelope',
        text: 'cuilingxi.cs@zju.edu.cn',
      },
      {
        icon: 'fas fa-map-marker-alt',
        text: 'College of Computer Science and Technology, Zhejiang University',
      },
      {
        icon: 'fas fa-map-marker-alt',
        text: 'XiaoHongShu',
      },
    ],
    social: {
      github: {
        url: 'https://github.com/SuDIS-ZJU',
        text: 'SuDIS-ZJU',
        icon: 'fab fa-github',
      },
    },
  },
}

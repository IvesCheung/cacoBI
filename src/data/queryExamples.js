/**
 * 查询示例数据集
 *
 * 每个示例包含:
 * - id: 唯一标识符
 * - name: 示例名称（用于UI显示）
 * - queryText: 用户查询文本
 * - queryResult: 查询结果数据（柱状图数据）
 * - shortSteps: 短链路步骤配置（只需配置details, tokens, duration）
 * - longSteps: 长链路步骤配置（只需配置details, tokens, duration）
 */

export const queryExamples = [
  {
    id: 'apple-sales-2025',
    name: 'Apple sales query',
    queryText: "Apple's sales in 2025",
    queryResult: [
      { name: 'Macbook', value: 3335 },
      { name: 'Airpods', value: 2304 },
      { name: 'iPhone', value: 5896 },
      { name: 'iWatch', value: 1935 },
      { name: 'iPad', value: 2685 },
      { name: 'Others', value: 1078 },
    ],
    shortSteps: {
      step1: {
        details: [`Use Entity-agnostic Qwen3-0.6B to embed the user query`],
        tokens: 0,
        duration: 0.5,
      },
      step2: {
        details: ["1. Huawei's sales in 2024", '2. Mac Pro sales in 2025'],
        tokens: 0,
        duration: 1.13,
      },
      step3: {
        details: [
          'Table: mobile_table',
          'dimension: []',
          'measure: {"field":"Apple", "aggregation":"sum"}',
          'filter: {"field":"time","type":"in", "condition":"2025"}',
        ],
        tokens: 1280,
        duration: 1.54,
      },
    },
    longSteps: {
      stage1: {
        'subject-recognition': {
          details: ['Entity: Apple;2025', 'Field: time', 'Jargon: sales'],
          tokens: 650,
          duration: 2.5,
        },
        'query-rewrite': {
          details: ['User wants to query sales data for [Apple] products, in [2025]'],
          tokens: 750,
          duration: 2.7,
        },
        'query-clarify': {
          details: ['No need to clarify the query'],
          tokens: 850,
          duration: 2.9,
        },
      },
      stage2: {
        'main-table-recall': {
          details: ['mobile_table', 'laptop_table', '...'],
          tokens: 0,
          duration: 0.1,
        },
        'field-table-recall': {
          details: ['mobile_table', '...'],
          tokens: 0,
          duration: 0.1,
        },
        'business-table-recall': {
          details: ['mobile_table', '...'],
          tokens: 0,
          duration: 0.1,
        },
      },
      stage3: {
        'table-selection': {
          details: ['mobile_table'],
          tokens: 1850,
          duration: 3.0,
        },
      },
      stage4: {
        'segment-recall': {
          details: ['Retrieved fields:', 'Apple;time;'],
          tokens: 0,
          duration: 0.1,
        },
        'business-term': {
          details: [
            'Retrieved jargons:',
            '1. Anonymized product sale volume without hot search terms',
            '2. Anonymized number of community sale users',
            '3. Anonymized product sale volume',
          ],
          tokens: 0,
          duration: 0.1,
        },
        'table-rule': {
          details: [
            'Retrieved table rules:',
            '"Applicable": Select this table when the parsing subject of the input is "sales term".',
            '"Applicable": It is used to query sale trends, sale index, and other information for specific user groups or categories"',
          ],
          tokens: 0,
          duration: 0.1,
        },
        'dimension-value-recall': {
          details: ['Retrieved dimension values:', '2025;2025 year;2025Y;2015;2015Y'],
          tokens: 0,
          duration: 0.1,
        },
      },
      stage5: {
        'segment-rerank': {
          details: ['Top-1 field after reranking: "time"'],
          tokens: 980,
          duration: 2.8,
        },
        'dimension-rerank': {
          details: ['Top-1 dimension value after reranking: "2025"'],
          tokens: 1100,
          duration: 3.1,
        },
      },
      stage6: {
        'metric-parse': {
          details: ['measure: {"field":"Apple", "aggregation":"sum"}'],
          tokens: 1200,
          duration: 3.2,
        },
        'dimension-parse': {
          details: ['dimension: []'],
          tokens: 1380,
          duration: 3.45,
        },
        'filter-parse': {
          details: ['filter: {"field":"time","type":"in", "condition":"2025"}'],
          tokens: 1560,
          duration: 3.7,
        },
      },
      stage7: {
        'dsl-transform': {
          details: [
            'Table: mobile_table',
            'dimension: []',
            'measure: {"field":"Apple", "aggregation":"sum"}',
            'filter: {"field":"time","type":"in", "condition":"2025"}',
          ],
          tokens: 0,
          duration: 0.1,
        },
      },
    },
  },

  {
    id: 'huawei-revenue-2024',
    name: 'Huawei revenue query',
    queryText: "Show Huawei's revenue in 2024 Q4",
    queryResult: [
      { name: 'Mate Series', value: 4520 },
      { name: 'P Series', value: 3890 },
      { name: 'Nova Series', value: 2150 },
      { name: 'Tablet', value: 1680 },
      { name: 'Watch', value: 980 },
      { name: 'Others', value: 1250 },
    ],
    shortSteps: {
      step1: {
        details: [`Use Entity-agnostic Qwen3-0.6B to embed the user query`],
        tokens: 0,
        duration: 0.48,
      },
      step2: {
        details: ["1. Xiaomi's revenue in 2024", "2. Huawei's sales in 2023 Q4"],
        tokens: 0,
        duration: 1.05,
      },
      step3: {
        details: [
          'Table: revenue_table',
          'dimension: ["quarter"]',
          'measure: {"field":"Huawei", "aggregation":"sum"}',
          'filter: {"field":"time","type":"in", "condition":"2024 Q4"}',
        ],
        tokens: 1350,
        duration: 1.62,
      },
    },
    longSteps: {
      stage1: {
        'subject-recognition': {
          details: ['Entity: Huawei;2024 Q4', 'Field: time;quarter', 'Jargon: revenue'],
          tokens: 720,
          duration: 2.6,
        },
        'query-rewrite': {
          details: ['User wants to query revenue data for [Huawei] products, in [2024 Q4]'],
          tokens: 780,
          duration: 2.8,
        },
        'query-clarify': {
          details: ['No need to clarify the query'],
          tokens: 820,
          duration: 2.85,
        },
      },
      stage2: {
        'main-table-recall': {
          details: ['revenue_table', 'mobile_table', '...'],
          tokens: 0,
          duration: 0.12,
        },
        'field-table-recall': {
          details: ['revenue_table', 'quarterly_table', '...'],
          tokens: 0,
          duration: 0.11,
        },
        'business-table-recall': {
          details: ['revenue_table', '...'],
          tokens: 0,
          duration: 0.1,
        },
      },
      stage3: {
        'table-selection': {
          details: ['revenue_table'],
          tokens: 1920,
          duration: 3.1,
        },
      },
      stage4: {
        'segment-recall': {
          details: ['Retrieved fields:', 'Huawei;time;quarter;'],
          tokens: 0,
          duration: 0.11,
        },
        'business-term': {
          details: [
            'Retrieved jargons:',
            '1. Total revenue including all product lines',
            '2. Quarterly revenue breakdown',
            '3. Year-over-year revenue comparison',
          ],
          tokens: 0,
          duration: 0.12,
        },
        'table-rule': {
          details: [
            'Retrieved table rules:',
            '"Applicable": Select this table when querying revenue or financial data.',
            '"Applicable": Use for quarterly or annual revenue analysis"',
          ],
          tokens: 0,
          duration: 0.1,
        },
        'dimension-value-recall': {
          details: ['Retrieved dimension values:', '2024 Q4;2024Q4;Q4 2024;2023 Q4;2024 Q3'],
          tokens: 0,
          duration: 0.11,
        },
      },
      stage5: {
        'segment-rerank': {
          details: ['Top-1 field after reranking: "quarter"'],
          tokens: 1050,
          duration: 2.9,
        },
        'dimension-rerank': {
          details: ['Top-1 dimension value after reranking: "2024 Q4"'],
          tokens: 1180,
          duration: 3.2,
        },
      },
      stage6: {
        'metric-parse': {
          details: ['measure: {"field":"Huawei", "aggregation":"sum"}'],
          tokens: 1280,
          duration: 3.3,
        },
        'dimension-parse': {
          details: ['dimension: ["quarter"]'],
          tokens: 1420,
          duration: 3.5,
        },
        'filter-parse': {
          details: ['filter: {"field":"time","type":"in", "condition":"2024 Q4"}'],
          tokens: 1600,
          duration: 3.8,
        },
      },
      stage7: {
        'dsl-transform': {
          details: [
            'Table: revenue_table',
            'dimension: ["quarter"]',
            'measure: {"field":"Huawei", "aggregation":"sum"}',
            'filter: {"field":"time","type":"in", "condition":"2024 Q4"}',
          ],
          tokens: 0,
          duration: 0.1,
        },
      },
    },
  },

  {
    id: 'tesla-market-share',
    name: 'Tesla market share query',
    queryText: 'What is Tesla market share in North America?',
    queryResult: [
      { name: 'Model 3', value: 4280 },
      { name: 'Model Y', value: 6150 },
      { name: 'Model S', value: 1890 },
      { name: 'Model X', value: 2340 },
      { name: 'Cybertruck', value: 980 },
    ],
    shortSteps: {
      step1: {
        details: [`Use Entity-agnostic Qwen3-0.6B to embed the user query`],
        tokens: 0,
        duration: 0.52,
      },
      step2: {
        details: ['1. Tesla sales in Europe', '2. BYD market share in China'],
        tokens: 0,
        duration: 1.18,
      },
      step3: {
        details: [
          'Table: market_share_table',
          'dimension: ["region"]',
          'measure: {"field":"Tesla", "aggregation":"percentage"}',
          'filter: {"field":"region","type":"in", "condition":"North America"}',
        ],
        tokens: 1420,
        duration: 1.68,
      },
    },
    longSteps: {
      stage1: {
        'subject-recognition': {
          details: ['Entity: Tesla;North America', 'Field: region', 'Jargon: market share'],
          tokens: 680,
          duration: 2.55,
        },
        'query-rewrite': {
          details: ['User wants to query market share data for [Tesla], in [North America]'],
          tokens: 790,
          duration: 2.75,
        },
        'query-clarify': {
          details: ['No need to clarify the query'],
          tokens: 880,
          duration: 2.95,
        },
      },
      stage2: {
        'main-table-recall': {
          details: ['market_share_table', 'sales_table', '...'],
          tokens: 0,
          duration: 0.11,
        },
        'field-table-recall': {
          details: ['market_share_table', 'regional_table', '...'],
          tokens: 0,
          duration: 0.12,
        },
        'business-table-recall': {
          details: ['market_share_table', '...'],
          tokens: 0,
          duration: 0.1,
        },
      },
      stage3: {
        'table-selection': {
          details: ['market_share_table'],
          tokens: 1780,
          duration: 2.95,
        },
      },
      stage4: {
        'segment-recall': {
          details: ['Retrieved fields:', 'Tesla;region;'],
          tokens: 0,
          duration: 0.1,
        },
        'business-term': {
          details: [
            'Retrieved jargons:',
            '1. Market share percentage by brand',
            '2. Regional market penetration',
            '3. Competitive market analysis',
          ],
          tokens: 0,
          duration: 0.11,
        },
        'table-rule': {
          details: [
            'Retrieved table rules:',
            '"Applicable": Select this table when querying market share or competitive analysis.',
            '"Applicable": Use for regional market comparison"',
          ],
          tokens: 0,
          duration: 0.1,
        },
        'dimension-value-recall': {
          details: ['Retrieved dimension values:', 'North America;NA;United States;Europe;Asia'],
          tokens: 0,
          duration: 0.12,
        },
      },
      stage5: {
        'segment-rerank': {
          details: ['Top-1 field after reranking: "region"'],
          tokens: 1020,
          duration: 2.85,
        },
        'dimension-rerank': {
          details: ['Top-1 dimension value after reranking: "North America"'],
          tokens: 1150,
          duration: 3.15,
        },
      },
      stage6: {
        'metric-parse': {
          details: ['measure: {"field":"Tesla", "aggregation":"percentage"}'],
          tokens: 1250,
          duration: 3.25,
        },
        'dimension-parse': {
          details: ['dimension: ["region"]'],
          tokens: 1400,
          duration: 3.48,
        },
        'filter-parse': {
          details: ['filter: {"field":"region","type":"in", "condition":"North America"}'],
          tokens: 1580,
          duration: 3.75,
        },
      },
      stage7: {
        'dsl-transform': {
          details: [
            'Table: market_share_table',
            'dimension: ["region"]',
            'measure: {"field":"Tesla", "aggregation":"percentage"}',
            'filter: {"field":"region","type":"in", "condition":"North America"}',
          ],
          tokens: 0,
          duration: 0.1,
        },
      },
    },
  },
]

/**
 * 根据ID获取查询示例
 * @param {string} exampleId - 示例ID
 * @returns {object|null} 查询示例对象，如果未找到则返回null
 */
export function getQueryExample(exampleId) {
  return queryExamples.find((example) => example.id === exampleId) || null
}

/**
 * 获取所有查询示例的简要信息（用于选择器）
 * @returns {Array} 包含id和name的数组
 */
export function getQueryExampleList() {
  return queryExamples.map((example) => ({
    id: example.id,
    name: example.name,
  }))
}

/**
 * 获取默认查询示例（第一个）
 * @returns {object} 默认查询示例
 */
export function getDefaultQueryExample() {
  return queryExamples[0]
}

# 查询示例快速参考指南

## 📁 文件位置

- 数据文件：`src/data/queryExamples.js`
- 说明文档：`src/data/README.md`

## ⚡ 快速添加新查询示例

### 最小模板

复制以下模板到 `queryExamples` 数组中：

```javascript
{
  id: 'your-query-id',                    // ⚠️ 必须唯一
  name: '你的查询名称',                    // 显示在选择器中
  queryText: '输入你的查询文本',
  queryResult: [
    { name: '分类1', value: 1000 },
    { name: '分类2', value: 2000 },
    // 添加更多分类...
  ],

  // 短链路 - 3个步骤
  shortSteps: {
    step1: {
      details: ['步骤1的详细描述'],
      tokens: 0,           // token消耗（数字）
      duration: 0.5,       // 执行时长（秒）
    },
    step2: {
      details: ['步骤2的相关查询1', '步骤2的相关查询2'],
      tokens: 0,
      duration: 1.0,
    },
    step3: {
      details: ['Table: xxx', 'dimension: []', 'measure: {...}', 'filter: {...}'],
      tokens: 1280,
      duration: 1.5,
    },
  },

  // 长链路 - 7个阶段
  longSteps: {
    // 阶段1：查询解析（3个步骤）
    stage1: {
      'subject-recognition': {
        details: ['Entity: xxx', 'Field: xxx', 'Jargon: xxx'],
        tokens: 650,
        duration: 2.5,
      },
      'query-rewrite': {
        details: ['User wants to query...'],
        tokens: 750,
        duration: 2.7,
      },
      'query-clarify': {
        details: ['No need to clarify the query'],
        tokens: 850,
        duration: 2.9,
      },
    },

    // 阶段2：表召回（3个步骤）
    stage2: {
      'main-table-recall': {
        details: ['table1', 'table2', '...'],
        tokens: 0,
        duration: 0.1,
      },
      'field-table-recall': {
        details: ['table1', '...'],
        tokens: 0,
        duration: 0.1,
      },
      'business-table-recall': {
        details: ['table1', '...'],
        tokens: 0,
        duration: 0.1,
      },
    },

    // 阶段3：表选择（1个步骤）
    stage3: {
      'table-selection': {
        details: ['selected_table'],
        tokens: 1850,
        duration: 3.0,
      },
    },

    // 阶段4：表内知识召回（4个步骤）
    stage4: {
      'segment-recall': {
        details: ['Retrieved fields:', 'field1;field2;'],
        tokens: 0,
        duration: 0.1,
      },
      'business-term': {
        details: ['Retrieved jargons:', '1. xxx', '2. xxx'],
        tokens: 0,
        duration: 0.1,
      },
      'table-rule': {
        details: ['Retrieved table rules:', '"Applicable": xxx'],
        tokens: 0,
        duration: 0.1,
      },
      'dimension-value-recall': {
        details: ['Retrieved dimension values:', 'value1;value2;'],
        tokens: 0,
        duration: 0.1,
      },
    },

    // 阶段5：重排序（2个步骤）
    stage5: {
      'segment-rerank': {
        details: ['Top-1 field after reranking: "xxx"'],
        tokens: 980,
        duration: 2.8,
      },
      'dimension-rerank': {
        details: ['Top-1 dimension value after reranking: "xxx"'],
        tokens: 1100,
        duration: 3.1,
      },
    },

    // 阶段6：DSL配置（3个步骤）
    stage6: {
      'metric-parse': {
        details: ['measure: {...}'],
        tokens: 1200,
        duration: 3.2,
      },
      'dimension-parse': {
        details: ['dimension: []'],
        tokens: 1380,
        duration: 3.45,
      },
      'filter-parse': {
        details: ['filter: {...}'],
        tokens: 1560,
        duration: 3.7,
      },
    },

    // 阶段7：生成DSL（1个步骤）
    stage7: {
      'dsl-transform': {
        details: ['Table: xxx', 'dimension: []', 'measure: {...}', 'filter: {...}'],
        tokens: 0,
        duration: 0.1,
      },
    },
  },
}
```

## 🔧 常见修改

### 只修改查询文本

```javascript
queryText: '新的查询文本'
```

### 修改结果数据

```javascript
queryResult: [
  { name: '新分类1', value: 5000 },
  { name: '新分类2', value: 3000 },
]
```

### 修改步骤详细信息

```javascript
details: ['新的详细描述1', '新的详细描述2']
```

### 修改执行时长

```javascript
duration: 2.5 // 单位：秒
```

### 修改token消耗

```javascript
tokens: 1500
```

## ⚠️ 注意事项

### ❌ 不要修改

- 步骤ID（如 `'subject-recognition'`、`'query-rewrite'` 等）
- 阶段名称（`stage1` 到 `stage7`）
- 短链路步骤名称（`step1` 到 `step3`）
- 数据结构层级

### ✅ 可以修改

- 示例的 `id` 和 `name`（确保id唯一）
- `queryText` 和 `queryResult`
- 各步骤的 `details`、`tokens`、`duration`

## 📊 数据类型要求

```javascript
id: string // 字符串
name: string // 字符串
queryText: string // 字符串
queryResult: Array // 数组，包含对象 { name: string, value: number }
details: Array // 字符串数组
tokens: number // 数字（整数）
duration: number // 数字（可以是小数）
```

## 🎯 调试技巧

### 检查数据是否加载成功

在浏览器控制台中：

```javascript
import { getQueryExampleList } from '@/data/queryExamples'
console.log(getQueryExampleList())
```

### 检查特定示例

```javascript
import { getQueryExample } from '@/data/queryExamples'
console.log(getQueryExample('your-query-id'))
```

## 💡 最佳实践

1. **命名规范**：使用小写字母和连字符（如 `apple-sales-2025`）
2. **描述性名称**：使用清晰的名称描述查询场景
3. **合理的时长**：duration设置合理的值以展示动画效果
4. **详细信息**：details数组中提供足够的信息帮助理解步骤
5. **测试验证**：添加后在UI中测试确保正常工作

## 🚀 使用示例

### 切换到特定查询示例（代码方式）

```javascript
import { useBIQuery } from '@/composables/useBIQuery'

const { loadQueryExample } = useBIQuery()
loadQueryExample('huawei-revenue-2024')
```

### 获取当前示例ID

```javascript
const { currentExampleId } = useBIQuery()
console.log(currentExampleId.value) // 输出当前ID
```

## 📝 示例速查

当前可用的查询示例：

| ID                    | 名称              | 描述                          |
| --------------------- | ----------------- | ----------------------------- |
| `apple-sales-2025`    | Apple产品销售查询 | 查询Apple在2025年的销售数据   |
| `huawei-revenue-2024` | Huawei营收查询    | 查询Huawei在2024 Q4的营收数据 |
| `tesla-market-share`  | Tesla市场份额查询 | 查询Tesla在北美的市场份额     |

---

**需要帮助？** 查看完整文档：`src/data/README.md`

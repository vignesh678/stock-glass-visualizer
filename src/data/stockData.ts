
export interface StockData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  quarterlyDividends: { quarter: string; value: number }[];
  yearlyHighLow: {
    year: string;
    high: number;
    low: number;
  }[];
}

export const stocksData: StockData[] = [
  {
    id: "1",
    name: "Apple Inc.",
    symbol: "AAPL",
    price: 182.52,
    change: 1.25,
    quarterlyDividends: [
      { quarter: "Q1", value: 0.24 },
      { quarter: "Q2", value: 0.24 },
      { quarter: "Q3", value: 0.25 },
      { quarter: "Q4", value: 0.25 }
    ],
    yearlyHighLow: [
      { year: "2020", high: 138.79, low: 53.15 },
      { year: "2021", high: 182.94, low: 116.21 },
      { year: "2022", high: 182.94, low: 124.17 },
      { year: "2023", high: 198.23, low: 142.00 }
    ]
  },
  {
    id: "2",
    name: "Microsoft",
    symbol: "MSFT",
    price: 403.78,
    change: 3.54,
    quarterlyDividends: [
      { quarter: "Q1", value: 0.68 },
      { quarter: "Q2", value: 0.68 },
      { quarter: "Q3", value: 0.75 },
      { quarter: "Q4", value: 0.75 }
    ],
    yearlyHighLow: [
      { year: "2020", high: 232.86, low: 132.52 },
      { year: "2021", high: 349.67, low: 212.03 },
      { year: "2022", high: 349.67, low: 213.43 },
      { year: "2023", high: 415.32, low: 241.51 }
    ]
  },
  {
    id: "3",
    name: "Amazon",
    symbol: "AMZN",
    price: 180.75,
    change: -1.23,
    quarterlyDividends: [
      { quarter: "Q1", value: 0.00 },
      { quarter: "Q2", value: 0.00 },
      { quarter: "Q3", value: 0.00 },
      { quarter: "Q4", value: 0.00 }
    ],
    yearlyHighLow: [
      { year: "2020", high: 106.65, low: 47.15 },
      { year: "2021", high: 188.65, low: 96.15 },
      { year: "2022", high: 188.65, low: 81.43 },
      { year: "2023", high: 192.87, low: 88.12 }
    ]
  },
  {
    id: "4",
    name: "Tesla Inc",
    symbol: "TSLA",
    price: 248.50,
    change: 5.67,
    quarterlyDividends: [
      { quarter: "Q1", value: 0.00 },
      { quarter: "Q2", value: 0.00 },
      { quarter: "Q3", value: 0.00 },
      { quarter: "Q4", value: 0.00 }
    ],
    yearlyHighLow: [
      { year: "2020", high: 180.42, low: 23.00 },
      { year: "2021", high: 414.50, low: 152.53 },
      { year: "2022", high: 414.50, low: 101.81 },
      { year: "2023", high: 299.29, low: 101.81 }
    ]
  },
  {
    id: "5",
    name: "Google",
    symbol: "GOOGL",
    price: 156.33,
    change: 2.42,
    quarterlyDividends: [
      { quarter: "Q1", value: 0.00 },
      { quarter: "Q2", value: 0.00 },
      { quarter: "Q3", value: 0.00 },
      { quarter: "Q4", value: 0.00 }
    ],
    yearlyHighLow: [
      { year: "2020", high: 80.60, low: 51.84 },
      { year: "2021", high: 153.16, low: 79.69 },
      { year: "2022", high: 153.16, low: 83.34 },
      { year: "2023", high: 160.89, low: 86.05 }
    ]
  },
  {
    id: "6",
    name: "Meta Platforms",
    symbol: "META",
    price: 487.95,
    change: 7.80,
    quarterlyDividends: [
      { quarter: "Q1", value: 0.00 },
      { quarter: "Q2", value: 0.00 },
      { quarter: "Q3", value: 0.00 },
      { quarter: "Q4", value: 0.00 }
    ],
    yearlyHighLow: [
      { year: "2020", high: 304.67, low: 146.01 },
      { year: "2021", high: 384.33, low: 244.61 },
      { year: "2022", high: 384.33, low: 88.09 },
      { year: "2023", high: 498.00, low: 88.09 }
    ]
  },
  {
    id: "7",
    name: "NVIDIA",
    symbol: "NVDA",
    price: 926.69,
    change: 15.76,
    quarterlyDividends: [
      { quarter: "Q1", value: 0.01 },
      { quarter: "Q2", value: 0.01 },
      { quarter: "Q3", value: 0.01 },
      { quarter: "Q4", value: 0.01 }
    ],
    yearlyHighLow: [
      { year: "2020", high: 29.97, low: 11.60 },
      { year: "2021", high: 82.39, low: 28.31 },
      { year: "2022", high: 82.39, low: 33.72 },
      { year: "2023", high: 972.35, low: 33.72 }
    ]
  },
  {
    id: "8",
    name: "JP Morgan Chase",
    symbol: "JPM",
    price: 198.73,
    change: -0.82,
    quarterlyDividends: [
      { quarter: "Q1", value: 1.00 },
      { quarter: "Q2", value: 1.00 },
      { quarter: "Q3", value: 1.10 },
      { quarter: "Q4", value: 1.10 }
    ],
    yearlyHighLow: [
      { year: "2020", high: 141.10, low: 76.91 },
      { year: "2021", high: 172.96, low: 127.35 },
      { year: "2022", high: 172.96, low: 101.28 },
      { year: "2023", high: 200.94, low: 125.96 }
    ]
  },
  {
    id: "9",
    name: "Johnson & Johnson",
    symbol: "JNJ",
    price: 147.37,
    change: -1.05,
    quarterlyDividends: [
      { quarter: "Q1", value: 1.19 },
      { quarter: "Q2", value: 1.19 },
      { quarter: "Q3", value: 1.25 },
      { quarter: "Q4", value: 1.25 }
    ],
    yearlyHighLow: [
      { year: "2020", high: 157.00, low: 109.16 },
      { year: "2021", high: 179.92, low: 155.72 },
      { year: "2022", high: 186.69, low: 155.72 },
      { year: "2023", high: 186.69, low: 144.95 }
    ]
  },
  {
    id: "10",
    name: "Visa Inc",
    symbol: "V",
    price: 276.43,
    change: 2.15,
    quarterlyDividends: [
      { quarter: "Q1", value: 0.45 },
      { quarter: "Q2", value: 0.45 },
      { quarter: "Q3", value: 0.52 },
      { quarter: "Q4", value: 0.52 }
    ],
    yearlyHighLow: [
      { year: "2020", high: 217.35, low: 133.93 },
      { year: "2021", high: 252.67, low: 192.81 },
      { year: "2022", high: 252.67, low: 171.72 },
      { year: "2023", high: 290.96, low: 208.61 }
    ]
  }
];

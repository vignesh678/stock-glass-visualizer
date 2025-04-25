
// Nifty 50 Companies Data
export interface NiftyStock {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  sector: string;
  marketCap: number; // in billions
  pe: number; // Price to Earnings ratio
}

export const niftyStocks: NiftyStock[] = [
  {
    id: 1,
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 2567.35,
    change: 15.75,
    sector: "Oil & Gas",
    marketCap: 1734.22,
    pe: 19.8
  },
  {
    id: 2,
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd",
    price: 3456.80,
    change: -12.45,
    sector: "IT",
    marketCap: 1268.40,
    pe: 27.3
  },
  {
    id: 3,
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    price: 1587.25,
    change: 8.90,
    sector: "Financial Services",
    marketCap: 887.94,
    pe: 22.5
  },
  {
    id: 4,
    symbol: "INFY",
    name: "Infosys Ltd",
    price: 1423.65,
    change: -5.30,
    sector: "IT",
    marketCap: 595.75,
    pe: 25.1
  },
  {
    id: 5,
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    price: 945.50,
    change: 12.75,
    sector: "Financial Services",
    marketCap: 661.20,
    pe: 20.4
  },
  {
    id: 6,
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd",
    price: 2345.65,
    change: -8.20,
    sector: "Consumer Goods",
    marketCap: 552.45,
    pe: 62.5
  },
  {
    id: 7,
    symbol: "SBIN",
    name: "State Bank of India",
    price: 568.75,
    change: 4.50,
    sector: "Financial Services",
    marketCap: 508.35,
    pe: 9.8
  },
  {
    id: 8,
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd",
    price: 784.35,
    change: 7.65,
    sector: "Telecom",
    marketCap: 437.80,
    pe: 33.2
  },
  {
    id: 9,
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Ltd",
    price: 6543.25,
    change: -28.90,
    sector: "Financial Services",
    marketCap: 395.40,
    pe: 35.7
  },
  {
    id: 10,
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank Ltd",
    price: 1754.45,
    change: 5.85,
    sector: "Financial Services",
    marketCap: 347.50,
    pe: 25.9
  }
];

export interface QuarterlyData {
  quarter: string;
  revenue: number; // in crores
  netProfit: number; // in crores
  eps: number; // Earnings Per Share
}

export interface CompanyHistory {
  year: number;
  milestone: string;
}

export interface StockDetailData extends NiftyStock {
  quarterlyResults: QuarterlyData[];
  dividendHistory: { year: number; amount: number, yieldPercentage: number }[];
  yearlyHighLow: { year: number; high: number; low: number }[];
  companyHistory: CompanyHistory[];
}

export const getStockDetailById = (id: number): StockDetailData => {
  const baseStock = niftyStocks.find(stock => stock.id === id);
  
  if (!baseStock) {
    throw new Error(`Stock with ID ${id} not found`);
  }
  
  // Generate sample detailed data for each stock
  return {
    ...baseStock,
    quarterlyResults: [
      { quarter: "Q1 FY24", revenue: baseStock.marketCap * 0.12, netProfit: baseStock.marketCap * 0.018, eps: baseStock.price * 0.01 },
      { quarter: "Q4 FY23", revenue: baseStock.marketCap * 0.11, netProfit: baseStock.marketCap * 0.016, eps: baseStock.price * 0.009 },
      { quarter: "Q3 FY23", revenue: baseStock.marketCap * 0.105, netProfit: baseStock.marketCap * 0.015, eps: baseStock.price * 0.008 },
      { quarter: "Q2 FY23", revenue: baseStock.marketCap * 0.10, netProfit: baseStock.marketCap * 0.014, eps: baseStock.price * 0.007 },
      { quarter: "Q1 FY23", revenue: baseStock.marketCap * 0.095, netProfit: baseStock.marketCap * 0.013, eps: baseStock.price * 0.006 }
    ],
    dividendHistory: [
      { year: 2023, amount: baseStock.price * 0.03, yieldPercentage: 3.0 },
      { year: 2022, amount: baseStock.price * 0.028, yieldPercentage: 2.8 },
      { year: 2021, amount: baseStock.price * 0.026, yieldPercentage: 2.6 },
      { year: 2020, amount: baseStock.price * 0.024, yieldPercentage: 2.4 },
      { year: 2019, amount: baseStock.price * 0.022, yieldPercentage: 2.2 }
    ],
    yearlyHighLow: [
      { year: 2023, high: baseStock.price * 1.25, low: baseStock.price * 0.85 },
      { year: 2022, high: baseStock.price * 1.15, low: baseStock.price * 0.80 },
      { year: 2021, high: baseStock.price * 1.10, low: baseStock.price * 0.75 },
      { year: 2020, high: baseStock.price * 1.05, low: baseStock.price * 0.70 },
      { year: 2019, high: baseStock.price * 1.00, low: baseStock.price * 0.65 }
    ],
    companyHistory: [
      { year: baseStock.id + 1970, milestone: `${baseStock.name} was founded` },
      { year: baseStock.id + 1985, milestone: `${baseStock.name} went public with IPO` },
      { year: baseStock.id + 1995, milestone: `${baseStock.name} expanded operations internationally` },
      { year: baseStock.id + 2005, milestone: `${baseStock.name} launched major new product line` },
      { year: baseStock.id + 2015, milestone: `${baseStock.name} achieved record market capitalization` }
    ]
  };
};

// hooks/useStockNews.ts
import { useQuery } from "@tanstack/react-query";

const API_KEY = "d6ume4pr01qig5453lggd6ume4pr01qig5453lh0";

async function fetchCompanyNews(symbol: string) {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 30);

  const from = past.toISOString().split("T")[0];
  const to = today.toISOString().split("T")[0];

  const res = await fetch(
    `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${API_KEY}`,
  );

  const data = await res.json();

  return data.sort((a: any, b: any) => b.datetime - a.datetime).slice(0, 10);
}

// async function fetchCompanyNews(symbol: string) {
//   const today = new Date();
//   const past = new Date();
//   past.setDate(today.getDate() - 30);

//   const from = past.toISOString().split("T")[0];
//   const to = today.toISOString().split("T")[0];

//   const res = await fetch(
//     `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${API_KEY}`,
//   );

//   return res.json();
// }

// async function fetchGeneralNews() {
//   const today = new Date();
//   const past = new Date();
//   past.setDate(today.getDate() - 7);

//   const from = past.toISOString().split("T")[0];
//   const to = today.toISOString().split("T")[0];
//   const res = await fetch(
//     `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}&from=${from}&to=${to}`,
//   );

//   return res.json();
// }

export async function fetchMixedNews(symbols: string[]) {
  const companyNewsList = await Promise.all(
    symbols.map((s) => fetchCompanyNews(s)),
  );

  const companyNews = companyNewsList.flat();
  const unique = Array.from(
    new Map(companyNews.map((item) => [item.url, item])).values(),
  );

  // return unique.sort((a, b) => b.datetime - a.datetime);
  return shuffle(unique);
}

export function useMixedNews(symbols: string[]) {
  return useQuery({
    queryKey: ["mixed-news", JSON.stringify(symbols)],
    queryFn: () => fetchMixedNews(symbols),
    refetchInterval: 300000,
    staleTime: 60000,
    placeholderData: (prev) => prev,
  });
}

function shuffle(array: any[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

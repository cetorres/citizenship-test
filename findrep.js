const findRep = async (zip) => {
  const res = await fetch('https://ziplook.house.gov/htbin/findrep_house', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
      'Cache-Control': 'maxmax-age=0',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Dnt': 1,
      'Host': 'ziplook.house.gov',
      'Origin': 'https://www.house.gov',
      'Referer': 'https://www.house.gov/',
      'Sec-Ch-Ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    },
    body: new URLSearchParams({
      'ZIP': zip,
      'submit': 'Find Your Re By Zip'
    })
  });
  
  if (res.status !== 200) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const repInfo = doc.getElementById('RepInfo');
  if (!repInfo) {
    throw new Error('No representative found for this zip code.');
  }
  const name = repInfo.querySelectorAll('a')[0].innerHTML;
  if (!name) {
    throw new Error('Could not find representative name.');
  }
  return name;
};

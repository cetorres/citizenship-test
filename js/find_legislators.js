const findLegislators = async (zip, state) => {
  const governorsRes = await fetch('../data/state_governors.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (governorsRes.status !== 200) {
    throw new Error(`Error: ${governorsRes.status} ${governorsRes.statusText}`);
  }

  const legislatorsRes = await fetch('../data/legislators_current.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (legislatorsRes.status !== 200) {
    throw new Error(`Error: ${legislatorsRes.status} ${legislatorsRes.statusText}`);
  }

  const zipRes = await fetch('../data/zip_to_district.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (zipRes.status !== 200) {
    throw new Error(`Error: ${zipRes.status} ${zipRes.statusText}`);
  }

  const legislators = await legislatorsRes.json();
  const zipData = await zipRes.json();
  const governorsData = await governorsRes.json();

  let district = zipData.filter(z => z.zcta === zip && z.state_abbr === state);
  if (!district || district.length === 0) {
    throw new Error('No district found for this zip code.');
  }
  district = district.map(d => ({ state_abbr: d.state_abbr, cd: parseInt(d.cd) }));
  
  const reps = legislators.filter(leg => leg.terms[leg.terms.length - 1].state === district[0].state_abbr
    && leg.terms[leg.terms.length - 1].district === district[0].cd
    && leg.terms[leg.terms.length - 1].type === 'rep').map(leg => ({ name: leg.name.official_full, party: leg.terms[leg.terms.length - 1].party }));
  const senators = legislators.filter(leg => leg.terms[leg.terms.length - 1].state === district[0].state_abbr
    && leg.terms[leg.terms.length - 1].type === 'sen').map(leg => ({ name: leg.name.official_full, party: leg.terms[leg.terms.length - 1].party }));

  const governor = governorsData.filter(gov => gov.state_abbr === district[0].state_abbr).map(gov => ({ name: `${gov.first_name} ${gov.last_name}`, capital: gov.city }))[0];
  
  return {
    district: district[0].cd,
    zip: zip,
    state: state,
    representatives: reps,
    senators: senators,
    governor: governor
  };
};

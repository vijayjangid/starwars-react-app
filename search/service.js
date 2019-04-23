/**
 * This service fetches planets from given API
 * sort results by population
 * get maximum population from the result
 */
class Search {
  constructor() {
    this.planetApiUrl = 'https://swapi.co/api/planets/';
  }

  getFullUrl(query, page) {
    return this.planetApiUrl + '?search=' + query + '&page=' + page;
  }

  get(query, page) {
    return fetch(this.getFullUrl(query, page),
      { mode: 'cors', credentials: 'same-origin' })
      .then(res => res.json());
  }

  sortByPopulation(result) {
    return result.sort((a, b) => {
      let aPop = parseInt(a.population);
      let bPop = parseInt(b.population);
      aPop = aPop || 0;
      bPop = bPop || 0;

      return bPop - aPop;
    });
  }

  getMaxPopulation(results) {
    const populations = results.map(x => {
      let population = parseInt(x.population);
      population = population || 0;
      return population;
    });

    return Math.max.apply(null, populations);
  }
}

const search = new Search();
export default search;
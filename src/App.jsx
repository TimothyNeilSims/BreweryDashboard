import { useState, useEffect } from 'react';
import BreweryList from "./components/BreweryList";
import './App.css';

function App() {
  const [breweries, setBreweries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWithWebsites, setFilterWithWebsites] = useState(false);
  const [selectedBreweryType, setSelectedBreweryType] = useState('');
  const [nameLengthRange, setNameLengthRange] = useState({ min: 0, max: Infinity });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.openbrewerydb.org/breweries');
        if (!response.ok) throw new Error('Data could not be fetched!');
        const data = await response.json();
        setBreweries(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const breweryTypes = [...new Set(breweries.map(brewery => brewery.brewery_type))];

  const filteredBreweries = breweries
    .filter(brewery => {
      if (filterWithWebsites && !brewery.website_url) return false;
      if (selectedBreweryType && brewery.brewery_type !== selectedBreweryType) return false;
      if (brewery.name.length < nameLengthRange.min || brewery.name.length > nameLengthRange.max) return false;
      return brewery.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const breweryStats = breweries.reduce((acc, brewery) => {
    acc.total = (acc.total || 0) + 1;

    if (brewery.brewery_type) {
      acc[brewery.brewery_type] = (acc[brewery.brewery_type] || 0) + 1;
      acc.typeCounts = acc.typeCounts || {};
      acc.typeCounts[brewery.brewery_type] = (acc.typeCounts[brewery.brewery_type] || 0) + 1;
    }

    if (brewery.website_url) {
      acc.withWebsites = (acc.withWebsites || 0) + 1;
    }

    if (brewery.phone) {
      const areaCode = brewery.phone.substring(0, 3);
      acc.areaCodes = acc.areaCodes || {};
      acc.areaCodes[areaCode] = (acc.areaCodes[areaCode] || 0) + 1;
    }

    return acc;
  }, {});

  // Determine the most common brewery type
  const mostCommonBreweryType = Object.entries(breweryStats.typeCounts || {}).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0];

  const mostCommonAreaCode = breweryStats.areaCodes ? Object.entries(breweryStats.areaCodes).reduce((acc, current) => acc[1] > current[1] ? acc : current, ['', 0])[0] : 'N/A';

  return (
    <div className="App">
      <h1>Brewery Dashboard</h1>



      <div className="statistics">
        <div className="general-stats">
          <h2>General Statistics</h2>
          <p>Total Breweries: {breweryStats.total || 0}</p>
          <p>Breweries with Websites: {breweryStats.withWebsites || 0}</p>
          <p>Most Common Area Code: {mostCommonAreaCode}</p>
          <p>Most Common Brewery Type: {mostCommonBreweryType || 'N/A'}</p>
        </div>
        <div className="type-stats">
          <h2>Brewery Types</h2>
          {Object.entries(breweryStats).map(([type, count]) => (
            !['total', 'withWebsites', 'areaCodes', 'typeCounts'].includes(type) && <p key={type}>{`${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`}</p>
          ))}
        </div>
      </div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search breweries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <label>
          <input
            type="checkbox"
            checked={filterWithWebsites}
            onChange={(e) => setFilterWithWebsites(e.target.checked)}
          />
          Only show breweries with websites
        </label>
        <select
          value={selectedBreweryType}
          onChange={(e) => setSelectedBreweryType(e.target.value)}
        >
          <option value="">All</option>
          {breweryTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <div>
          <label>
            Min Name Length:
            <input
              type="number"
              value={nameLengthRange.min}
              onChange={(e) => setNameLengthRange({ ...nameLengthRange, min: Number(e.target.value) })}
            />
          </label>
          <label>
            Max Name Length:
            <input
              type="number"
              value={nameLengthRange.max === Infinity ? '' : nameLengthRange.max}
              onChange={(e) => setNameLengthRange({ ...nameLengthRange, max: Number(e.target.value) || Infinity })}
            />
          </label>
        </div>
      </div>

      <BreweryList breweries={filteredBreweries} />
    </div>
  );
}

export default App;

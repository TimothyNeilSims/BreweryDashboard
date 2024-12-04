import React, { useState, useMemo } from 'react';

function BreweryList({ breweries }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedBreweries = useMemo(() => {
    let sortableItems = [...breweries];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [breweries, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <div className="brewery-list">
  <h2>Breweries List</h2>
  <table>
    <thead>
      <tr>
        <th className="name-column" onClick={() => requestSort('name')}>
          Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '↓' : '↑') : ''}
        </th>
        <th className="type-column" onClick={() => requestSort('brewery_type')}>
          Type {sortConfig.key === 'brewery_type' ? (sortConfig.direction === 'ascending' ? '↓' : '↑') : ''}
        </th>
        <th className="city-column" onClick={() => requestSort('city')}>
          City {sortConfig.key === 'city' ? (sortConfig.direction === 'ascending' ? '↓' : '↑') : ''}
        </th>
        <th className="phone-column" onClick={() => requestSort('phone')}>
          Phone {sortConfig.key === 'phone' ? (sortConfig.direction === 'ascending' ? '↓' : '↑') : ''}
        </th>
        <th className="website-column">Website</th>
      </tr>
    </thead>
    <tbody>
          {sortedBreweries.map(brewery => (
            <tr key={brewery.id}>
              <td>{brewery.name}</td>
              <td>{brewery.brewery_type}</td>
              <td>{`${brewery.address_1}, ${brewery.city}, ${brewery.state_province}, ${brewery.postal_code}, ${brewery.country}`}</td>
              <td>{brewery.phone ? brewery.phone : 'N/A'}</td>
              <td>{brewery.website_url ? <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">Website</a> : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BreweryList;

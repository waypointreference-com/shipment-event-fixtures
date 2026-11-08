// This example uses the three public resources described in the README.
const fixtureVersion = '2026.10.3';

async function load(slug) {
  const url = new URL(`/resources/datasets/${slug}.json`, 'https://waypointreference.com');
  const response = await fetch(url, {
    headers: { 'User-Agent': 'WaypointShipmentFixtureExample/1.0' },
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`${slug}: HTTP ${response.status}`);
  const fixture = await response.json();
  if (fixture.slug !== slug || fixture.version !== fixtureVersion || !Array.isArray(fixture.records)) {
    throw new Error(`Expected the ${slug} fixture at version ${fixtureVersion}. Review the fixture before using these totals.`);
  }
  return fixture.records;
}

function sumUnits(rows) {
  return rows.reduce((total, row) => {
    if (!Number.isSafeInteger(row.units) || row.units < 0) throw new Error('Invalid unit count');
    return total + row.units;
  }, 0);
}

const [stations, batches, events] = await Promise.all(
  ['waypoints', 'relay-batches', 'relay-events'].map(load),
);
const stationsById = new Map(stations.map(station => [station.id, station.name]));
const joined = batches.map(batch => {
  const source = stationsById.get(batch.source_id);
  const destination = stationsById.get(batch.destination_id);
  if (!source || !destination) throw new Error(`Unresolved station in ${batch.id}`);
  return { ...batch, source, destination };
});
const delivered = joined.filter(batch => batch.state === 'delivered');
console.log(`${joined.length} batches joined to stations`);
console.log(`${delivered.length} delivered batches: ${sumUnits(delivered)} units`);
console.log(`${events.length} lifecycle events: ${sumUnits(events)} units summed across all events`);

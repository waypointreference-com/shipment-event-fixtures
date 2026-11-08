# Check delivered shipment totals with JSON fixtures

How do you total delivered units when the same shipment appears in more than one event? This Node.js example downloads three small synthetic datasets from Waypoint Reference, joins the station IDs, and calculates both the delivered total and the sum you get from counting every event.

## Run the example

With Node.js 24, run this from the example directory:

```sh
node delivered-units.mjs
```

The script makes three HTTPS requests to waypointreference.com. Each request uses the fixed client label `WaypointShipmentFixtureExample/1.0` so Waypoint can count requests carrying that label. Every copy uses the same label. There is no install step or separate reporting request. See [Waypoint’s privacy notice](https://waypointreference.com/privacy) before running it.

## Check the answer

For fixture version `2026.10.3`, the output is:

```text
12 batches joined to stations
8 delivered batches: 355 units
31 lifecycle events: 1307 units summed across all events
```

Each batch carries its units through multiple stages. Summing event rows counts those units repeatedly and includes batches that have not been delivered. To answer the delivery question, filter the batch records to `state === "delivered"` and sum each matching batch once.

[Read the join and aggregation recipe](https://waypointreference.com/s/9d47ec5c-50e6-41e7-9ffd-ba3482a8c0f2). Waypoint counts follows of this link. The [direct guide link](https://waypointreference.com/docs/querying-fixtures) remains available if the tracked link expires or is revoked. The [station directory](https://waypointreference.com/resources/datasets/waypoints.json), [batches](https://waypointreference.com/resources/datasets/relay-batches.json), and [events](https://waypointreference.com/resources/datasets/relay-events.json) each include their version, row schema, and records. The [OpenAPI description](https://waypointreference.com/openapi.json) documents the available HTTP operations.

The example code and this guide are available under the [MIT License](LICENSE).

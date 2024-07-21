async function getData() {
  const res = await fetch("http://localhost:6001/search");
  if (!res.ok) throw new Error("failed to fetch data");

  return res.json();
}

async function Listings() {
  const data = await getData();
  return <div>{JSON.stringify(data, null, 2)}</div>;
}

export default Listings;

export const fetchPlace = async (text) => {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=pk.eyJ1Ijoia2FzZ290byIsImEiOiJjbTB0ZjF0cmwwaWsxMmlyNjIzNnFqNzd0In0.pIcMM8kXvvOfb4SEvany9g&cachebuster=1625641871908&autocomplete=true&types=place`
    );
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  } catch (error) {
    return error;
  }
};
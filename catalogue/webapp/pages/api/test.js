export default function handler(req, res) {
  console.log(req.method);
  if (req.method !== 'POST') {
    console.log('THIS IS A GET');
    res.status(400).send({ message: 'Must be a post request' });
    return;
  } else {
    console.log('THIS IS A POST');
  }

  const body = JSON.parse(req.body);
  res.json(body);
  // the rest of your code
}

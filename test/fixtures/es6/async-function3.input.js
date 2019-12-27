async function getResponseSize(url) {
  const response = await fetch(url);
  let responseSize = 0;
  for await (const chunk of streamAsyncIterator(response.body)) {
    responseSize += chunk.length;
  }
  
  console.log(`Response Size: ${responseSize} bytes`);
  return responseSize;
}
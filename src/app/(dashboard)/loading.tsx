export default function Loading() {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
  return (
    <>
      <h1> Loading...</h1>
    </>
  );
}
